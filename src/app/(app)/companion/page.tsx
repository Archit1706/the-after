import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { CompanionChat } from "@/components/companion/companion-chat";

export const metadata = { title: "Companion" };

export default async function CompanionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const history = await getRepository().listMessages(primary.id, "companion");
  const initialMessages = history.map((m) => ({
    id: m.id,
    role: m.role === "user" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  return (
    <div className="flex h-[calc(100dvh-3.75rem)] flex-col lg:h-dvh">
      <CompanionChat initialMessages={initialMessages} />
    </div>
  );
}
