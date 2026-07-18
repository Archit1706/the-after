export type DueUrgency = "overdue" | "today" | "soon" | "upcoming";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Human, non-alarming description of a due date, with an urgency level for
 * styling. Uses a fixed format to avoid locale hydration mismatches.
 */
export function describeDue(
  dueDate?: string
): { label: string; urgency: DueUrgency } | null {
  if (!dueDate) return null;
  const due = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return { label: "Past its usual timing", urgency: "overdue" };
  if (diffDays === 0) return { label: "Around today", urgency: "today" };
  if (diffDays === 1) return { label: "Around tomorrow", urgency: "soon" };
  if (diffDays <= 14) return { label: `In about ${diffDays} days`, urgency: "soon" };

  const label = `${MONTHS[due.getMonth()]} ${due.getDate()}`;
  return { label: `By ${label}`, urgency: "upcoming" };
}

export function dueBadgeVariant(
  urgency: DueUrgency
): "danger" | "warning" | "primary" | "neutral" {
  switch (urgency) {
    case "overdue":
      return "danger";
    case "today":
    case "soon":
      return "warning";
    case "upcoming":
      return "primary";
  }
}
