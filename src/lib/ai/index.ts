import { features, serverEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";
import { MockProvider } from "./mock";
import { OpenAiProvider } from "./openai";
import type { AiProvider } from "./types";

export * from "./types";

const log = createLogger("ai");

let cached: AiProvider | null = null;

/**
 * Returns the active AI provider — live GPT-5.6 when a key is configured,
 * otherwise the deterministic demo provider. Cached for the process lifetime.
 */
export function getAi(): AiProvider {
  if (cached) return cached;

  if (features.ai && serverEnv.openaiApiKey) {
    log.info(`Using live model: ${serverEnv.openaiModel}`);
    cached = new OpenAiProvider({
      apiKey: serverEnv.openaiApiKey,
      model: serverEnv.openaiModel,
      baseURL: serverEnv.openaiBaseUrl,
    });
  } else {
    log.info("Using deterministic demo model (no OPENAI_API_KEY set)");
    cached = new MockProvider();
  }

  return cached;
}

/** Test/util seam to reset the cached provider. */
export function resetAiProvider() {
  cached = null;
}
