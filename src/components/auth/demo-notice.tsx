import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown when Supabase auth isn't configured — the demo uses a guest space. */
export function DemoNotice() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-7 text-center shadow-soft">
      <h1 className="text-2xl">Jump right in</h1>
      <p className="mt-3 text-muted-foreground">
        This demo doesn&rsquo;t need an account &mdash; your space is private to
        this browser, and nothing is shared. Full sign-in (email and Google)
        turns on automatically once accounts are connected.
      </p>
      <Button asChild size="lg" className="mt-6 w-full">
        <Link href="/begin">Continue to The After</Link>
      </Button>
    </div>
  );
}
