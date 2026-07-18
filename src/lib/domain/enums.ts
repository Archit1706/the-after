import { z } from "zod";

/**
 * Small helper: build a zod enum plus a typed label map from one source.
 * Keeps option lists, validation, and human-readable labels in sync.
 */
function labeledEnum<const T extends readonly [string, ...string[]]>(
  values: T,
  labels: Record<T[number], string>
) {
  return {
    values,
    schema: z.enum(values),
    labels,
    options: values.map((value) => ({
      value,
      label: labels[value as T[number]],
    })),
  };
}

export const CaseStatus = labeledEnum(["intake", "active", "archived"], {
  intake: "Getting started",
  active: "In progress",
  archived: "Archived",
});

export const Relationship = labeledEnum(
  [
    "spouse",
    "partner",
    "parent",
    "child",
    "sibling",
    "grandparent",
    "grandchild",
    "friend",
    "relative",
    "chosen_family",
    "other",
  ],
  {
    spouse: "My spouse",
    partner: "My partner",
    parent: "My parent",
    child: "My child",
    sibling: "My sibling",
    grandparent: "My grandparent",
    grandchild: "My grandchild",
    friend: "My friend",
    relative: "My relative",
    chosen_family: "My chosen family",
    other: "Someone else dear to me",
  }
);

export const UserRole = labeledEnum(
  [
    "executor",
    "next_of_kin",
    "family_member",
    "friend",
    "helping_someone",
    "unsure",
  ],
  {
    executor: "I'm the executor or administrator",
    next_of_kin: "I'm the next of kin",
    family_member: "I'm a family member helping out",
    friend: "I'm a friend helping out",
    helping_someone: "I'm helping someone else who is grieving",
    unsure: "I'm not sure yet",
  }
);

export const TaskPhase = labeledEnum(["now", "soon", "later"], {
  now: "Right now",
  soon: "Soon",
  later: "Later",
});

export const TaskStatus = labeledEnum(
  ["todo", "in_progress", "done", "not_applicable", "snoozed"],
  {
    todo: "To do",
    in_progress: "In progress",
    done: "Done",
    not_applicable: "Not applicable",
    snoozed: "Set aside",
  }
);

export const TaskCategory = labeledEnum(
  [
    "immediate",
    "legal",
    "financial",
    "benefits",
    "property",
    "digital",
    "household",
    "personal",
    "health",
  ],
  {
    immediate: "Immediate",
    legal: "Legal & estate",
    financial: "Money & accounts",
    benefits: "Benefits & entitlements",
    property: "Property & vehicles",
    digital: "Digital life",
    household: "Household & services",
    personal: "Personal & keepsakes",
    health: "Health & medical",
  }
);

export const TaskPriority = labeledEnum(["high", "medium", "low"], {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
});

export const DeadlineType = labeledEnum(
  ["statutory", "recommended", "none"],
  {
    statutory: "Legal deadline",
    recommended: "Recommended by",
    none: "No firm deadline",
  }
);

export const DocumentKind = labeledEnum(
  [
    "death_certificate",
    "will",
    "trust",
    "id",
    "birth_certificate",
    "marriage_certificate",
    "insurance_policy",
    "financial_statement",
    "property_deed",
    "vehicle_title",
    "tax_document",
    "correspondence",
    "other",
  ],
  {
    death_certificate: "Death certificate",
    will: "Will",
    trust: "Trust document",
    id: "Photo ID",
    birth_certificate: "Birth certificate",
    marriage_certificate: "Marriage certificate",
    insurance_policy: "Insurance policy",
    financial_statement: "Financial statement",
    property_deed: "Property deed",
    vehicle_title: "Vehicle title",
    tax_document: "Tax document",
    correspondence: "Letter or notice",
    other: "Other document",
  }
);

export const InstitutionCategory = labeledEnum(
  [
    "government",
    "bank",
    "credit_card",
    "credit_bureau",
    "insurance",
    "pension",
    "employer",
    "utility",
    "subscription",
    "digital",
    "healthcare",
    "funeral",
    "legal",
    "other",
  ],
  {
    government: "Government",
    bank: "Bank & investments",
    credit_card: "Credit cards",
    credit_bureau: "Credit bureaus",
    insurance: "Insurance",
    pension: "Pension & retirement",
    employer: "Employer",
    utility: "Utilities",
    subscription: "Subscriptions",
    digital: "Digital accounts",
    healthcare: "Healthcare",
    funeral: "Funeral & memorial",
    legal: "Legal & professional",
    other: "Other",
  }
);

export const ContactMethodType = labeledEnum(
  ["phone", "web", "email", "mail", "in_person"],
  {
    phone: "Phone",
    web: "Website",
    email: "Email",
    mail: "Mail",
    in_person: "In person",
  }
);

export const LetterType = labeledEnum(["letter", "phone_script", "email"], {
  letter: "Letter",
  phone_script: "Phone script",
  email: "Email",
});

export const MessageRole = labeledEnum(["user", "assistant", "system"], {
  user: "You",
  assistant: "The After",
  system: "System",
});

export const ThreadKind = labeledEnum(["intake", "companion"], {
  intake: "Intake",
  companion: "Companion",
});

// Convenience inferred types.
export type CaseStatus = z.infer<typeof CaseStatus.schema>;
export type Relationship = z.infer<typeof Relationship.schema>;
export type UserRole = z.infer<typeof UserRole.schema>;
export type TaskPhase = z.infer<typeof TaskPhase.schema>;
export type TaskStatus = z.infer<typeof TaskStatus.schema>;
export type TaskCategory = z.infer<typeof TaskCategory.schema>;
export type TaskPriority = z.infer<typeof TaskPriority.schema>;
export type DeadlineType = z.infer<typeof DeadlineType.schema>;
export type DocumentKind = z.infer<typeof DocumentKind.schema>;
export type InstitutionCategory = z.infer<typeof InstitutionCategory.schema>;
export type ContactMethodType = z.infer<typeof ContactMethodType.schema>;
export type LetterType = z.infer<typeof LetterType.schema>;
export type MessageRole = z.infer<typeof MessageRole.schema>;
export type ThreadKind = z.infer<typeof ThreadKind.schema>;
