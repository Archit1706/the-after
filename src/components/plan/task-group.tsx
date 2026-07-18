import { TaskPhase } from "@/lib/domain/enums";
import type { Task } from "@/lib/domain/schemas";
import { TaskCard } from "./task-card";

const PHASE_SUBTITLE: Record<string, string> = {
  now: "The few things worth attention in these first days.",
  soon: "Important, but they can wait until you have a moment.",
  later: "For the weeks and months ahead. No rush at all.",
};

export function TaskGroup({
  phase,
  tasks,
}: {
  phase: "now" | "soon" | "later";
  tasks: Task[];
}) {
  if (tasks.length === 0) return null;

  const open = tasks.filter((t) => t.status !== "done").length;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-2xl">{TaskPhase.labels[phase]}</h2>
          <p className="text-sm text-muted-foreground">
            {PHASE_SUBTITLE[phase]}
          </p>
        </div>
        <span className="shrink-0 text-sm text-muted-foreground">
          {open === 0 ? "All done" : `${open} left`}
        </span>
      </div>
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
