import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { draftLetter } from "@/lib/letters/generate";
import { LetterType } from "@/lib/domain/enums";
import type { Task } from "@/lib/domain/schemas";

/**
 * Generates (or reuses) a draft for a given task, then redirects into the
 * editor. Reuse keeps the same link idempotent so revisiting doesn't
 * create duplicates.
 */
export default async function NewLetterPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string; type?: string }>;
}) {
  const { taskId, type: typeParam } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/begin");

  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const type = LetterType.schema.catch("letter").parse(typeParam);
  const repo = getRepository();

  let task: Task | null = null;
  if (taskId) {
    const found = await repo.getTask(taskId);
    if (found && found.caseId === primary.id) task = found;
  }

  if (task) {
    const existing = (await repo.listLetters(primary.id)).find(
      (l) => l.taskId === task!.id && l.type === type
    );
    if (existing) redirect(`/letters/${existing.id}`);
  }

  const draft = await draftLetter({ caseRecord: primary, task, type });
  const letter = await repo.createLetter({
    caseId: primary.id,
    taskId: task?.id,
    type,
    title: draft.title,
    recipient: draft.recipient,
    subject: draft.subject,
    body: draft.body,
  });

  redirect(`/letters/${letter.id}`);
}
