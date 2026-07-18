import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <LogoMark className="size-12" />
      <h1 className="mt-6 text-3xl">We couldn&rsquo;t find that page</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        The link may be old, or the page may have moved. Let&rsquo;s get you
        back to somewhere familiar.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/plan">Your plan</Link>
        </Button>
      </div>
    </main>
  );
}
