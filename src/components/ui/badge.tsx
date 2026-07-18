import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-tight [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface-muted text-muted-foreground",
        primary:
          "border-transparent bg-primary/12 text-primary [&_svg]:text-primary",
        accent: "border-transparent bg-accent/15 text-accent",
        success: "border-transparent bg-success/14 text-success",
        warning: "border-transparent bg-warning/16 text-warning",
        danger: "border-transparent bg-danger/14 text-danger",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
