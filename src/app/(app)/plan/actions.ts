"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase } from "@/lib/services/case-service";
import { getAi } from "@/lib/ai";
import { TaskStatus } from "@/lib/domain/enums";
import type { Repository } from "@/lib/db/types";
import { taskQuestionSchema, type Task } from "@/lib/domain/schemas";

async function assertTaskOwner(
  taskId: string
): Promise<{ repo: Repository; task: Task }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const repo = getRepository();
  const task = await repo.getTask(taskId);
  if (!task) throw new Error("Task not found");
  await getOwnedCase(task.caseId, user.id);
  return { repo, task };
}

export async function setTaskStatusAction(
  taskId: string,
  status: string
): Promise<void> {
  const parsed = TaskStatus.schema.parse(status);
  const { repo } = await assertTaskOwner(taskId);
  await repo.updateTask(taskId, {
    status: parsed,
    completedAt: parsed === "done" ? new Date().toISOString() : undefined,
  });
  revalidatePath("/plan");
  revalidatePath(`/plan/tasks/${taskId}`);
}

export async function updateTaskNotesAction(
  taskId: string,
  notes: string
): Promise<void> {
  const { repo } = await assertTaskOwner(taskId);
  await repo.updateTask(taskId, { notes });
  revalidatePath(`/plan/tasks/${taskId}`);
}

export async function askAboutTaskAction(
  taskId: string,
  question: string
): Promise<string> {
  const parsedQuestion = taskQuestionSchema.parse(question);
  const { task } = await assertTaskOwner(taskId);
  const ai = getAi();

  return ai.generateText(
    [
      {
        role: "user",
        content: parsedQuestion,
      },
    ],
    {
      maxOutputTokens: 450,
      system: [
        "You are The After, a warm, practical companion for someone handling tasks after a loss.",
        "Answer only the question about the task below. Be concise, clear, and gentle. Offer one next step when it helps.",
        "Do not invent legal requirements, exact deadlines, contacts, or account information. This is general guidance, not legal, tax, or financial advice.",
        `Task: ${task.title}`,
        task.rationale ? `Why it matters: ${task.rationale}` : "",
        task.steps.length ? `Suggested steps: ${task.steps.join(" | ")}` : "",
        task.deadlineNote ? `Timing note: ${task.deadlineNote}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    }
  );
}
