import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Mail, Phone } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase } from "@/lib/services/case-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskStatusControl } from "@/components/plan/task-status-control";
import { TaskNotes } from "@/components/plan/task-notes";
import { DocumentKind, TaskCategory, TaskPhase } from "@/lib/domain/enums";
import { describeDue, dueBadgeVariant } from "@/lib/plan/format";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/begin");

  const repo = getRepository();
  const task = await repo.getTask(taskId);
  if (!task) notFound();

  try {
    await getOwnedCase(task.caseId, user.id);
  } catch {
    notFound();
  }

  const due = describeDue(task.dueDate);

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/plan"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to your plan
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="neutral">{TaskCategory.labels[task.category]}</Badge>
        <Badge variant="outline">{TaskPhase.labels[task.phase]}</Badge>
        {due && (
          <Badge variant={dueBadgeVariant(due.urgency)}>{due.label}</Badge>
        )}
      </div>

      <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{task.title}</h1>

      {task.deadlineNote && (
        <p className="mt-3 text-sm text-muted-foreground">
          {task.deadlineType === "statutory"
            ? "Legal timing: "
            : "Suggested timing: "}
          {task.deadlineNote}
        </p>
      )}

      <div className="mt-8">
        <TaskStatusControl task={task} />
      </div>

      {task.rationale && (
        <section className="mt-10">
          <h2 className="text-xl">Why this matters</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {task.rationale}
          </p>
        </section>
      )}

      {task.steps.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl">How to do it</h2>
          <ol className="mt-4 space-y-3">
            {task.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-sm font-medium text-primary"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {task.requiredDocuments.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl">What you&rsquo;ll need</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {task.requiredDocuments.map((doc) => (
              <li key={doc}>
                <Badge variant="primary">
                  <FileText aria-hidden />
                  {DocumentKind.labels[doc]}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            You can keep these in your{" "}
            <Link
              href="/documents"
              className="text-primary underline-offset-4 hover:underline"
            >
              document vault
            </Link>
            .
          </p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl">Let me help with the hard part</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          I can draft a letter or a phone script for this, personalized and
          ready to use.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href={`/letters/new?taskId=${task.id}&type=letter`}>
              <Mail aria-hidden />
              Draft a letter
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/letters/new?taskId=${task.id}&type=phone_script`}>
              <Phone aria-hidden />
              Write a phone script
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Your notes</h2>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">
          Private to you. A good place for account numbers or who you spoke to.
        </p>
        <TaskNotes taskId={task.id} initialNotes={task.notes ?? ""} />
      </section>
    </div>
  );
}
