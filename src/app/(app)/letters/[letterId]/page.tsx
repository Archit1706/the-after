import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getRepository } from "@/lib/db";
import { getOwnedCase } from "@/lib/services/case-service";
import { LetterEditor } from "@/components/letters/letter-editor";

export const metadata = { title: "Letter" };

// The regenerate action calls the model; allow headroom over the default.
export const maxDuration = 60;

export default async function LetterPage({
  params,
}: {
  params: Promise<{ letterId: string }>;
}) {
  const { letterId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/begin");

  const repo = getRepository();
  const letter = await repo.getLetter(letterId);
  if (!letter) notFound();

  try {
    await getOwnedCase(letter.caseId, user.id);
  } catch {
    notFound();
  }

  return <LetterEditor letter={letter} />;
}
