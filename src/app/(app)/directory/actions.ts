"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getInstitution } from "@/lib/directory/institutions";

const STATUSES = ["to_contact", "contacted", "in_progress", "resolved"] as const;
type CaseInstStatus = (typeof STATUSES)[number];

async function primaryCaseId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const primary = await getPrimaryCase(user.id);
  if (!primary) throw new Error("No case");
  return primary.id;
}

export async function trackInstitutionAction(
  institutionId: string
): Promise<void> {
  if (!getInstitution(institutionId)) throw new Error("Unknown institution");
  const caseId = await primaryCaseId();
  const repo = getRepository();
  const existing = (await repo.listCaseInstitutions(caseId)).find(
    (ci) => ci.institutionId === institutionId
  );
  if (!existing) {
    await repo.createCaseInstitution({
      caseId,
      institutionId,
      status: "to_contact",
    });
  }
  revalidatePath("/directory");
}

export async function untrackInstitutionAction(id: string): Promise<void> {
  const caseId = await primaryCaseId();
  const repo = getRepository();
  const owned = (await repo.listCaseInstitutions(caseId)).some(
    (ci) => ci.id === id
  );
  if (!owned) throw new Error("Not found");
  await repo.deleteCaseInstitution(id);
  revalidatePath("/directory");
}

export async function setCaseInstitutionStatusAction(
  id: string,
  status: string
): Promise<void> {
  if (!STATUSES.includes(status as CaseInstStatus)) {
    throw new Error("Invalid status");
  }
  const caseId = await primaryCaseId();
  const repo = getRepository();
  const owned = (await repo.listCaseInstitutions(caseId)).some(
    (ci) => ci.id === id
  );
  if (!owned) throw new Error("Not found");
  await repo.updateCaseInstitution(id, {
    status: status as CaseInstStatus,
    contactedAt: status !== "to_contact" ? new Date().toISOString() : undefined,
  });
  revalidatePath("/directory");
}
