import { features } from "@/lib/env";
import { createLogger } from "@/lib/logger";
import { MemoryRepository } from "./memory";
import { SupabaseRepository } from "./supabase-repo";
import type { Repository } from "./types";

export * from "./types";

const log = createLogger("db");

// Cache on globalThis so the in-memory store survives dev HMR reloads.
const globalRef = globalThis as unknown as { __afterRepository?: Repository };

/**
 * Returns the active repository: the Supabase-backed store when configured,
 * otherwise the in-memory demo store. The Supabase repository is stateless
 * (its client is resolved per request), so caching a single instance is safe.
 */
export function getRepository(): Repository {
  if (globalRef.__afterRepository) return globalRef.__afterRepository;

  const repo: Repository = features.supabase
    ? new SupabaseRepository()
    : new MemoryRepository();
  log.info(`Using ${repo.kind} repository`);
  globalRef.__afterRepository = repo;
  return repo;
}
