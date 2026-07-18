import * as React from "react";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value: number;
  /** Accessible description of what is progressing. */
  label?: string;
}

export function Progress({
  value,
  label,
  className,
  ...props
}: ProgressProps) {
  const pct = clamp(Math.round(value), 0, 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-muted",
        className
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
