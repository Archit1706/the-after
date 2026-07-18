import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Container } from "@/components/ui/container";
import { HowItWorks } from "@/components/site/landing/how-it-works";
import { Pillars } from "@/components/site/landing/pillars";
import { Inclusivity } from "@/components/site/landing/inclusivity";
import { PrivacyNote } from "@/components/site/landing/privacy-note";
import { FinalCta } from "@/components/site/landing/final-cta";

export const metadata = {
  title: "How it helps",
  description:
    "How The After guides you through the practical side of loss, one gentle step at a time.",
};

export default function HowItHelpsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="py-16 sm:py-20">
          <Container size="sm" className="text-center">
            <h1 className="text-4xl sm:text-5xl">How The After helps</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              A calm companion for everything that follows a loss &mdash; so you
              can focus on grieving, not paperwork.
            </p>
          </Container>
        </section>
        <HowItWorks />
        <Pillars />
        <Inclusivity />
        <PrivacyNote />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
