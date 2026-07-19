"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  FileText,
  Info,
  Mail,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DocumentKind, InstitutionCategory } from "@/lib/domain/enums";
import type { Institution } from "@/lib/domain/schemas";
import {
  setCaseInstitutionStatusAction,
  trackInstitutionAction,
  untrackInstitutionAction,
} from "@/app/(app)/directory/actions";

interface Tracked {
  id: string;
  institutionId: string;
  status: string;
}

const STATUS_LABEL: Record<string, string> = {
  to_contact: "To contact",
  contacted: "Contacted",
  in_progress: "In progress",
  resolved: "Resolved",
};
const STATUS_VARIANT: Record<
  string,
  "warning" | "primary" | "success" | "neutral"
> = {
  to_contact: "warning",
  contacted: "primary",
  in_progress: "warning",
  resolved: "success",
};
const STATUS_CYCLE = ["to_contact", "contacted", "resolved"];

export function DirectoryBrowser({
  institutions,
  tracked,
  notice,
}: {
  institutions: Institution[];
  tracked: Tracked[];
  notice?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [, startTransition] = React.useTransition();

  const trackedByInst = React.useMemo(() => {
    const map = new Map<string, Tracked>();
    for (const t of tracked) if (t.institutionId) map.set(t.institutionId, t);
    return map;
  }, [tracked]);

  const categories = React.useMemo(() => {
    const present = new Set(institutions.map((i) => i.category));
    return InstitutionCategory.values.filter((c) => present.has(c));
  }, [institutions]);

  const filtered = institutions.filter((inst) => {
    if (category !== "all" && inst.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.description.toLowerCase().includes(q)
    );
  });

  function track(id: string) {
    startTransition(() => trackInstitutionAction(id));
  }
  function untrack(id: string) {
    startTransition(() => untrackInstitutionAction(id));
  }
  function cycleStatus(t: Tracked) {
    const next =
      STATUS_CYCLE[(STATUS_CYCLE.indexOf(t.status) + 1) % STATUS_CYCLE.length];
    startTransition(() => setCaseInstitutionStatusAction(t.id, next));
  }

  return (
    <div>
      {notice && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-surface-muted/60 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden />
          <p>{notice}</p>
        </div>
      )}

      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organizations…"
          className="pl-11"
          aria-label="Search organizations"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip
          active={category === "all"}
          onClick={() => setCategory("all")}
        >
          All
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
          >
            {InstitutionCategory.labels[c]}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No organizations match your search.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((inst) => {
            const t = trackedByInst.get(inst.id);
            return (
              <article
                key={inst.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg">{inst.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {inst.description}
                    </p>
                  </div>
                  {t ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => cycleStatus(t)}
                        aria-label="Change status"
                      >
                        <Badge variant={STATUS_VARIANT[t.status]}>
                          {STATUS_LABEL[t.status]}
                        </Badge>
                      </button>
                      <button
                        type="button"
                        onClick={() => untrack(t.id)}
                        aria-label={`Remove ${inst.name} from your list`}
                        className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => track(inst.id)}
                    >
                      <Plus aria-hidden />
                      Add to my list
                    </Button>
                  )}
                </div>

                {inst.contactMethods.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {inst.contactMethods.map((cm, i) => (
                      <ContactLink key={i} type={cm.type} value={cm.value} label={cm.label} />
                    ))}
                  </div>
                )}

                {inst.requiredDocuments.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      They&rsquo;ll usually want:
                    </span>
                    {inst.requiredDocuments.map((doc) => (
                      <Badge key={doc} variant="neutral">
                        <FileText aria-hidden />
                        {DocumentKind.labels[doc]}
                      </Badge>
                    ))}
                  </div>
                )}

                {inst.tips.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {inst.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/letters/new?institution=${inst.id}&type=letter`}>
                      <Mail aria-hidden />
                      Draft a letter
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ContactLink({
  type,
  value,
  label,
}: {
  type: string;
  value: string;
  label?: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:border-primary/50";

  if (type === "phone") {
    return (
      <a href={`tel:${value.replace(/[^0-9+]/g, "")}`} className={base}>
        <Phone className="size-4 text-primary" aria-hidden />
        <span>{label ? `${label}: ${value}` : value}</span>
      </a>
    );
  }
  if (type === "email") {
    return (
      <a href={`mailto:${value}`} className={base}>
        <Mail className="size-4 text-primary" aria-hidden />
        <span>{label ?? value}</span>
      </a>
    );
  }
  return (
    <a href={value} target="_blank" rel="noopener noreferrer" className={base}>
      <ExternalLink className="size-4 text-primary" aria-hidden />
      <span>{label ?? value}</span>
    </a>
  );
}
