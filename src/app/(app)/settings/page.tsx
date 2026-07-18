import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { SettingsActions } from "@/components/settings/settings-actions";
import { Relationship } from "@/lib/domain/enums";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Settings" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const { deceased, profile } = primary;
  const relationship = profile.relationship
    ? Relationship.labels[profile.relationship]
    : "Not specified";

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your plan, your account, and your information."
      />

      <div className="space-y-8">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-lg">Your account</h2>
          <dl className="mt-3">
            <Row
              label="Signed in as"
              value={user.email || (user.isGuest ? "Guest (no account)" : "You")}
            />
            <Row label="Relationship" value={relationship} />
            {deceased.fullName && <Row label="Name" value={deceased.fullName} />}
            {deceased.dateOfDeath && (
              <Row label="Date of passing" value={formatDate(deceased.dateOfDeath)} />
            )}
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-lg">Your information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Download a copy of everything you&rsquo;ve added, as a single file.
          </p>
          <a
            href="/api/export"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-muted"
          >
            <Download className="size-4" aria-hidden />
            Export my information
          </a>
        </section>

        <SettingsActions />
      </div>
    </PageContainer>
  );
}
