"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { generatePlan } from "@/lib/plan/generate";

export async function restartIntakeAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");
  await getRepository().updateCase(primary.id, { intakeComplete: false });
  redirect("/begin");
}

export async function regeneratePlanAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const repo = getRepository();
  const { tasks, summary } = await generatePlan(primary);
  const existing = await repo.listTasks(primary.id);
  for (const task of existing) await repo.deleteTask(task.id);
  await repo.createTasks(tasks);
  await repo.updateCase(primary.id, { summary });

  revalidatePath("/plan");
  redirect("/plan");
}

export async function deleteEverythingAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const primary = await getPrimaryCase(user.id);
  if (primary) await getRepository().deleteCase(primary.id);
  redirect("/begin");
}
