"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FieldProps {
  label: string;
  /** A single form control (Input, Textarea, select, etc.). */
  children: React.ReactElement<{
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false";
    required?: boolean;
  }>;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

/**
 * Accessible form field: associates the label with the control and wires
 * aria-describedby / aria-invalid to the hint and error automatically.
 */
export function Field({
  label,
  children,
  hint,
  error,
  required,
  optional,
  className,
}: FieldProps) {
  const reactId = React.useId();
  const controlId = children.props.id ?? `field-${reactId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = React.cloneElement(children, {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    required: required ?? children.props.required,
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={controlId} optional={optional}>
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            *
          </span>
        )}
      </Label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
