"use client";

import * as React from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTaskStatusAction } from "@/app/(app)/plan/actions";
import type { TaskStatus as TaskStatusType } from "@/lib/domain/enums";
import type { Task } from "@/lib/domain/schemas";

export function TaskStatusControl({ task }: { task: Task }) {
  const [isPending, startTransition] = React.useTransition();
  const [status, setStatus] = React.useOptimistic<TaskStatusType>(task.status);

  function update(next: TaskStatusType) {
    startTransition(async () => {
      setStatus(next);
      try {
        await setTaskStatusAction(task.id, next);
      } catch {
        // Server value re-syncs on next render.
      }
    });
  }

  if (status === "done") {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-success/30 bg-success/8 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-medium text-success">
          <Check className="size-5" aria-hidden />
          This one&rsquo;s done. Well done for getting through it.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => update("todo")}
          disabled={isPending}
        >
          <RotateCcw aria-hidden />
          Undo
        </Button>
      </div>
    );
  }

  if (status === "snoozed" || status === "not_applicable") {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-muted/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {status === "snoozed"
            ? "You've set this aside for now. It'll be here when you're ready."
            : "You've marked this as not applicable."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => update("todo")}
          disabled={isPending}
        >
          <RotateCcw aria-hidden />
          Bring it back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <Button onClick={() => update("done")} disabled={isPending} size="lg">
        <Check aria-hidden />
        Mark as done
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
        <button
          type="button"
          onClick={() => update("snoozed")}
          disabled={isPending}
          className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Set aside for now
        </button>
        <button
          type="button"
          onClick={() => update("not_applicable")}
          disabled={isPending}
          className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          This doesn&rsquo;t apply to me
        </button>
      </div>
    </div>
  );
}
