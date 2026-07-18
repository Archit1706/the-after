import type { z } from "zod";

export type AiRole = "system" | "user" | "assistant";

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface AiGenerateOptions {
  /** Prepended as a system message if provided. */
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
  signal?: AbortSignal;
}

export interface AiObjectOptions extends AiGenerateOptions {
  /** Name for the schema, surfaced to the model for better adherence. */
  schemaName?: string;
}

/**
 * Provider-agnostic surface used by every AI "skill" in the app. The two
 * concrete implementations are the live OpenAI (GPT-5.6) provider and a
 * deterministic demo provider used when no key is configured.
 */
export interface AiProvider {
  readonly name: string;
  /** True only for the real model; skills use this to pick smart fallbacks. */
  readonly isLive: boolean;
  readonly model: string;

  generateText(
    messages: AiMessage[],
    options?: AiGenerateOptions
  ): Promise<string>;

  streamText(
    messages: AiMessage[],
    options?: AiGenerateOptions
  ): AsyncIterable<string>;

  generateObject<T>(
    messages: AiMessage[],
    schema: z.ZodType<T>,
    options?: AiObjectOptions
  ): Promise<T>;
}

export class AiError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "AiError";
  }
}
