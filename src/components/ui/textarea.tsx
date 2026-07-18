import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({ className, ref, ...props }: TextareaProps) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-lg border border-input bg-surface px-4 py-3 text-foreground",
        "placeholder:text-muted-foreground/70 shadow-[inset_0_1px_2px_rgba(42,37,33,0.04)]",
        "resize-y leading-relaxed transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-55",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:outline-danger",
        className
      )}
      {...props}
    />
  );
}
