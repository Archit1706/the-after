import "server-only";
import { z } from "zod";
import { getAi } from "@/lib/ai";
import { createLogger } from "@/lib/logger";
import { firstName } from "@/lib/utils";
import { TaskPhase } from "@/lib/domain/enums";
import type { Case } from "@/lib/domain/schemas";
import type { NewTask } from "@/lib/db/types";
import { TASK_TEMPLATES, type TaskTemplate } from "./templates";

const log = createLogger("plan");

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
const PHASE_ORDER = TaskPhase.values; // ["now","soon","later"]

function addDays(iso: string, days: number): string | undefined {
  // Parse date-only strings as local midnight so day math doesn't drift.
  const base = /^\d{4}-\d{2}-\d{2}$/.test(iso)
    ? new Date(`${iso}T00:00:00`)
    : new Date(iso);
  if (Number.isNaN(base.getTime())) return undefined;
  base.setDate(base.getDate() + days);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function templateToTask(
  template: TaskTemplate,
  caseRecord: Case,
  order: number
): NewTask {
  const dod = caseRecord.deceased.dateOfDeath;
  const dueDate =
    dod && template.dueInDays !== undefined
      ? addDays(dod, template.dueInDays)
      : undefined;

  return {
    caseId: caseRecord.id,
    title: template.title,
    rationale: template.rationale,
    steps: template.steps,
    category: template.category,
    phase: template.phase,
    priority: template.priority,
    deadlineType: template.deadlineType ?? "none",
    deadlineNote: template.deadlineNote,
    dueDate,
    requiredDocuments: template.requiredDocuments ?? [],
    institutionRefs: template.institutionRefs ?? [],
    source: "template",
    order,
  };
}

/** The deterministic backbone: filter by situation, order by phase + priority. */
export function buildBaseTasks(caseRecord: Case): NewTask[] {
  const { profile, deceased } = caseRecord;

  const applicable = TASK_TEMPLATES.filter((t) =>
    t.applies ? t.applies(profile, deceased) : true
  );

  applicable.sort((a, b) => {
    const phaseDiff =
      PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase);
    if (phaseDiff !== 0) return phaseDiff;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });

  return applicable.map((t, i) => templateToTask(t, caseRecord, i));
}

const extraTaskSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string(),
        rationale: z.string(),
        steps: z.array(z.string()).max(5),
        phase: TaskPhase.schema,
      })
    )
    .max(4),
});

/** Best-effort AI additions for situation-specific concerns. */
async function aiExtraTasks(caseRecord: Case): Promise<NewTask[]> {
  const ai = getAi();
  if (!ai.isLive) return [];

  const { profile, deceased } = caseRecord;
  const context = {
    relationship: profile.relationship,
    role: profile.userRole,
    jurisdiction: profile.jurisdiction,
    notes: profile.notes,
    concerns: profile.concerns,
    deceasedName: deceased.preferredName || deceased.fullName || "their loved one",
  };

  try {
    const result = await ai.generateObject(
      [
        {
          role: "user",
          content:
            "Based on this bereavement intake, suggest up to 4 ADDITIONAL, situation-specific practical tasks that a standard checklist might miss. Focus on the notes and concerns. Be warm, concrete, and non-duplicative of common tasks (banks, benefits, funeral, probate). Context:\n" +
            JSON.stringify(context),
        },
      ],
      extraTaskSchema,
      {
        schemaName: "extra_tasks",
        system:
          "You help grieving people with practical estate administration. Suggestions must be genuinely useful, specific, and gentle. Never invent legal deadlines.",
      }
    );

    return result.tasks.map((t, i) => ({
      caseId: caseRecord.id,
      title: t.title,
      rationale: t.rationale,
      steps: t.steps,
      phase: t.phase,
      category: "personal" as const,
      priority: "medium" as const,
      source: "ai" as const,
      order: 1000 + i,
    }));
  } catch (err) {
    log.warn("AI extra-task generation failed; using base plan only", {
      message: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

function deterministicSummary(caseRecord: Case, taskCount: number): string {
  const name = firstName(
    caseRecord.deceased.preferredName || caseRecord.deceased.fullName
  );
  const forName = name ? ` after losing ${name}` : "";
  const nowTasks = buildBaseTasks(caseRecord).filter((t) => t.phase === "now");
  const topThree = nowTasks
    .slice(0, 3)
    .map((t) => t.title.toLowerCase())
    .join(", ");

  return [
    `Here is your plan${forName}. We've organized ${taskCount} steps into what needs care right now, what can follow soon, and what can wait.`,
    topThree
      ? `Right now, the things that matter most are: ${topThree}.`
      : "",
    "Take them one at a time. Nothing here has to happen all at once, and everything you do is saved.",
  ]
    .filter(Boolean)
    .join(" ");
}

async function aiSummary(
  caseRecord: Case,
  taskCount: number
): Promise<string> {
  const ai = getAi();
  if (!ai.isLive) return deterministicSummary(caseRecord, taskCount);

  try {
    const name =
      caseRecord.deceased.preferredName ||
      caseRecord.deceased.fullName ||
      "their loved one";
    const text = await ai.generateText(
      [
        {
          role: "user",
          content: `Write a short (2–3 sentence), warm, calming summary for someone who just completed intake after losing ${name}. Their plan has ${taskCount} steps grouped into "right now", "soon", and "later". Reassure them they can go at their own pace. Address them directly. Do not use lists.`,
        },
      ],
      {
        system:
          "You are a gentle, grounded bereavement companion. Never clinical, never saccharine.",
        maxOutputTokens: 320,
      }
    );
    return text.trim() || deterministicSummary(caseRecord, taskCount);
  } catch (err) {
    log.warn("AI summary failed; using deterministic summary", {
      message: err instanceof Error ? err.message : String(err),
    });
    return deterministicSummary(caseRecord, taskCount);
  }
}

export interface GeneratedPlan {
  tasks: NewTask[];
  summary: string;
}

/** Produces the full plan: deterministic backbone + best-effort AI additions. */
export async function generatePlan(caseRecord: Case): Promise<GeneratedPlan> {
  const base = buildBaseTasks(caseRecord);
  const extra = await aiExtraTasks(caseRecord);
  const tasks = [...base, ...extra].map((t, i) => ({ ...t, order: i }));
  const summary = await aiSummary(caseRecord, tasks.length);
  return { tasks, summary };
}
