import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ className, type = "text", ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-input bg-surface px-4 text-foreground",
        "placeholder:text-muted-foreground/70 shadow-[inset_0_1px_2px_rgba(42,37,33,0.04)]",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-55",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:outline-danger",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
}
