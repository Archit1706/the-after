import { features } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";
import { DemoNotice } from "@/components/auth/demo-notice";

export const metadata = { title: "Create your account" };

// Renders per request so it reflects the runtime auth configuration
// (demo vs. Supabase), not whatever was true at build time.
export const dynamic = "force-dynamic";

export default function SignUpPage() {
  if (!features.supabase) return <DemoNotice />;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl">Create your account</h1>
        <p className="mt-2 text-muted-foreground">
          So your plan and progress are here whenever you return.
        </p>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
