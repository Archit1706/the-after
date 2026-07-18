import { z } from "zod";
import {
  CaseStatus,
  ContactMethodType,
  DeadlineType,
  DocumentKind,
  InstitutionCategory,
  LetterType,
  MessageRole,
  Relationship,
  TaskCategory,
  TaskPhase,
  TaskPriority,
  TaskStatus,
  ThreadKind,
  UserRole,
} from "./enums";

const isoDate = z.string().min(1);

/** Where the estate is being handled — drives which deadlines apply. */
export const jurisdictionSchema = z.object({
  country: z.string().default("US"),
  countryLabel: z.string().optional(),
  region: z.string().optional(), // state / province
});
export type Jurisdiction = z.infer<typeof jurisdictionSchema>;

/** The person who died. */
export const personSchema = z.object({
  fullName: z.string().default(""),
  preferredName: z.string().optional(),
  pronouns: z.string().optional(),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
});
export type Person = z.infer<typeof personSchema>;

/**
 * Structured facts gathered during intake. Every field is optional so the
 * conversation can end whenever the user needs it to — nothing is required.
 */
export const caseProfileSchema = z.object({
  relationship: Relationship.schema.optional(),
  relationshipOther: z.string().optional(),
  userRole: UserRole.schema.optional(),
  jurisdiction: jurisdictionSchema.optional(),

  hasWill: z.enum(["yes", "no", "unsure"]).optional(),
  hasSpouse: z.boolean().optional(),
  hasDependents: z.boolean().optional(),
  hasMinorChildren: z.boolean().optional(),
  hasPets: z.boolean().optional(),
  ownedHome: z.boolean().optional(),
  rented: z.boolean().optional(),
  ownedVehicle: z.boolean().optional(),
  wasEmployed: z.boolean().optional(),
  wasRetired: z.boolean().optional(),
  ranBusiness: z.boolean().optional(),
  servedInMilitary: z.boolean().optional(),
  receivedBenefits: z.boolean().optional(),
  hadLifeInsurance: z.enum(["yes", "no", "unsure"]).optional(),
  hadDebts: z.boolean().optional(),

  /** Free-form things the survivor mentioned that don't fit a field. */
  notes: z.array(z.string()).default([]),
  /** Concerns the user raised, so the plan can address them first. */
  concerns: z.array(z.string()).default([]),
});
export type CaseProfile = z.infer<typeof caseProfileSchema>;

export const caseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: CaseStatus.schema.default("intake"),
  deceased: personSchema.default({ fullName: "" }),
  profile: caseProfileSchema.default({ notes: [], concerns: [] }),
  intakeComplete: z.boolean().default(false),
  /** A short, warm narrative summary produced after intake. */
  summary: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type Case = z.infer<typeof caseSchema>;

export const taskSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  title: z.string(),
  /** Why this matters, in plain, gentle language. */
  rationale: z.string().default(""),
  /** Concrete how-to steps. */
  steps: z.array(z.string()).default([]),
  category: TaskCategory.schema.default("immediate"),
  phase: TaskPhase.schema.default("soon"),
  priority: TaskPriority.schema.default("medium"),
  status: TaskStatus.schema.default("todo"),
  dueDate: z.string().optional(),
  deadlineType: DeadlineType.schema.default("none"),
  deadlineNote: z.string().optional(),
  requiredDocuments: z.array(DocumentKind.schema).default([]),
  institutionRefs: z.array(z.string()).default([]),
  notes: z.string().optional(),
  source: z.enum(["ai", "template", "user", "directory"]).default("template"),
  order: z.number().default(0),
  createdAt: isoDate,
  updatedAt: isoDate,
  completedAt: z.string().optional(),
});
export type Task = z.infer<typeof taskSchema>;

/** A focused question someone can ask about a task in their plan. */
export const taskQuestionSchema = z
  .string()
  .trim()
  .min(1, "Please write a question first.")
  .max(1_000, "Please keep your question under 1,000 characters.");

export const contactMethodSchema = z.object({
  type: ContactMethodType.schema,
  value: z.string(),
  label: z.string().optional(),
  hours: z.string().optional(),
});
export type ContactMethod = z.infer<typeof contactMethodSchema>;

/** A reference directory entry (mostly static) OR a case-specific addition. */
export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: InstitutionCategory.schema,
  description: z.string().default(""),
  contactMethods: z.array(contactMethodSchema).default([]),
  requiredDocuments: z.array(DocumentKind.schema).default([]),
  tips: z.array(z.string()).default([]),
  region: z.string().default("US"),
  deadlineNote: z.string().optional(),
});
export type Institution = z.infer<typeof institutionSchema>;

/** Tracks a case's relationship to an institution it needs to contact. */
export const caseInstitutionSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  institutionId: z.string().optional(),
  customInstitution: institutionSchema.partial().optional(),
  status: z.enum(["to_contact", "contacted", "in_progress", "resolved"]).default(
    "to_contact"
  ),
  accountReference: z.string().optional(),
  notes: z.string().optional(),
  contactedAt: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type CaseInstitution = z.infer<typeof caseInstitutionSchema>;

export const letterSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  taskId: z.string().optional(),
  institutionRef: z.string().optional(),
  type: LetterType.schema.default("letter"),
  title: z.string(),
  recipient: z.string().default(""),
  subject: z.string().default(""),
  body: z.string().default(""),
  status: z.enum(["draft", "final"]).default("draft"),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type Letter = z.infer<typeof letterSchema>;

export const documentSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  kind: DocumentKind.schema.default("other"),
  name: z.string(),
  storagePath: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().optional(),
  copiesOnHand: z.number().optional(),
  notes: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type CaseDocument = z.infer<typeof documentSchema>;

export const messageSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  thread: ThreadKind.schema,
  role: MessageRole.schema,
  content: z.string(),
  createdAt: isoDate,
});
export type Message = z.infer<typeof messageSchema>;

export type ThreadKindValue = z.infer<typeof ThreadKind.schema>;
