"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[the-after] Unhandled error", error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <LogoMark className="size-12" />
      <h1 className="mt-6 text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        That wasn&rsquo;t your fault. Your information is safe. Let&rsquo;s try
        that again.
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </main>
  );
}
