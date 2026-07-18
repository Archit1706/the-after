import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { getAi, type AiMessage } from "@/lib/ai";
import { buildCompanionSystemPrompt } from "@/lib/companion/context";
import { createLogger } from "@/lib/logger";

const log = createLogger("api:companion");

export async function POST(req: Request): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const primary = await getPrimaryCase(user.id);
  if (!primary) return new Response("No active case", { status: 400 });

  let message: unknown;
  try {
    ({ message } = await req.json());
  } catch {
    return new Response("Invalid body", { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return new Response("Message is required", { status: 400 });
  }

  const repo = getRepository();
  await repo.createMessage({
    caseId: primary.id,
    thread: "companion",
    role: "user",
    content: message.trim(),
  });

  const history = await repo.listMessages(primary.id, "companion");
  const tasks = await repo.listTasks(primary.id);
  const system = buildCompanionSystemPrompt(primary, tasks);

  const aiMessages: AiMessage[] = history
    .slice(-12)
    .map((m) => ({ role: m.role as AiMessage["role"], content: m.content }));

  const ai = getAi();
  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of ai.streamText(aiMessages, {
          system,
          temperature: 0.7,
          maxOutputTokens: 600,
        })) {
          full += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        log.error("Companion stream failed", {
          message: err instanceof Error ? err.message : String(err),
        });
        if (!full) {
          full =
            "I'm sorry — I had trouble responding just now. Please try again in a moment.";
          controller.enqueue(encoder.encode(full));
        }
      } finally {
        controller.close();
        try {
          await repo.createMessage({
            caseId: primary.id,
            thread: "companion",
            role: "assistant",
            content: full,
          });
        } catch {
          // Non-fatal: the reply was delivered even if it wasn't saved.
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
