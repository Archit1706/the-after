import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, resolving conflicts predictably.
 * `cn("px-2", cond && "px-4")` → "px-4".
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Non-cryptographic id for client-side keys and optimistic records. */
export function createId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}${rand}`;
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Title-case a person's name while leaving already-cased words alone. */
export function toTitleCase(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((word) =>
      word.length <= 1
        ? word.toUpperCase()
        : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/** A person's given name, for warm, direct address. */
export function firstName(fullName?: string | null): string {
  if (!fullName) return "";
  return fullName.trim().split(/\s+/)[0] ?? "";
}

/** Pause helper for retries and gentle pacing. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Locale-stable short date like "Jul 18, 2026". Empty string if invalid. */
export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
