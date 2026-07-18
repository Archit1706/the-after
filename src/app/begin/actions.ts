"use server";

import { getCurrentUser } from "@/lib/auth/session";
import { getOwnedCase } from "@/lib/services/case-service";
import {
  completeIntake,
  saveIntakeProgress,
} from "@/lib/services/intake-service";
import type { IntakeAnswers } from "@/lib/intake/questions";

async function requireUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Please sign in to continue.");
  return user.id;
}

export async function saveProgressAction(
  caseId: string,
  answers: IntakeAnswers
): Promise<{ ok: true }> {
  const userId = await requireUserId();
  await getOwnedCase(caseId, userId);
  await saveIntakeProgress(caseId, answers);
  return { ok: true };
}

export async function completeIntakeAction(
  caseId: string,
  answers: IntakeAnswers
): Promise<{ ok: true; summary: string; taskCount: number }> {
  const userId = await requireUserId();
  await getOwnedCase(caseId, userId);
  const result = await completeIntake(caseId, answers);
  return { ok: true, ...result };
}
