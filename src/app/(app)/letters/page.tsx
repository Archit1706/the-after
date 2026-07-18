import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, PenLine, Phone, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LetterType } from "@/lib/domain/enums";
import { formatDate } from "@/lib/utils";
import { createBlankLetterAction } from "./actions";

export const metadata = { title: "Letters & scripts" };

export default async function LettersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const letters = await getRepository().listLetters(primary.id);

  return (
    <PageContainer>
      <PageHeader
        title="Letters & scripts"
        description="Drafts we've prepared for you — edit, copy, print, or save any of them."
      >
        <form action={createBlankLetterAction}>
          <Button type="submit">
            <Plus aria-hidden />
            New letter
          </Button>
        </form>
      </PageHeader>

      {letters.length === 0 ? (
        <EmptyState
          icon={PenLine}
          title="No letters yet"
          description="Open a task on your plan and choose “Draft a letter” — or start a blank one here."
        >
          <Button asChild variant="outline">
            <Link href="/plan">Go to your plan</Link>
          </Button>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {letters.map((letter) => (
            <li key={letter.id}>
              <Link
                href={`/letters/${letter.id}`}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  {letter.type === "phone_script" ? (
                    <Phone className="size-5" aria-hidden />
                  ) : (
                    <Mail className="size-5" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif text-lg">
                    {letter.title}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {letter.recipient || "No recipient yet"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="neutral">
                      {LetterType.labels[letter.type]}
                    </Badge>
                    {letter.status === "final" && (
                      <Badge variant="success">Final</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Updated {formatDate(letter.updatedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
