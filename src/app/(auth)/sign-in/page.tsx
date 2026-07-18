import { features } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";
import { DemoNotice } from "@/components/auth/demo-notice";

export const metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (!features.supabase) return <DemoNotice />;
  const { next } = await searchParams;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to pick up where you left off.
        </p>
      </div>
      <AuthForm mode="signin" next={next ?? "/plan"} />
    </div>
  );
}
