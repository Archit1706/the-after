import * as React from "react";
import { cn } from "@/lib/utils";

const widths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof widths;
}

/** Centered content column with responsive gutters. */
export function Container({
  size = "lg",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        widths[size],
        className
      )}
      {...props}
    />
  );
}
