import { cn } from "@/lib/utils";

/** A quiet dawn-over-horizon mark: light returning after the night. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-8", className)}
    >
      <circle cx="16" cy="18" r="7" className="fill-accent/85" />
      <path
        d="M2 22h28"
        className="stroke-primary"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M7 27h18"
        className="stroke-primary/45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 4v3.5M25.5 7.5l-2.4 2.4M6.5 7.5l2.4 2.4"
        className="stroke-accent/70"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && (
        <span className="font-serif text-xl font-medium tracking-tight text-foreground">
          The After
        </span>
      )}
    </span>
  );
}
