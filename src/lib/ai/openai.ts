import OpenAI from "openai";
import { z } from "zod";
import { createLogger } from "@/lib/logger";
import { extractJson } from "./json";
import {
  AiError,
  type AiGenerateOptions,
  type AiMessage,
  type AiObjectOptions,
  type AiProvider,
} from "./types";

const log = createLogger("ai:openai");

type ChatParams = {
  messages: AiMessage[];
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
  signal?: AbortSignal;
};

function toApiMessages(
  messages: AiMessage[],
  system?: string
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const out: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  if (system) out.push({ role: "system", content: system });
  for (const m of messages) out.push({ role: m.role, content: m.content });
  return out;
}

export class OpenAiProvider implements AiProvider {
  readonly name = "openai";
  readonly isLive = true;
  readonly model: string;
  private client: OpenAI;

  constructor(opts: { apiKey: string; model: string; baseURL?: string }) {
    this.model = opts.model;
    this.client = new OpenAI({
      apiKey: opts.apiKey,
      baseURL: opts.baseURL,
      maxRetries: 2,
      timeout: 60_000,
    });
  }

  private buildBody(
    params: ChatParams
  ): OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming {
    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
      {
        model: this.model,
        messages: toApiMessages(params.messages, params.system) as never,
      };
    if (params.maxOutputTokens) {
      // GPT-5-family models use max_completion_tokens.
      body.max_completion_tokens = params.maxOutputTokens;
    }
    if (typeof params.temperature === "number") {
      body.temperature = params.temperature;
    }
    if (params.jsonMode) {
      body.response_format = { type: "json_object" };
    }
    return body;
  }

  /** Some GPT-5 variants reject custom temperature; retry once without it. */
  private async createChat(params: ChatParams): Promise<string> {
    const attempt = async (dropTemperature: boolean): Promise<string> => {
      const body = this.buildBody(
        dropTemperature ? { ...params, temperature: undefined } : params
      );
      const res = await this.client.chat.completions.create(body, {
        signal: params.signal,
      });
      return res.choices[0]?.message?.content ?? "";
    };

    try {
      return await attempt(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        typeof params.temperature === "number" &&
        /temperature|unsupported|not supported/i.test(message)
      ) {
        log.warn("Retrying without temperature", { message });
        return attempt(true);
      }
      log.error("Chat completion failed", { message });
      throw new AiError("The model request failed.", err);
    }
  }

  async generateText(
    messages: AiMessage[],
    options: AiGenerateOptions = {}
  ): Promise<string> {
    return this.createChat({
      messages,
      system: options.system,
      temperature: options.temperature,
      maxOutputTokens: options.maxOutputTokens,
      signal: options.signal,
    });
  }

  async *streamText(
    messages: AiMessage[],
    options: AiGenerateOptions = {}
  ): AsyncIterable<string> {
    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming = {
      model: this.model,
      stream: true,
      messages: toApiMessages(messages, options.system) as never,
    };
    if (options.maxOutputTokens)
      body.max_completion_tokens = options.maxOutputTokens;
    if (typeof options.temperature === "number")
      body.temperature = options.temperature;

    try {
      const stream = await this.client.chat.completions.create(body, {
        signal: options.signal,
      });
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) yield delta;
      }
    } catch (err) {
      log.error("Stream failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      throw new AiError("The model stream failed.", err);
    }
  }

  async generateObject<T>(
    messages: AiMessage[],
    schema: z.ZodType<T>,
    options: AiObjectOptions = {}
  ): Promise<T> {
    let schemaHint = "";
    try {
      // zod v4 ships a JSON Schema exporter; use it to guide the model.
      const asJson = z.toJSONSchema(schema);
      schemaHint = `\n\nReturn JSON that conforms to this JSON Schema:\n${JSON.stringify(
        asJson
      )}`;
    } catch {
      // Schema hint is best-effort; the model still gets clear instructions.
    }

    const system = [
      options.system,
      `You must respond with a single valid JSON ${
        options.schemaName ? `"${options.schemaName}" ` : ""
      }object and nothing else. Do not wrap it in prose or code fences.${schemaHint}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const run = async (extra?: AiMessage): Promise<T> => {
      const raw = await this.createChat({
        messages: extra ? [...messages, extra] : messages,
        system,
        temperature: options.temperature,
        maxOutputTokens: options.maxOutputTokens,
        jsonMode: true,
        signal: options.signal,
      });
      const parsed = extractJson(raw);
      return schema.parse(parsed);
    };

    try {
      return await run();
    } catch (err) {
      // One repair attempt: tell the model exactly what went wrong.
      log.warn("Structured parse failed; attempting repair", {
        message: err instanceof Error ? err.message : String(err),
      });
      return run({
        role: "user",
        content:
          "Your previous response could not be parsed into the required JSON shape. Respond again with only valid JSON matching the schema.",
      });
    }
  }
}
