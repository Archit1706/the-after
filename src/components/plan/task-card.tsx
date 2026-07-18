"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskCategory } from "@/lib/domain/enums";
import { describeDue, dueBadgeVariant } from "@/lib/plan/format";
import { setTaskStatusAction } from "@/app/(app)/plan/actions";
import type { Task } from "@/lib/domain/schemas";

export function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = React.useTransition();
  const [done, setDone] = React.useOptimistic(task.status === "done");

  function toggle() {
    startTransition(async () => {
      setDone(!done);
      try {
        await setTaskStatusAction(task.id, done ? "todo" : "done");
      } catch {
        // The server value re-syncs on the next render.
      }
    });
  }

  const due = describeDue(task.dueDate);

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors",
        done && "bg-surface-muted/40"
      )}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={done}
        aria-label={done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-all",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          done
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border hover:border-primary"
        )}
      >
        {done && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
      </button>

      <div className="min-w-0 flex-1">
        <Link
          href={`/plan/tasks/${task.id}`}
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <h3
            className={cn(
              "font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary",
              done && "text-muted-foreground line-through decoration-1"
            )}
          >
            {task.title}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">{TaskCategory.labels[task.category]}</Badge>
          {due && !done && (
            <Badge variant={dueBadgeVariant(due.urgency)}>{due.label}</Badge>
          )}
          {task.priority === "high" && !done && (
            <Badge variant="accent">Important</Badge>
          )}
        </div>
      </div>

      <Link
        href={`/plan/tasks/${task.id}`}
        aria-label={`Open ${task.title}`}
        className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
      >
        <ChevronRight className="size-5" aria-hidden />
      </Link>
    </div>
  );
}
