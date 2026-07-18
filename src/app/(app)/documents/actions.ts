"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase, getPrimaryCase } from "@/lib/services/case-service";
import { features } from "@/lib/env";
import { DocumentKind } from "@/lib/domain/enums";
import { createId } from "@/lib/utils";
import type { Repository } from "@/lib/db/types";
import type { CaseDocument } from "@/lib/domain/schemas";

// Cap for inline (demo) storage. Larger files need real object storage.
const MAX_INLINE_BYTES = 4 * 1024 * 1024;

export async function uploadDocumentAction(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in first." };
  const primary = await getPrimaryCase(user.id);
  if (!primary) return { ok: false, error: "No active case." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose a file to upload." };
  }

  const kind = DocumentKind.schema
    .catch("other")
    .parse(formData.get("kind"));
  const safeName = file.name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120);
  const repo = getRepository();

  let storagePath: string;

  if (features.supabase) {
    try {
      const { createSupabaseServerClient } = await import(
        "@/lib/supabase/server"
      );
      const supabase = await createSupabaseServerClient();
      const path = `${primary.id}/${createId("file")}-${safeName}`;
      const { error } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type || undefined });
      if (error) return { ok: false, error: "Upload failed. Please try again." };
      storagePath = path;
    } catch {
      return { ok: false, error: "Upload failed. Please try again." };
    }
  } else {
    if (file.size > MAX_INLINE_BYTES) {
      return {
        ok: false,
        error:
          "This file is a bit large for the demo (max 4 MB). Connecting storage removes this limit.",
      };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "application/octet-stream";
    storagePath = `data:${mime};base64,${buffer.toString("base64")}`;
  }

  await repo.createDocument({
    caseId: primary.id,
    kind,
    name: safeName || "Document",
    storagePath,
    mimeType: file.type || undefined,
    size: file.size,
  });

  revalidatePath("/documents");
  return { ok: true };
}

async function ownedDocument(
  documentId: string
): Promise<{ repo: Repository; doc: CaseDocument }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const repo = getRepository();
  const doc = await repo.getDocument(documentId);
  if (!doc) throw new Error("Document not found");
  await getOwnedCase(doc.caseId, user.id);
  return { repo, doc };
}

export async function deleteDocumentAction(documentId: string): Promise<void> {
  const { repo, doc } = await ownedDocument(documentId);

  if (features.supabase && doc.storagePath && !doc.storagePath.startsWith("data:")) {
    try {
      const { createSupabaseServerClient } = await import(
        "@/lib/supabase/server"
      );
      const supabase = await createSupabaseServerClient();
      await supabase.storage.from("documents").remove([doc.storagePath]);
    } catch {
      // Continue removing the record even if the object removal fails.
    }
  }

  await repo.deleteDocument(documentId);
  revalidatePath("/documents");
}

export async function updateDocumentAction(
  documentId: string,
  patch: { notes?: string; copiesOnHand?: number }
): Promise<void> {
  const { repo } = await ownedDocument(documentId);
  await repo.updateDocument(documentId, patch);
  revalidatePath("/documents");
}
