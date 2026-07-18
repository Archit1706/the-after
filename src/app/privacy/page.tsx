import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Privacy",
  description: "How The After treats your information.",
};

const sections = [
  {
    heading: "Your information is yours",
    body: "Everything you share — details about your loved one, your documents, your notes — belongs to you. We use it only to build and show your plan, and never to advertise to you or sell to anyone.",
  },
  {
    heading: "Share only what you want",
    body: "Every question in the intake is optional. You can skip anything, and the app still works. The more you share, the more tailored your plan — but that trade is always your choice.",
  },
  {
    heading: "You can leave at any time",
    body: "You can export a copy of everything you've added, and permanently delete your entire case whenever you like, from Settings. When you delete, it's gone.",
  },
  {
    heading: "Documents",
    body: "Files you upload are stored to power your vault. When connected to secure cloud storage, they're kept private to your account and served through short-lived, signed links.",
  },
  {
    heading: "Not professional advice",
    body: "The After offers general, practical guidance to help you get organized. It is not legal, tax, financial, or medical advice, and it isn't a substitute for a licensed professional. Please verify anything important for your situation.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container size="sm" className="py-16 sm:py-20">
          <h1 className="text-4xl">Privacy</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A plain-language summary of how we treat your information. In short:
            it&rsquo;s yours, and we keep it that way.
          </p>
          <div className="mt-12 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </section>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
