import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/site/landing/hero";
import { Reassurance } from "@/components/site/landing/reassurance";
import { HowItWorks } from "@/components/site/landing/how-it-works";
import { Pillars } from "@/components/site/landing/pillars";
import { Inclusivity } from "@/components/site/landing/inclusivity";
import { PrivacyNote } from "@/components/site/landing/privacy-note";
import { FinalCta } from "@/components/site/landing/final-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The After — a gentle guide through what comes after",
  description:
    "A gentle what to do when someone dies checklist, with support for who to notify, documents, accounts, and the next small step.",
  alternates: { canonical: "/" },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "The After",
      url: "https://theafter.vercel.app",
      description:
        "A gentle guide through the practical tasks that follow a loss.",
    },
    {
      "@type": "Organization",
      name: "The After",
      url: "https://theafter.vercel.app",
      description:
        "A compassionate death-admin companion for practical tasks after a loss.",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
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
