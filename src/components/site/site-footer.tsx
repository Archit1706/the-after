import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface-muted/40">
      <Container size="xl" className="py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A gentle companion for the practical side of loss. Take your
              time. You don&rsquo;t have to do everything today.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm"
          >
            <Link
              href="/begin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Begin
            </Link>
            <Link
              href="/how-it-helps"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              How it helps
            </Link>
            <Link
              href="/sign-in"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            The After offers general guidance to help you get organized. It is
            not legal, tax, or financial advice, and it is not a substitute for
            a licensed professional. Deadlines and requirements vary by place
            and situation &mdash; please verify anything important.
          </p>
          <p className="mt-3">&copy; {year} The After.</p>
        </div>
      </Container>
    </footer>
  );
}
