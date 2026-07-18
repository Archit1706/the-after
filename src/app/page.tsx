import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/site/landing/hero";
import { Reassurance } from "@/components/site/landing/reassurance";
import { HowItWorks } from "@/components/site/landing/how-it-works";
import { Pillars } from "@/components/site/landing/pillars";
import { Inclusivity } from "@/components/site/landing/inclusivity";
import { PrivacyNote } from "@/components/site/landing/privacy-note";
import { FinalCta } from "@/components/site/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <Reassurance />
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
