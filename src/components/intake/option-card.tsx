"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OptionCard({
  label,
  description,
  selected,
  multi = false,
  onSelect,
}: {
  label: string;
  description?: string;
  selected: boolean;
  multi?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected
          ? "border-primary bg-primary/8 shadow-soft"
          : "border-border bg-surface hover:border-primary/50 hover:bg-surface-muted/60"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
          multi ? "rounded-md" : "rounded-full",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-surface group-hover:border-primary/50"
        )}
        aria-hidden
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </span>
    </button>
  );
}
