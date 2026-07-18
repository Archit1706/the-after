import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { draftLetter } from "@/lib/letters/generate";
import { getInstitution } from "@/lib/directory/institutions";
import { LetterType } from "@/lib/domain/enums";
import type { Task } from "@/lib/domain/schemas";

// Drafting a letter calls the model; allow headroom over the default.
export const maxDuration = 60;

/**
 * Generates (or reuses) a draft for a given task, then redirects into the
 * editor. Reuse keeps the same link idempotent so revisiting doesn't
 * create duplicates.
 */
export default async function NewLetterPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string; type?: string; institution?: string }>;
}) {
  const {
    taskId,
    type: typeParam,
    institution: institutionId,
  } = await searchParams;
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

  const institution = institutionId ? getInstitution(institutionId) : undefined;

  // Reuse an existing draft so the same link is idempotent.
  const existing = (await repo.listLetters(primary.id)).find((l) => {
    if (l.type !== type) return false;
    if (task) return l.taskId === task.id;
    if (institution) return l.institutionRef === institution.id;
    return false;
  });
  if (existing) redirect(`/letters/${existing.id}`);

  const draft = await draftLetter({
    caseRecord: primary,
    task,
    type,
    recipientName: institution?.name,
  });
  const letter = await repo.createLetter({
    caseId: primary.id,
    taskId: task?.id,
    institutionRef: institution?.id,
    type,
    title: institution ? `${draft.title} — ${institution.name}` : draft.title,
    recipient: institution?.name ?? draft.recipient,
    subject: draft.subject,
    body: draft.body,
  });

  redirect(`/letters/${letter.id}`);
}
