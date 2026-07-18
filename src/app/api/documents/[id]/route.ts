import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase } from "@/lib/services/case-service";
import { features } from "@/lib/env";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const repo = getRepository();
  const doc = await repo.getDocument(id);
  if (!doc || !doc.storagePath) return new Response("Not found", { status: 404 });

  try {
    await getOwnedCase(doc.caseId, user.id);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const download = new URL(req.url).searchParams.get("download") === "1";
  const disposition = `${download ? "attachment" : "inline"}; filename="${doc.name}"`;

  // Demo mode: file stored inline as a data URL.
  if (doc.storagePath.startsWith("data:")) {
    const match = doc.storagePath.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) return new Response("Not available", { status: 404 });
    const bytes = Buffer.from(match[2], "base64");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": match[1],
        "Content-Disposition": disposition,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // Supabase Storage: redirect to a short-lived signed URL.
  if (features.supabase) {
    try {
      const { createSupabaseServerClient } = await import(
        "@/lib/supabase/server"
      );
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.storagePath, 60, { download });
      if (data?.signedUrl) return Response.redirect(data.signedUrl);
    } catch {
      // Fall through to 404.
    }
  }

  return new Response("Not available", { status: 404 });
}
