"use client";

import * as React from "react";
import { Download, Eye, FileText, Minus, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { DocumentKind } from "@/lib/domain/enums";
import type { CaseDocument } from "@/lib/domain/schemas";
import {
  deleteDocumentAction,
  updateDocumentAction,
} from "@/app/(app)/documents/actions";

function formatSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentCard({ doc }: { doc: CaseDocument }) {
  const [isPending, startTransition] = React.useTransition();
  const [copies, setCopies] = React.useOptimistic(doc.copiesOnHand ?? 0);

  function setCopiesCount(next: number) {
    const value = Math.max(0, next);
    startTransition(async () => {
      setCopies(value);
      try {
        await updateDocumentAction(doc.id, { copiesOnHand: value });
      } catch {
        // Re-syncs on next render.
      }
    });
  }

  function remove() {
    if (!window.confirm(`Delete “${doc.name}”? This can't be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteDocumentAction(doc.id);
      } catch {
        // No-op.
      }
    });
  }

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <FileText className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{doc.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{DocumentKind.labels[doc.kind]}</Badge>
            <span className="text-xs text-muted-foreground">
              {[formatSize(doc.size), formatDate(doc.createdAt)]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          aria-label={`Delete ${doc.name}`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="size-4.5" aria-hidden />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={`/api/documents/${doc.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-surface-muted"
        >
          <Eye className="size-4" aria-hidden />
          View
        </a>
        <a
          href={`/api/documents/${doc.id}?download=1`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-surface-muted"
        >
          <Download className="size-4" aria-hidden />
          Download
        </a>
      </div>

      {doc.kind === "death_certificate" && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-surface-muted/60 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Certified copies on hand
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCopiesCount(copies - 1)}
              disabled={isPending || copies <= 0}
              aria-label="One fewer copy"
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg border border-border",
                "hover:bg-surface disabled:opacity-40"
              )}
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="w-6 text-center font-medium tabular-nums">
              {copies}
            </span>
            <button
              type="button"
              onClick={() => setCopiesCount(copies + 1)}
              disabled={isPending}
              aria-label="One more copy"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border hover:bg-surface"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
