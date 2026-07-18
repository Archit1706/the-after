import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
        <Icon className="size-7" aria-hidden />
      </span>
      <h3 className="text-xl">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
