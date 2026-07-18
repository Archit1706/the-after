import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { PlanHeader } from "@/components/plan/plan-header";
import { TaskGroup } from "@/components/plan/task-group";
import type { Task } from "@/lib/domain/schemas";

export const metadata = { title: "Your plan" };

export default async function PlanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");

  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const tasks = await getRepository().listTasks(primary.id);
  const done = tasks.filter((t) => t.status === "done").length;

  const byPhase: Record<"now" | "soon" | "later", Task[]> = {
    now: [],
    soon: [],
    later: [],
  };
  for (const task of tasks) byPhase[task.phase].push(task);

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-5 py-8 sm:px-8 sm:py-12">
      <PlanHeader caseRecord={primary} total={tasks.length} done={done} />
      <TaskGroup phase="now" tasks={byPhase.now} />
      <TaskGroup phase="soon" tasks={byPhase.soon} />
      <TaskGroup phase="later" tasks={byPhase.later} />
    </div>
  );
}
