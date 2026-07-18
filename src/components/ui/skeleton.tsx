import * as React from "react";
import { cn } from "@/lib/utils";

/** Gentle placeholder for loading states. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-surface-muted",
        className
      )}
      {...props}
    />
  );
}
