import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";

/** Download everything we hold for the current case as a JSON file. */
export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const primary = await getPrimaryCase(user.id);
  if (!primary) return new Response("No case", { status: 404 });

  const repo = getRepository();
  const [tasks, letters, documents, institutions, companion] =
    await Promise.all([
      repo.listTasks(primary.id),
      repo.listLetters(primary.id),
      repo.listDocuments(primary.id),
      repo.listCaseInstitutions(primary.id),
      repo.listMessages(primary.id, "companion"),
    ]);

  // Strip inline file bytes from the export — keep metadata only.
  const documentMeta = documents.map(({ storagePath, ...rest }) => {
    void storagePath;
    return rest;
  });

  const bundle = {
    exportedAt: new Date().toISOString(),
    case: primary,
    tasks,
    letters,
    documents: documentMeta,
    institutions,
    companion,
  };

  return new Response(JSON.stringify(bundle, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="the-after-export.json"',
      "Cache-Control": "no-store",
    },
  });
}
