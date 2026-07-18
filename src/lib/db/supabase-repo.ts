import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createId } from "@/lib/utils";
import type {
  Case,
  CaseDocument,
  CaseInstitution,
  Letter,
  Message,
  Task,
  ThreadKindValue,
} from "@/lib/domain/schemas";
import type {
  CaseInstitutionPatch,
  CasePatch,
  DocumentPatch,
  LetterPatch,
  NewCase,
  NewCaseInstitution,
  NewDocument,
  NewLetter,
  NewMessage,
  NewTask,
  Repository,
  TaskPatch,
} from "./types";

function now(): string {
  return new Date().toISOString();
}

async function client() {
  return createSupabaseServerClient();
}

function assert<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data == null) throw new Error("Record not found");
  return data;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---- Row mappers -----------------------------------------------------------
function caseFromRow(r: any): Case {
  return {
    id: r.id,
    userId: r.user_id,
    status: r.status,
    deceased: r.deceased ?? { fullName: "" },
    profile: r.profile ?? { notes: [], concerns: [] },
    intakeComplete: r.intake_complete,
    summary: r.summary ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function taskFromRow(r: any): Task {
  return {
    id: r.id,
    caseId: r.case_id,
    title: r.title,
    rationale: r.rationale ?? "",
    steps: r.steps ?? [],
    category: r.category,
    phase: r.phase,
    priority: r.priority,
    status: r.status,
    dueDate: r.due_date ?? undefined,
    deadlineType: r.deadline_type,
    deadlineNote: r.deadline_note ?? undefined,
    requiredDocuments: r.required_documents ?? [],
    institutionRefs: r.institution_refs ?? [],
    notes: r.notes ?? undefined,
    source: r.source,
    order: r.order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    completedAt: r.completed_at ?? undefined,
  };
}

function taskToInsert(input: NewTask, order: number): Record<string, unknown> {
  return {
    id: createId("task"),
    case_id: input.caseId,
    title: input.title,
    rationale: input.rationale ?? "",
    steps: input.steps ?? [],
    category: input.category ?? "immediate",
    phase: input.phase ?? "soon",
    priority: input.priority ?? "medium",
    status: input.status ?? "todo",
    due_date: input.dueDate ?? null,
    deadline_type: input.deadlineType ?? "none",
    deadline_note: input.deadlineNote ?? null,
    required_documents: input.requiredDocuments ?? [],
    institution_refs: input.institutionRefs ?? [],
    notes: input.notes ?? null,
    source: input.source ?? "template",
    order: input.order ?? order,
  };
}

function taskPatchToRow(patch: TaskPatch): Record<string, unknown> {
  const row: Record<string, unknown> = { updated_at: now() };
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.rationale !== undefined) row.rationale = patch.rationale;
  if (patch.steps !== undefined) row.steps = patch.steps;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.phase !== undefined) row.phase = patch.phase;
  if (patch.priority !== undefined) row.priority = patch.priority;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.dueDate !== undefined) row.due_date = patch.dueDate;
  if (patch.deadlineType !== undefined) row.deadline_type = patch.deadlineType;
  if (patch.deadlineNote !== undefined) row.deadline_note = patch.deadlineNote;
  if (patch.requiredDocuments !== undefined)
    row.required_documents = patch.requiredDocuments;
  if (patch.institutionRefs !== undefined)
    row.institution_refs = patch.institutionRefs;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.order !== undefined) row.order = patch.order;
  if (patch.completedAt !== undefined) row.completed_at = patch.completedAt;
  return row;
}

