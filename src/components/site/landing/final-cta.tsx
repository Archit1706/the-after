import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="sm">
        <div
          className="relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-14 text-center shadow-lifted sm:px-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 80% at 50% 0%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl">
              Whenever you&rsquo;re ready. There&rsquo;s no rush.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
              Start with a single, gentle conversation. You can stop any time,
              and everything will be here when you come back.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/begin">
                  Begin gently
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/how-it-helps">Learn more first</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
