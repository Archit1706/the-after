import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createId } from "@/lib/utils";
import { createLogger } from "@/lib/logger";
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

const log = createLogger("db:memory");

interface Store {
  cases: Case[];
  tasks: Task[];
  letters: Letter[];
  documents: CaseDocument[];
  caseInstitutions: CaseInstitution[];
  messages: Message[];
}

function emptyStore(): Store {
  return {
    cases: [],
    tasks: [],
    letters: [],
    documents: [],
    caseInstitutions: [],
    messages: [],
  };
}

function now(): string {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

/**
 * In-memory store with best-effort JSON persistence for local development.
 * Persistence is guarded: on a read-only filesystem (e.g. serverless) it
 * silently continues in memory. Production should use the Supabase store.
 */
export class MemoryRepository implements Repository {
  readonly kind = "memory" as const;
  private store: Store;
  private readonly filePath: string | null;

  constructor(filePath: string | null = defaultFilePath()) {
    this.filePath = filePath;
    this.store = this.load();
  }

  private load(): Store {
    if (!this.filePath || !existsSync(this.filePath)) return emptyStore();
    try {
      const raw = readFileSync(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<Store>;
      return { ...emptyStore(), ...parsed };
    } catch (err) {
      log.warn("Could not read local store; starting empty", {
        message: err instanceof Error ? err.message : String(err),
      });
      return emptyStore();
    }
  }

  private persist(): void {
    if (!this.filePath) return;
    try {
      mkdirSync(dirname(this.filePath), { recursive: true });
      writeFileSync(this.filePath, JSON.stringify(this.store, null, 2), "utf8");
    } catch {
      // Read-only FS (serverless) — keep running from memory.
    }
  }

  // ---- Cases -------------------------------------------------------------
  async listCases(userId: string): Promise<Case[]> {
    return clone(
      this.store.cases
        .filter((c) => c.userId === userId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    );
  }

  async getPrimaryCase(userId: string): Promise<Case | null> {
    const list = await this.listCases(userId);
    return list[0] ?? null;
  }

  async getCase(caseId: string): Promise<Case | null> {
    const found = this.store.cases.find((c) => c.id === caseId);
    return found ? clone(found) : null;
  }

  async createCase(input: NewCase): Promise<Case> {
    const timestamp = now();
    const record: Case = {
      id: createId("case"),
      userId: input.userId,
      status: input.status ?? "intake",
      deceased: input.deceased ?? { fullName: "" },
      profile: input.profile ?? { notes: [], concerns: [] },
      intakeComplete: input.intakeComplete ?? false,
      summary: input.summary,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.cases.push(record);
    this.persist();
    return clone(record);
  }

  async updateCase(caseId: string, patch: CasePatch): Promise<Case> {
    const record = this.store.cases.find((c) => c.id === caseId);
    if (!record) throw new Error(`Case not found: ${caseId}`);
    Object.assign(record, patch, { updatedAt: now() });
    this.persist();
    return clone(record);
  }

  async deleteCase(caseId: string): Promise<void> {
    this.store.cases = this.store.cases.filter((c) => c.id !== caseId);
    this.store.tasks = this.store.tasks.filter((t) => t.caseId !== caseId);
    this.store.letters = this.store.letters.filter((l) => l.caseId !== caseId);
    this.store.documents = this.store.documents.filter(
      (d) => d.caseId !== caseId
    );
    this.store.caseInstitutions = this.store.caseInstitutions.filter(
      (ci) => ci.caseId !== caseId
    );
    this.store.messages = this.store.messages.filter(
      (m) => m.caseId !== caseId
    );
    this.persist();
  }

  // ---- Tasks -------------------------------------------------------------
  async listTasks(caseId: string): Promise<Task[]> {
    return clone(
      this.store.tasks
        .filter((t) => t.caseId === caseId)
        .sort((a, b) => a.order - b.order)
    );
  }

  async getTask(taskId: string): Promise<Task | null> {
    const found = this.store.tasks.find((t) => t.id === taskId);
    return found ? clone(found) : null;
  }

  private buildTask(input: NewTask): Task {
    const timestamp = now();
    return {
      id: createId("task"),
      caseId: input.caseId,
      title: input.title,
      rationale: input.rationale ?? "",
      steps: input.steps ?? [],
      category: input.category ?? "immediate",
      phase: input.phase ?? "soon",
      priority: input.priority ?? "medium",
      status: input.status ?? "todo",
      dueDate: input.dueDate,
      deadlineType: input.deadlineType ?? "none",
      deadlineNote: input.deadlineNote,
      requiredDocuments: input.requiredDocuments ?? [],
      institutionRefs: input.institutionRefs ?? [],
      notes: input.notes,
      source: input.source ?? "template",
      order: input.order ?? this.nextTaskOrder(input.caseId),
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: input.completedAt,
    };
  }

  private nextTaskOrder(caseId: string): number {
    const existing = this.store.tasks.filter((t) => t.caseId === caseId);
    return existing.length
      ? Math.max(...existing.map((t) => t.order)) + 1
      : 0;
  }

  async createTask(input: NewTask): Promise<Task> {
    const record = this.buildTask(input);
    this.store.tasks.push(record);
    this.persist();
    return clone(record);
  }

  async createTasks(inputs: NewTask[]): Promise<Task[]> {
    const records = inputs.map((input, i) => {
      const task = this.buildTask(input);
      // Preserve incoming ordering when order isn't explicit.
      if (input.order === undefined) task.order = i;
      return task;
    });
    this.store.tasks.push(...records);
    this.persist();
    return clone(records);
  }

  async updateTask(taskId: string, patch: TaskPatch): Promise<Task> {
    const record = this.store.tasks.find((t) => t.id === taskId);
    if (!record) throw new Error(`Task not found: ${taskId}`);
    Object.assign(record, patch, { updatedAt: now() });
    this.persist();
    return clone(record);
  }

  async deleteTask(taskId: string): Promise<void> {
    this.store.tasks = this.store.tasks.filter((t) => t.id !== taskId);
    this.persist();
  }

  // ---- Letters -----------------------------------------------------------
  async listLetters(caseId: string): Promise<Letter[]> {
    return clone(
      this.store.letters
        .filter((l) => l.caseId === caseId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    );
  }

  async getLetter(letterId: string): Promise<Letter | null> {
    const found = this.store.letters.find((l) => l.id === letterId);
    return found ? clone(found) : null;
  }

  async createLetter(input: NewLetter): Promise<Letter> {
    const timestamp = now();
    const record: Letter = {
      id: createId("letter"),
      caseId: input.caseId,
      taskId: input.taskId,
      institutionRef: input.institutionRef,
      type: input.type ?? "letter",
      title: input.title,
      recipient: input.recipient ?? "",
      subject: input.subject ?? "",
      body: input.body ?? "",
      status: input.status ?? "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.letters.push(record);
    this.persist();
    return clone(record);
  }

  async updateLetter(letterId: string, patch: LetterPatch): Promise<Letter> {
    const record = this.store.letters.find((l) => l.id === letterId);
    if (!record) throw new Error(`Letter not found: ${letterId}`);
    Object.assign(record, patch, { updatedAt: now() });
    this.persist();
    return clone(record);
  }

  async deleteLetter(letterId: string): Promise<void> {
    this.store.letters = this.store.letters.filter((l) => l.id !== letterId);
    this.persist();
  }

  // ---- Documents ---------------------------------------------------------
  async listDocuments(caseId: string): Promise<CaseDocument[]> {
    return clone(
      this.store.documents
        .filter((d) => d.caseId === caseId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
  }

  async getDocument(documentId: string): Promise<CaseDocument | null> {
    const found = this.store.documents.find((d) => d.id === documentId);
    return found ? clone(found) : null;
  }

  async createDocument(input: NewDocument): Promise<CaseDocument> {
    const timestamp = now();
    const record: CaseDocument = {
      id: createId("doc"),
      caseId: input.caseId,
      kind: input.kind ?? "other",
      name: input.name,
      storagePath: input.storagePath,
      mimeType: input.mimeType,
      size: input.size,
      copiesOnHand: input.copiesOnHand,
      notes: input.notes,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.documents.push(record);
    this.persist();
    return clone(record);
  }

  async updateDocument(
    documentId: string,
    patch: DocumentPatch
  ): Promise<CaseDocument> {
    const record = this.store.documents.find((d) => d.id === documentId);
    if (!record) throw new Error(`Document not found: ${documentId}`);
    Object.assign(record, patch, { updatedAt: now() });
    this.persist();
    return clone(record);
  }

  async deleteDocument(documentId: string): Promise<void> {
    this.store.documents = this.store.documents.filter(
      (d) => d.id !== documentId
    );
    this.persist();
  }

  // ---- Case institutions -------------------------------------------------
  async listCaseInstitutions(caseId: string): Promise<CaseInstitution[]> {
    return clone(
      this.store.caseInstitutions.filter((ci) => ci.caseId === caseId)
    );
  }

  async createCaseInstitution(
    input: NewCaseInstitution
  ): Promise<CaseInstitution> {
    const timestamp = now();
    const record: CaseInstitution = {
      id: createId("caseinst"),
      caseId: input.caseId,
      institutionId: input.institutionId,
      customInstitution: input.customInstitution,
      status: input.status ?? "to_contact",
      accountReference: input.accountReference,
      notes: input.notes,
      contactedAt: input.contactedAt,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.caseInstitutions.push(record);
    this.persist();
    return clone(record);
  }

  async updateCaseInstitution(
    id: string,
    patch: CaseInstitutionPatch
  ): Promise<CaseInstitution> {
    const record = this.store.caseInstitutions.find((ci) => ci.id === id);
    if (!record) throw new Error(`Case institution not found: ${id}`);
    Object.assign(record, patch, { updatedAt: now() });
    this.persist();
    return clone(record);
  }

  async deleteCaseInstitution(id: string): Promise<void> {
    this.store.caseInstitutions = this.store.caseInstitutions.filter(
      (ci) => ci.id !== id
    );
    this.persist();
  }

  // ---- Messages ----------------------------------------------------------
  async listMessages(
    caseId: string,
    thread: ThreadKindValue
  ): Promise<Message[]> {
    return clone(
      this.store.messages
        .filter((m) => m.caseId === caseId && m.thread === thread)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    );
  }

  async createMessage(input: NewMessage): Promise<Message> {
    const record: Message = {
      id: createId("msg"),
      caseId: input.caseId,
      thread: input.thread,
      role: input.role,
      content: input.content,
      createdAt: now(),
    };
    this.store.messages.push(record);
    this.persist();
    return clone(record);
  }

  async clearMessages(
    caseId: string,
    thread: ThreadKindValue
  ): Promise<void> {
    this.store.messages = this.store.messages.filter(
      (m) => !(m.caseId === caseId && m.thread === thread)
    );
    this.persist();
  }
}

function defaultFilePath(): string | null {
  try {
    return join(process.cwd(), ".data", "store.json");
  } catch {
    return null;
  }
}
