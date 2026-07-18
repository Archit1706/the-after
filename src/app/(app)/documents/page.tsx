import { redirect } from "next/navigation";
import { FolderLock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { DocumentUploader } from "@/components/documents/document-uploader";
import { DocumentCard } from "@/components/documents/document-card";

export const metadata = { title: "Document vault" };

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const documents = await getRepository().listDocuments(primary.id);

  return (
    <PageContainer>
      <PageHeader
        title="Document vault"
        description="Keep the death certificate, will, and other important papers in one safe place — ready to attach wherever they're needed."
      />

      <div className="mb-8">
        <DocumentUploader />
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FolderLock}
          title="Nothing here yet"
          description="Upload a document above to keep it safe. Only you can see what you add here."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
