"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase } from "@/lib/services/case-service";
import { TaskStatus } from "@/lib/domain/enums";
import type { Repository } from "@/lib/db/types";
import type { Task } from "@/lib/domain/schemas";

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
