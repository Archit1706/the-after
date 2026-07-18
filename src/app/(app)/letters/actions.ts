"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase, getPrimaryCase } from "@/lib/services/case-service";
import { draftLetter } from "@/lib/letters/generate";
import type { Letter } from "@/lib/domain/schemas";
import type { Repository } from "@/lib/db/types";

async function ownedLetter(
  letterId: string
): Promise<{ repo: Repository; letter: Letter }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const repo = getRepository();
  const letter = await repo.getLetter(letterId);
  if (!letter) throw new Error("Letter not found");
  await getOwnedCase(letter.caseId, user.id);
  return { repo, letter };
}

export async function updateLetterAction(
  letterId: string,
  patch: {
    title?: string;
    recipient?: string;
    subject?: string;
    body?: string;
    status?: "draft" | "final";
  }
): Promise<void> {
  const { repo } = await ownedLetter(letterId);
  await repo.updateLetter(letterId, patch);
  revalidatePath(`/letters/${letterId}`);
  revalidatePath("/letters");
}

export async function regenerateLetterAction(
  letterId: string
): Promise<{ subject: string; body: string }> {
  const { repo, letter } = await ownedLetter(letterId);
  const caseRecord = await repo.getCase(letter.caseId);
  if (!caseRecord) throw new Error("Case not found");
  const task = letter.taskId ? await repo.getTask(letter.taskId) : null;

  const draft = await draftLetter({
    caseRecord,
    task,
    type: letter.type,
    recipientName: letter.recipient || undefined,
  });
  await repo.updateLetter(letterId, {
    subject: draft.subject,
    body: draft.body,
  });
  revalidatePath(`/letters/${letterId}`);
  return { subject: draft.subject, body: draft.body };
}

export async function deleteLetterAction(letterId: string): Promise<void> {
  const { repo } = await ownedLetter(letterId);
  await repo.deleteLetter(letterId);
  revalidatePath("/letters");
  redirect("/letters");
}

export async function createBlankLetterAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const repo = getRepository();
  const letter = await repo.createLetter({
    caseId: primary.id,
    type: "letter",
    title: "Untitled letter",
    recipient: "To whom it may concern",
    subject: "",
    body: "",
  });
  redirect(`/letters/${letter.id}`);
}
