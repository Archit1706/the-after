"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { askAboutTaskAction } from "@/app/(app)/plan/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TaskQuestion({ taskId }: { taskId: string }) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function ask() {
    setError(null);
    setAnswer(null);
    startTransition(async () => {
      try {
        setAnswer(await askAboutTaskAction(taskId, question));
      } catch {
        setError("I couldn’t answer that just now. Please try again in a moment.");
      }
    });
  }

  return (
    <section className="mt-10 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <MessageCircle className="size-5 text-primary" aria-hidden />
        <h2 className="text-xl">Ask about this step</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        If something feels unclear, ask in your own words. We&rsquo;ll keep the
        answer focused on this task.
      </p>
      <Textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="What would you like to know about this step?"
        aria-label="Question about this step"
        className="mt-4 min-h-24"
        maxLength={1000}
      />
      <div className="mt-3 flex items-center gap-3">
        <Button onClick={ask} disabled={!question.trim() || isPending} loading={isPending}>
          Ask for guidance
        </Button>
        <span className="text-xs text-muted-foreground">
          General guidance, not legal or financial advice.
        </span>
      </div>
      {answer && (
        <div className="mt-5 whitespace-pre-wrap rounded-lg bg-background px-4 py-3 leading-relaxed">
          {answer}
        </div>
      )}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </section>
  );
}
