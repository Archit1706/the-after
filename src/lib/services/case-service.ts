import "server-only";
import { getRepository } from "@/lib/db";
import type { Case } from "@/lib/domain/schemas";

/** The user's primary case, or null if they haven't started one. */
export async function getPrimaryCase(userId: string): Promise<Case | null> {
  return getRepository().getPrimaryCase(userId);
}

/** Ensure the user has a case, creating an empty intake case if needed. */
export async function getOrCreateCase(userId: string): Promise<Case> {
  const repo = getRepository();
  const existing = await repo.getPrimaryCase(userId);
  return existing ?? repo.createCase({ userId });
}

/** Fetch a case, asserting the current user owns it. Throws otherwise. */
export async function getOwnedCase(
  caseId: string,
  userId: string
): Promise<Case> {
  const record = await getRepository().getCase(caseId);
  if (!record || record.userId !== userId) {
    throw new Error("Case not found");
  }
  return record;
}
