import { createLogger } from "@/lib/logger";
import { MemoryRepository } from "./memory";
import type { Repository } from "./types";

export * from "./types";

const log = createLogger("db");

// Cache on globalThis so the in-memory store survives dev HMR reloads.
const globalRef = globalThis as unknown as { __afterRepository?: Repository };

/**
 * Returns the active repository. Today this is the in-memory demo store; the
 * Supabase-backed store slots in behind the same interface once configured.
 */
export function getRepository(): Repository {
  if (globalRef.__afterRepository) return globalRef.__afterRepository;

  const repo = new MemoryRepository();
  log.info(`Using ${repo.kind} repository`);
  globalRef.__afterRepository = repo;
  return repo;
}
