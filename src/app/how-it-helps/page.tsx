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

const faqs = [
  {
    question: "What should I do when someone dies?",
    answer:
      "Start with what needs care today, then take the practical work one small piece at a time. The After turns the paperwork, calls, and documents into a personal checklist so you do not have to hold it all in your head.",
  },
  {
    question: "Who needs to be notified when someone dies?",
    answer:
      "It depends on your situation, but family, an employer, government agencies, banks, insurers, and service providers are common places to start. The After helps you make a list and remember who you have already contacted.",
  },
  {
    question: "How do I settle an estate?",
    answer:
      "Begin by gathering important documents, understanding what the person owned and owed, and checking whether there is a will. The After helps you get organized and prepare questions for a qualified local legal or tax professional when needed.",
  },
  {
    question: "How many death certificate copies do I need?",
    answer:
      "The right number depends on the accounts, benefits, and property involved. Many organizations ask for a certified copy, so it helps to list who will need one before ordering and request more only when they are likely to be useful.",
  },
  {
    question: "Do I need probate?",
    answer:
      "That depends on the estate, local law, and how assets are owned. Some estates can avoid full probate; others cannot. The After can help you organize the details and questions to bring to a qualified local professional.",
  },
  {
    question: "How do I close a deceased person’s accounts?",
    answer:
      "When you are ready, gather the account details and a death certificate, then ask each organization for its bereavement or estate process. The After keeps those calls, documents, and next steps in one place so you can move at a manageable pace.",
  },
  {
    question: "Can The After help with death admin?",
    answer:
      "Yes. The After offers gentle death admin help: a personal plan, document tracking, letters and phone scripts, a directory of organizations to notify, and a companion for the questions that come up along the way.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
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
        <section className="border-t border-border py-16 sm:py-20">
          <Container size="sm">
            <h2 className="text-center text-3xl sm:text-4xl">
              Questions you may be carrying
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              There&rsquo;s no single right order. Here are a few gentle places to
              start when the practical questions begin to pile up.
            </p>
            <div className="mt-10 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-xl border border-border bg-card px-5 py-4"
                >
                  <summary className="cursor-pointer font-medium text-foreground">
                    {faq.question}
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </section>
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
