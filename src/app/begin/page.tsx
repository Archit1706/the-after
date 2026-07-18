import { redirect } from "next/navigation";
import { features } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrCreateCase } from "@/lib/services/case-service";
import { IntakeExperience } from "@/components/intake/intake-experience";

export const metadata = {
  title: "Begin gently",
};

// Intake completion runs AI plan generation; allow headroom over the
// serverless default so it never times out mid-generation.
export const maxDuration = 60;

export default async function BeginPage() {
  const user = await getCurrentUser();

  // With real auth configured, intake requires a signed-in user.
  if (!user) {
    if (features.supabase) redirect("/sign-in?next=/begin");
    redirect("/");
  }

  const activeCase = await getOrCreateCase(user.id);

  // Returning users who already have a plan go straight to it.
  if (activeCase.intakeComplete) {
    redirect("/plan");
  }

  return <IntakeExperience caseId={activeCase.id} />;
}
