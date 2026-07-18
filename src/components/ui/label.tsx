import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Renders a subtle "optional" hint after the label text. */
  optional?: boolean;
}

export function Label({
  className,
  children,
  optional,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {optional && (
        <span className="text-xs font-normal text-muted-foreground">
          (optional)
        </span>
      )}
    </label>
  );
}
