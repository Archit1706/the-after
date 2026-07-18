import { Progress } from "@/components/ui/progress";
import { firstName } from "@/lib/utils";
import type { Case } from "@/lib/domain/schemas";

export function PlanHeader({
  caseRecord,
  total,
  done,
}: {
  caseRecord: Case;
  total: number;
  done: number;
}) {
  const name = firstName(
    caseRecord.deceased.preferredName || caseRecord.deceased.fullName
  );
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Your plan</p>
        <h1 className="mt-1 text-3xl sm:text-4xl">
          {name ? `Caring for ${name}’s affairs` : "Your plan"}
        </h1>
        {caseRecord.summary && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {caseRecord.summary}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Your progress</span>
          <span className="text-muted-foreground">
            {done} of {total} done
          </span>
        </div>
        <Progress value={pct} label="Overall progress" className="mt-3" />
        {done === total && total > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You&rsquo;ve worked through everything here. Be gentle with
            yourself &mdash; that was a lot.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            One step at a time is more than enough.
          </p>
        )}
      </div>
    </div>
  );
}
