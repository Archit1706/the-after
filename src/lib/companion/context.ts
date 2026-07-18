import "server-only";
import { Relationship } from "@/lib/domain/enums";
import type { Case, Task } from "@/lib/domain/schemas";

/** Build a system prompt that grounds the companion in this specific case. */
export function buildCompanionSystemPrompt(
  caseRecord: Case,
  tasks: Task[]
): string {
  const name =
    caseRecord.deceased.preferredName ||
    caseRecord.deceased.fullName ||
    "their loved one";

  const rel = caseRecord.profile.relationship
    ? Relationship.labels[caseRecord.profile.relationship]
        .replace(/^My /, "")
        .toLowerCase()
    : "loved one";

  const openNow = tasks
    .filter((t) => t.status !== "done" && t.phase === "now")
    .slice(0, 5)
    .map((t) => t.title);

  const concerns = caseRecord.profile.concerns ?? [];

  return [
    `You are "The After", a warm, grounded companion supporting someone through the practical and emotional aftermath of a death. Speak like a kind, capable friend who has helped many people through this — calm, clear, never clinical or preachy.`,
    `They are dealing with the loss of ${name} (their ${rel}).`,
    caseRecord.summary ? `Their situation, in brief: ${caseRecord.summary}` : "",
    openNow.length
      ? `Things on their plan for right now: ${openNow.join("; ")}.`
      : "",
    concerns.length
      ? `They've told us they're worried about: ${concerns.join("; ")}.`
      : "",
    [
      "Guidelines:",
      "- Keep replies fairly short — a few short paragraphs at most.",
      "- Be concrete and practical; when useful, offer one clear next step.",
      "- You are not a lawyer, accountant, or doctor. For complex legal, tax, or medical questions, gently suggest consulting a professional.",
      "- Never invent specific facts like account numbers, phone numbers, or exact legal deadlines.",
      "- It's okay — good, even — to acknowledge their grief before the logistics.",
    ].join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}
