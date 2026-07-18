"use client";

import * as React from "react";
import { RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteEverythingAction,
  regeneratePlanAction,
  restartIntakeAction,
} from "@/app/(app)/settings/actions";

export function SettingsActions() {
  const [pending, startTransition] = React.useTransition();

  function run(fn: () => Promise<void>, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    startTransition(async () => {
      try {
        await fn();
      } catch {
        // Redirects handle the happy path.
      }
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg">Your plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Refresh your plan from your current answers, or go through the
          intake again if your situation has changed.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              run(
                regeneratePlanAction,
                "Regenerate your plan? This rebuilds your task list and resets progress on it."
              )
            }
            disabled={pending}
          >
            <RefreshCw aria-hidden />
            Regenerate my plan
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              run(
                restartIntakeAction,
                "Go through the intake again? Your current answers will be pre-filled."
              )
            }
            disabled={pending}
          >
            <RotateCcw aria-hidden />
            Redo the intake
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-danger/30 bg-danger/5 p-5">
        <h2 className="text-lg text-danger">Delete everything</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently remove this case and everything in it — tasks, letters,
          documents, and conversations. This can&rsquo;t be undone.
        </p>
        <div className="mt-4">
          <Button
            variant="danger"
            onClick={() =>
              run(
                deleteEverythingAction,
                "Delete everything for this person? This permanently removes all tasks, letters, documents, and conversations, and cannot be undone."
              )
            }
            disabled={pending}
          >
            <Trash2 aria-hidden />
            Delete everything
          </Button>
        </div>
      </section>
    </div>
  );
}
