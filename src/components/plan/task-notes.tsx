"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateTaskNotesAction } from "@/app/(app)/plan/actions";

export function TaskNotes({
  taskId,
  initialNotes,
}: {
  taskId: string;
  initialNotes: string;
}) {
  const [value, setValue] = React.useState(initialNotes);
  const [saved, setSaved] = React.useState(initialNotes);
  const [isPending, startTransition] = React.useTransition();
  const [justSaved, setJustSaved] = React.useState(false);

  const dirty = value !== saved;

  function save() {
    startTransition(async () => {
      try {
        await updateTaskNotesAction(taskId, value);
        setSaved(value);
        setJustSaved(true);
        window.setTimeout(() => setJustSaved(false), 2000);
      } catch {
        // Leave the text as-is so nothing is lost.
      }
    });
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Anything you want to remember — account numbers, who you spoke to, what's left to do…"
        className="min-h-28"
        aria-label="Your notes for this task"
      />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={save}
          disabled={!dirty || isPending}
          loading={isPending}
        >
          Save note
        </Button>
        {justSaved && !dirty && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <Check className="size-4" aria-hidden />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
