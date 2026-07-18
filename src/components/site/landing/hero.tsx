import Link from "next/link";
import { ArrowRight, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/brand/logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient dawn light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(58% 60% at 50% -8%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%), radial-gradient(50% 60% at 50% 0%, color-mix(in srgb, var(--primary) 12%, transparent), transparent 72%)",
        }}
      />

      <Container size="md" className="relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="flex flex-col items-center text-center">
          <span className="animate-rise mb-8 inline-block">
            <LogoMark className="size-14" />
          </span>

          <p className="animate-rise mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-sm text-muted-foreground">
            <Sunrise className="size-4 text-accent" aria-hidden />
            A gentle guide through what comes after
          </p>

          <h1
            className="animate-rise max-w-3xl text-balance text-4xl leading-[1.1] sm:text-5xl md:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            The paperwork of loss,
            <br className="hidden sm:block" /> made gentle.
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-pretty text-lg text-muted-foreground"
            style={{ animationDelay: "120ms" }}
          >
            When someone you love dies, dozens of accounts, forms, and
            deadlines arrive all at once &mdash; while you&rsquo;re grieving.
            The After turns that overwhelming pile into a calm, personal plan,
            and drafts the hardest letters and calls for you.
          </p>

          <div
            className="animate-rise mt-9 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "180ms" }}
          >
            <Button asChild size="lg">
              <Link href="/begin">
                Begin gently
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-helps">See how it helps</Link>
            </Button>
          </div>

          <p
            className="animate-fade mt-7 text-sm text-muted-foreground"
            style={{ animationDelay: "260ms" }}
          >
            Free to start &middot; Private to you &middot; Go entirely at your
            own pace
          </p>
        </div>
      </Container>
    </section>
  );
}
