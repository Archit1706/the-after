import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Container } from "@/components/ui/container";
import { HowItWorks } from "@/components/site/landing/how-it-works";
import { Pillars } from "@/components/site/landing/pillars";
import { Inclusivity } from "@/components/site/landing/inclusivity";
import { PrivacyNote } from "@/components/site/landing/privacy-note";
import { FinalCta } from "@/components/site/landing/final-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it helps with the practical tasks after a loss",
  description:
    "See how The After offers death admin help with who to notify, settling an estate, death certificates, accounts, and probate questions.",
  alternates: { canonical: "/how-it-helps" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should I do when someone dies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Begin with the most immediate needs, then work through practical tasks such as notifying organizations, gathering documents, and caring for accounts. The After keeps those steps in one calm, personal plan.",
      },
    },
    {
      "@type": "Question",
      name: "Who needs to be notified when someone dies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The people and organizations vary by situation, but may include family, an employer, government agencies, banks, insurers, and service providers. The After helps you keep track of who you have contacted.",
      },
    },
    {
      "@type": "Question",
      name: "How many death certificate copies do I need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The right number depends on the accounts, benefits, and property involved. Many organizations need a certified copy, so it can help to make a list before ordering and request more only when they will be useful.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need probate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Whether probate is needed depends on the estate, local law, and how assets are owned. The After can help you organize the information and questions to bring to a qualified local professional.",
      },
    },
  ],
};

export default function HowItHelpsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
