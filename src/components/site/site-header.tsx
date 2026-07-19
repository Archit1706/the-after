import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth/session";
import { features } from "@/lib/env";

/**
 * Public site header. Reflects the current auth state so a signed-in person
 * is never shown "Sign in" (which otherwise loops them back to the login
 * page). Reading the session opts the marketing pages into per-request
 * rendering — their content and metadata are still fully server-rendered
 * and crawlable.
 */
export async function SiteHeader() {
  const user = await getCurrentUser();
  const signedIn = Boolean(user && !user.isGuest);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <Container size="xl" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="The After — home"
        >
          <Logo />
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/how-it-helps">How it helps</Link>
          </Button>

          {signedIn ? (
            <Button asChild size="sm">
              <Link href="/plan">Go to my plan</Link>
            </Button>
          ) : (
            <>
              {features.supabase && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              )}
              <Button asChild size="sm">
                <Link href="/begin">Begin</Link>
              </Button>
            </>
          )}

          <ThemeToggle className="ml-0.5" />
        </nav>
      </Container>
    </header>
  );
}
