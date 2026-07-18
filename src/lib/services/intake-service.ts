import "server-only";
import { getRepository } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { deriveFromAnswers } from "@/lib/intake/derive";
import { generatePlan } from "@/lib/plan/generate";
import type { IntakeAnswers } from "@/lib/intake/questions";

const log = createLogger("intake");

/** Persist partial intake answers so progress is never lost. */
export async function saveIntakeProgress(
  caseId: string,
  answers: IntakeAnswers
): Promise<void> {
  const { deceased, profile } = deriveFromAnswers(answers);
  await getRepository().updateCase(caseId, { deceased, profile });
}

/**
 * Finalize intake: save the profile, generate the plan, and replace any
 * previous tasks (so re-running intake regenerates cleanly).
 */
export async function completeIntake(
  caseId: string,
  answers: IntakeAnswers
): Promise<{ summary: string; taskCount: number }> {
  const repo = getRepository();
  const { deceased, profile } = deriveFromAnswers(answers);

  const updated = await repo.updateCase(caseId, {
    deceased,
    profile,
    status: "active",
  });

  const { tasks, summary } = await generatePlan(updated);

  // Clear prior tasks so regeneration doesn't duplicate.
  const existing = await repo.listTasks(caseId);
  for (const task of existing) {
    await repo.deleteTask(task.id);
  }
  const created = await repo.createTasks(tasks);

  await repo.updateCase(caseId, { summary, intakeComplete: true });
  log.info("Intake completed", { caseId, taskCount: created.length });

  return { summary, taskCount: created.length };
}
