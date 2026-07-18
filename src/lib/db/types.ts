import type {
  Case,
  CaseDocument,
  CaseInstitution,
  Letter,
  Message,
  Task,
  ThreadKindValue,
} from "@/lib/domain/schemas";

export interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  isGuest: boolean;
}

// Create/patch helpers: the repository owns id + timestamps.
export type NewCase = Pick<Case, "userId"> &
  Partial<Omit<Case, "id" | "userId" | "createdAt" | "updatedAt">>;
export type CasePatch = Partial<Omit<Case, "id" | "userId" | "createdAt">>;

export type NewTask = Pick<Task, "caseId" | "title"> &
  Partial<Omit<Task, "id" | "caseId" | "createdAt" | "updatedAt">>;
export type TaskPatch = Partial<Omit<Task, "id" | "caseId" | "createdAt">>;

export type NewLetter = Pick<Letter, "caseId" | "title"> &
  Partial<Omit<Letter, "id" | "caseId" | "createdAt" | "updatedAt">>;
export type LetterPatch = Partial<Omit<Letter, "id" | "caseId" | "createdAt">>;

export type NewDocument = Pick<CaseDocument, "caseId" | "name"> &
  Partial<Omit<CaseDocument, "id" | "caseId" | "createdAt" | "updatedAt">>;
export type DocumentPatch = Partial<
  Omit<CaseDocument, "id" | "caseId" | "createdAt">
>;

export type NewCaseInstitution = Pick<CaseInstitution, "caseId"> &
  Partial<Omit<CaseInstitution, "id" | "caseId" | "createdAt" | "updatedAt">>;
export type CaseInstitutionPatch = Partial<
  Omit<CaseInstitution, "id" | "caseId" | "createdAt">
>;

export type NewMessage = Pick<Message, "caseId" | "thread" | "role" | "content">;

/**
 * The persistence contract. Implemented by the in-memory demo store and by
 * the Supabase-backed store. Every method is async so both fit the same shape.
 */
export interface Repository {
  readonly kind: "memory" | "supabase";

  // Cases
  listCases(userId: string): Promise<Case[]>;
  getPrimaryCase(userId: string): Promise<Case | null>;
  getCase(caseId: string): Promise<Case | null>;
  createCase(input: NewCase): Promise<Case>;
  updateCase(caseId: string, patch: CasePatch): Promise<Case>;
  deleteCase(caseId: string): Promise<void>;

  // Tasks
  listTasks(caseId: string): Promise<Task[]>;
  getTask(taskId: string): Promise<Task | null>;
  createTask(input: NewTask): Promise<Task>;
  createTasks(inputs: NewTask[]): Promise<Task[]>;
  updateTask(taskId: string, patch: TaskPatch): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;

  // Letters
  listLetters(caseId: string): Promise<Letter[]>;
  getLetter(letterId: string): Promise<Letter | null>;
  createLetter(input: NewLetter): Promise<Letter>;
  updateLetter(letterId: string, patch: LetterPatch): Promise<Letter>;
  deleteLetter(letterId: string): Promise<void>;

  // Documents
  listDocuments(caseId: string): Promise<CaseDocument[]>;
  getDocument(documentId: string): Promise<CaseDocument | null>;
  createDocument(input: NewDocument): Promise<CaseDocument>;
  updateDocument(documentId: string, patch: DocumentPatch): Promise<CaseDocument>;
  deleteDocument(documentId: string): Promise<void>;

  // Case ↔ institution tracking
  listCaseInstitutions(caseId: string): Promise<CaseInstitution[]>;
  createCaseInstitution(
    input: NewCaseInstitution
  ): Promise<CaseInstitution>;
  updateCaseInstitution(
    id: string,
    patch: CaseInstitutionPatch
  ): Promise<CaseInstitution>;
  deleteCaseInstitution(id: string): Promise<void>;

  // Conversations (intake + companion)
  listMessages(caseId: string, thread: ThreadKindValue): Promise<Message[]>;
  createMessage(input: NewMessage): Promise<Message>;
  clearMessages(caseId: string, thread: ThreadKindValue): Promise<void>;
}
