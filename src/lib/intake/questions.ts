import { Relationship, UserRole } from "@/lib/domain/enums";

export type IntakeAnswers = {
  relationship?: string;
  relationshipOther?: string;
  deceasedName?: string;
  preferredName?: string;
  pronouns?: string;
  dateOfDeath?: string;
  userRole?: string;
  country?: string;
  region?: string;
  livingSituation?: string;
  hasWill?: string;
  employment?: string;
  life?: string[];
  concerns?: string;
};

export type IntakeStepKind =
  | "intro"
  | "text"
  | "longtext"
  | "single"
  | "multi"
  | "date"
  | "outro";

export interface IntakeOption {
  value: string;
  label: string;
  description?: string;
}

export interface IntakeStep {
  id: string;
  kind: IntakeStepKind;
  /** Which answer field this step fills. */
  key?: keyof IntakeAnswers;
  /** The companion's words. */
  prompt: string;
  helper?: string;
  placeholder?: string;
  optional?: boolean;
  options?: IntakeOption[];
  /** Only shown when this predicate passes. */
  when?: (answers: IntakeAnswers) => boolean;
}

export const INTAKE_STEPS: IntakeStep[] = [
  {
    id: "intro",
    kind: "intro",
    prompt:
      "I'm so sorry for your loss. I'm here to help with the practical side of things, gently and at your pace.",
    helper:
      "I'll ask a few questions to understand your situation. Answer only what you're comfortable with, skip anything you'd rather not, and stop whenever you need to. Everything is saved as you go.",
  },
  {
    id: "relationship",
    kind: "single",
    key: "relationship",
    prompt: "Who are we honoring together?",
    helper: "This helps me use the right words and focus on what matters to you.",
    options: Relationship.options,
  },
  {
    id: "relationshipOther",
    kind: "text",
    key: "relationshipOther",
    prompt: "How were they connected to you?",
    placeholder: "In your own words",
    optional: true,
    when: (a) => a.relationship === "other",
  },
  {
    id: "name",
    kind: "text",
    key: "deceasedName",
    prompt: "What was their name?",
    helper: "Just a first name is completely fine.",
    placeholder: "Their name",
    optional: true,
  },
  {
    id: "pronouns",
    kind: "single",
    key: "pronouns",
    prompt: "Which words should I use for them?",
    optional: true,
    options: [
      { value: "she/her", label: "She / her" },
      { value: "he/him", label: "He / him" },
      { value: "they/them", label: "They / them" },
      { value: "skip", label: "I'd rather not say" },
    ],
  },
  {
    id: "dateOfDeath",
    kind: "date",
    key: "dateOfDeath",
    prompt: "When did they pass?",
    helper:
      "This helps me suggest sensible timing for each step. It's completely okay to skip.",
    optional: true,
  },
  {
    id: "userRole",
    kind: "single",
    key: "userRole",
    prompt: "And what's your role in handling things?",
    helper: "There's no wrong answer, and it can change over time.",
    options: UserRole.options,
  },
  {
    id: "country",
    kind: "text",
    key: "country",
    prompt: "Where are their affairs being handled?",
    helper: "Rules and deadlines vary by place, so this helps me tailor your plan.",
    placeholder: "Country",
    optional: true,
  },
  {
    id: "region",
    kind: "text",
    key: "region",
    prompt: "And the state or region, if you know it?",
    placeholder: "State, province, or region",
    optional: true,
    when: (a) => Boolean(a.country),
  },
  {
    id: "livingSituation",
    kind: "single",
    key: "livingSituation",
    prompt: "What was their living situation?",
    optional: true,
    options: [
      { value: "owned", label: "They owned their home" },
      { value: "rented", label: "They rented" },
      { value: "with_others", label: "They lived with family or others" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "hasWill",
    kind: "single",
    key: "hasWill",
    prompt: "Did they leave a will?",
    optional: true,
    options: [
      { value: "yes", label: "Yes, there's a will" },
      { value: "no", label: "No will" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "employment",
    kind: "single",
    key: "employment",
    prompt: "Were they working or retired?",
    optional: true,
    options: [
      { value: "employed", label: "Working" },
      { value: "retired", label: "Retired" },
      { value: "both", label: "A bit of both" },
      { value: "neither", label: "Neither" },
    ],
  },
  {
    id: "life",
    kind: "multi",
    key: "life",
    prompt: "Which of these were part of their life?",
    helper:
      "Select any that apply — this makes sure your plan includes the right things and skips what doesn't fit.",
    optional: true,
    options: [
      { value: "dependents", label: "They cared for children or dependents" },
      { value: "minor_children", label: "They had children under 18" },
      { value: "pets", label: "They had pets" },
      { value: "vehicle", label: "They owned a vehicle" },
      { value: "business", label: "They ran a business" },
      { value: "military", label: "They served in the military" },
      { value: "life_insurance", label: "They likely had life insurance" },
      { value: "debts", label: "They had debts or loans" },
    ],
  },
  {
    id: "concerns",
    kind: "longtext",
    key: "concerns",
    prompt: "Is there anything weighing on you most right now?",
    helper:
      "Tell me in your own words. It helps me put the right things first — and you don't have to have the words just right.",
    placeholder: "Whatever's on your mind…",
    optional: true,
  },
  {
    id: "outro",
    kind: "outro",
    prompt: "Thank you for trusting me with this.",
    helper:
      "Take a breath. I'll put together a gentle, personal plan for you now — a few things for right now, and the rest for when you're ready.",
  },
];

/** Steps that are actually shown given the answers so far. */
export function visibleSteps(answers: IntakeAnswers): IntakeStep[] {
  return INTAKE_STEPS.filter((step) => (step.when ? step.when(answers) : true));
}
