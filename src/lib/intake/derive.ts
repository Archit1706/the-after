import { z } from "zod";
import { firstName } from "@/lib/utils";
import { Relationship, UserRole } from "@/lib/domain/enums";
import type { CaseProfile, Person } from "@/lib/domain/schemas";
import type { IntakeAnswers } from "./questions";

const HasWillLike = z.enum(["yes", "no", "unsure"]);

function safeEnum<T>(schema: z.ZodType<T>, value: unknown): T | undefined {
  const result = schema.safeParse(value);
  return result.success ? result.data : undefined;
}

/** Convert collected intake answers into a validated deceased + profile. */
export function deriveFromAnswers(answers: IntakeAnswers): {
  deceased: Person;
  profile: CaseProfile;
} {
  const life = new Set(answers.life ?? []);
  const fullName = answers.deceasedName?.trim() ?? "";
  const preferred =
    answers.preferredName?.trim() || (fullName ? firstName(fullName) : undefined);

  const deceased: Person = {
    fullName,
    preferredName: preferred,
    pronouns:
      answers.pronouns && answers.pronouns !== "skip"
        ? answers.pronouns
        : undefined,
    dateOfDeath: answers.dateOfDeath || undefined,
  };

  const jurisdiction = answers.country?.trim()
    ? {
        country: answers.country.trim(),
        region: answers.region?.trim() || undefined,
      }
    : undefined;

  const profile: CaseProfile = {
    relationship: safeEnum(Relationship.schema, answers.relationship),
    relationshipOther: answers.relationshipOther?.trim() || undefined,
    userRole: safeEnum(UserRole.schema, answers.userRole),
    jurisdiction,
    hasWill: safeEnum(HasWillLike, answers.hasWill),
    ownedHome: answers.livingSituation === "owned" ? true : undefined,
    rented: answers.livingSituation === "rented" ? true : undefined,
    wasEmployed:
      answers.employment === "employed" || answers.employment === "both"
        ? true
        : undefined,
    wasRetired:
      answers.employment === "retired" || answers.employment === "both"
        ? true
        : undefined,
    hasDependents:
      life.has("dependents") || life.has("minor_children") ? true : undefined,
    hasMinorChildren: life.has("minor_children") ? true : undefined,
    hasPets: life.has("pets") ? true : undefined,
    ownedVehicle: life.has("vehicle") ? true : undefined,
    ranBusiness: life.has("business") ? true : undefined,
    servedInMilitary: life.has("military") ? true : undefined,
    hadLifeInsurance: life.has("life_insurance") ? "yes" : undefined,
    hadDebts: life.has("debts") ? true : undefined,
    notes: [],
    concerns: answers.concerns?.trim() ? [answers.concerns.trim()] : [],
  };

  return { deceased, profile };
}