function letterFromRow(r: any): Letter {
  return {
    id: r.id,
    caseId: r.case_id,
    taskId: r.task_id ?? undefined,
    institutionRef: r.institution_ref ?? undefined,
    type: r.type,
    title: r.title,
    recipient: r.recipient ?? "",
    subject: r.subject ?? "",
    body: r.body ?? "",
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function docFromRow(r: any): CaseDocument {
  return {
    id: r.id,
    caseId: r.case_id,
    kind: r.kind,
    name: r.name,
    storagePath: r.storage_path ?? undefined,
    mimeType: r.mime_type ?? undefined,
    size: r.size ?? undefined,
    copiesOnHand: r.copies_on_hand ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function caseInstFromRow(r: any): CaseInstitution {
  return {
    id: r.id,
    caseId: r.case_id,
    institutionId: r.institution_id ?? undefined,
    customInstitution: r.custom_institution ?? undefined,
    status: r.status,
    accountReference: r.account_reference ?? undefined,
    notes: r.notes ?? undefined,
    contactedAt: r.contacted_at ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function messageFromRow(r: any): Message {
  return {
    id: r.id,
    caseId: r.case_id,
    thread: r.thread,
    role: r.role,
    content: r.content,
    createdAt: r.created_at,
  };
}

/**
 * Supabase-backed repository. The client is resolved per method from the
 * request's cookies, so a single cached instance serves every request while
 * still enforcing each user's row-level security context.
 */
export class SupabaseRepository implements Repository {
  readonly kind = "supabase" as const;

  async listCases(userId: string): Promise<Case[]> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(caseFromRow);
  }

  async getPrimaryCase(userId: string): Promise<Case | null> {
    return (await this.listCases(userId))[0] ?? null;
  }

  async getCase(caseId: string): Promise<Case | null> {
    const supabase = await client();
    const { data } = await supabase
      .from("cases")
      .select("*")
      .eq("id", caseId)
      .maybeSingle();
    return data ? caseFromRow(data) : null;
  }

  async createCase(input: NewCase): Promise<Case> {
    const supabase = await client();
    const row = {
      id: createId("case"),
      user_id: input.userId,
      status: input.status ?? "intake",
      deceased: input.deceased ?? { fullName: "" },
      profile: input.profile ?? { notes: [], concerns: [] },
      intake_complete: input.intakeComplete ?? false,
      summary: input.summary ?? null,
    };
    const { data, error } = await supabase
      .from("cases")
      .insert(row)
      .select("*")
      .single();
    return caseFromRow(assert(data, error));
  }

  async updateCase(caseId: string, patch: CasePatch): Promise<Case> {
    const supabase = await client();
    const row: Record<string, unknown> = { updated_at: now() };
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.deceased !== undefined) row.deceased = patch.deceased;
    if (patch.profile !== undefined) row.profile = patch.profile;
    if (patch.intakeComplete !== undefined)
      row.intake_complete = patch.intakeComplete;
    if (patch.summary !== undefined) row.summary = patch.summary;
    const { data, error } = await supabase
      .from("cases")
      .update(row)
      .eq("id", caseId)
      .select("*")
      .single();
    return caseFromRow(assert(data, error));
  }

  async deleteCase(caseId: string): Promise<void> {
    const supabase = await client();
    // Child rows cascade via foreign keys.
    const { error } = await supabase.from("cases").delete().eq("id", caseId);
    if (error) throw new Error(error.message);
  }

  async listTasks(caseId: string): Promise<Task[]> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("case_id", caseId)
      .order("order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(taskFromRow);
  }

  async getTask(taskId: string): Promise<Task | null> {
    const supabase = await client();
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .maybeSingle();
    return data ? taskFromRow(data) : null;
  }

  async createTask(input: NewTask): Promise<Task> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("tasks")
      .insert(taskToInsert(input, 0))
      .select("*")
      .single();
    return taskFromRow(assert(data, error));
  }

  async createTasks(inputs: NewTask[]): Promise<Task[]> {
    if (inputs.length === 0) return [];
    const supabase = await client();
    const rows = inputs.map((input, i) => taskToInsert(input, i));
    const { data, error } = await supabase
      .from("tasks")
      .insert(rows)
      .select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(taskFromRow);
  }

  async updateTask(taskId: string, patch: TaskPatch): Promise<Task> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("tasks")
      .update(taskPatchToRow(patch))
      .eq("id", taskId)
      .select("*")
      .single();
    return taskFromRow(assert(data, error));
  }

  async deleteTask(taskId: string): Promise<void> {
    const supabase = await client();
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) throw new Error(error.message);
  }

  async listLetters(caseId: string): Promise<Letter[]> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("letters")
      .select("*")
      .eq("case_id", caseId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(letterFromRow);
  }

  async getLetter(letterId: string): Promise<Letter | null> {
    const supabase = await client();
    const { data } = await supabase
      .from("letters")
      .select("*")
      .eq("id", letterId)
      .maybeSingle();
    return data ? letterFromRow(data) : null;
  }

  async createLetter(input: NewLetter): Promise<Letter> {
    const supabase = await client();
    const row = {
      id: createId("letter"),
      case_id: input.caseId,
      task_id: input.taskId ?? null,
      institution_ref: input.institutionRef ?? null,
      type: input.type ?? "letter",
      title: input.title,
      recipient: input.recipient ?? "",
      subject: input.subject ?? "",
      body: input.body ?? "",
      status: input.status ?? "draft",
    };
    const { data, error } = await supabase
      .from("letters")
      .insert(row)
      .select("*")
      .single();
    return letterFromRow(assert(data, error));
  }

  async updateLetter(letterId: string, patch: LetterPatch): Promise<Letter> {
    const supabase = await client();
    const row: Record<string, unknown> = { updated_at: now() };
    if (patch.taskId !== undefined) row.task_id = patch.taskId;
    if (patch.institutionRef !== undefined)
      row.institution_ref = patch.institutionRef;
    if (patch.type !== undefined) row.type = patch.type;
    if (patch.title !== undefined) row.title = patch.title;
    if (patch.recipient !== undefined) row.recipient = patch.recipient;
    if (patch.subject !== undefined) row.subject = patch.subject;
    if (patch.body !== undefined) row.body = patch.body;
    if (patch.status !== undefined) row.status = patch.status;
    const { data, error } = await supabase
      .from("letters")
      .update(row)
      .eq("id", letterId)
      .select("*")
      .single();
    return letterFromRow(assert(data, error));
  }

  async deleteLetter(letterId: string): Promise<void> {
    const supabase = await client();
    const { error } = await supabase.from("letters").delete().eq("id", letterId);
    if (error) throw new Error(error.message);
  }

  async listDocuments(caseId: string): Promise<CaseDocument[]> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(docFromRow);
  }

  async getDocument(documentId: string): Promise<CaseDocument | null> {
    const supabase = await client();
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();
    return data ? docFromRow(data) : null;
  }

  async createDocument(input: NewDocument): Promise<CaseDocument> {
    const supabase = await client();
    const row = {
      id: createId("doc"),
      case_id: input.caseId,
      kind: input.kind ?? "other",
      name: input.name,
      storage_path: input.storagePath ?? null,
      mime_type: input.mimeType ?? null,
      size: input.size ?? null,
      copies_on_hand: input.copiesOnHand ?? null,
      notes: input.notes ?? null,
    };
    const { data, error } = await supabase
      .from("documents")
      .insert(row)
      .select("*")
      .single();
    return docFromRow(assert(data, error));
  }

  async updateDocument(
    documentId: string,
    patch: DocumentPatch
  ): Promise<CaseDocument> {
    const supabase = await client();
    const row: Record<string, unknown> = { updated_at: now() };
    if (patch.kind !== undefined) row.kind = patch.kind;
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.storagePath !== undefined) row.storage_path = patch.storagePath;
    if (patch.mimeType !== undefined) row.mime_type = patch.mimeType;
    if (patch.size !== undefined) row.size = patch.size;
    if (patch.copiesOnHand !== undefined)
      row.copies_on_hand = patch.copiesOnHand;
    if (patch.notes !== undefined) row.notes = patch.notes;
    const { data, error } = await supabase
      .from("documents")
      .update(row)
      .eq("id", documentId)
      .select("*")
      .single();
    return docFromRow(assert(data, error));
  }

  async deleteDocument(documentId: string): Promise<void> {
    const supabase = await client();
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);
    if (error) throw new Error(error.message);
  }

  async listCaseInstitutions(caseId: string): Promise<CaseInstitution[]> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("case_institutions")
      .select("*")
      .eq("case_id", caseId);
    if (error) throw new Error(error.message);
    return (data ?? []).map(caseInstFromRow);
  }

  async createCaseInstitution(
    input: NewCaseInstitution
  ): Promise<CaseInstitution> {
    const supabase = await client();
    const row = {
      id: createId("caseinst"),
      case_id: input.caseId,
      institution_id: input.institutionId ?? null,
      custom_institution: input.customInstitution ?? null,
      status: input.status ?? "to_contact",
      account_reference: input.accountReference ?? null,
      notes: input.notes ?? null,
      contacted_at: input.contactedAt ?? null,
    };
    const { data, error } = await supabase
      .from("case_institutions")
      .insert(row)
      .select("*")
      .single();
    return caseInstFromRow(assert(data, error));
  }

  async updateCaseInstitution(
    id: string,
    patch: CaseInstitutionPatch
  ): Promise<CaseInstitution> {
    const supabase = await client();
    const row: Record<string, unknown> = { updated_at: now() };
    if (patch.institutionId !== undefined)
      row.institution_id = patch.institutionId;
    if (patch.customInstitution !== undefined)
      row.custom_institution = patch.customInstitution;
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.accountReference !== undefined)
      row.account_reference = patch.accountReference;
    if (patch.notes !== undefined) row.notes = patch.notes;
    if (patch.contactedAt !== undefined) row.contacted_at = patch.contactedAt;
    const { data, error } = await supabase
      .from("case_institutions")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();
    return caseInstFromRow(assert(data, error));
  }

  async deleteCaseInstitution(id: string): Promise<void> {
    const supabase = await client();
    const { error } = await supabase
      .from("case_institutions")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async listMessages(
    caseId: string,
    thread: ThreadKindValue
  ): Promise<Message[]> {
    const supabase = await client();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("case_id", caseId)
      .eq("thread", thread)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(messageFromRow);
  }

  async createMessage(input: NewMessage): Promise<Message> {
    const supabase = await client();
    const row = {
      id: createId("msg"),
      case_id: input.caseId,
      thread: input.thread,
      role: input.role,
      content: input.content,
    };
    const { data, error } = await supabase
      .from("messages")
      .insert(row)
      .select("*")
      .single();
    return messageFromRow(assert(data, error));
  }

  async clearMessages(
    caseId: string,
    thread: ThreadKindValue
  ): Promise<void> {
    const supabase = await client();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("case_id", caseId)
      .eq("thread", thread);
    if (error) throw new Error(error.message);
  }
}
