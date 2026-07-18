import { redirect } from "next/navigation";
import { features } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { AppShell } from "@/components/app/app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(features.supabase ? "/sign-in?next=/plan" : "/");
  }

  const primary = await getPrimaryCase(user.id);
  if (!primary || !primary.intakeComplete) {
    redirect("/begin");
  }

  return (
    <AppShell
      user={{ name: user.name, email: user.email, isGuest: user.isGuest }}
    >
      {children}
    </AppShell>
  );
}
