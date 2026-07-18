import {
  Building2,
  FolderLock,
  HeartHandshake,
  ListChecks,
  PenLine,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Guided intake",
    body: "A warm conversation that gently learns your situation and builds your plan — no jargon, no pressure.",
  },
  {
    icon: ListChecks,
    title: "Your plan & deadlines",
    body: "A prioritized checklist with the dates that actually matter, so nothing important slips by while you grieve.",
  },
  {
    icon: PenLine,
    title: "Letters & phone scripts",
    body: "Drafted for banks, benefits, utilities, and more — personalized, and ready to send or read aloud.",
  },
  {
    icon: FolderLock,
    title: "Document vault",
    body: "Keep the death certificate, will, and IDs in one safe place, ready to attach wherever they're needed.",
  },
  {
    icon: Building2,
    title: "Who to notify",
    body: "A directory of institutions — what each one needs from you, and how to reach a real person.",
  },
  {
    icon: Sparkles,
    title: "A companion, always",
    body: "Ask anything, anytime. It remembers your situation, so you never have to explain from the start again.",
  },
];

export function Pillars() {
  return (
    <section className="bg-surface-muted/40 py-16 sm:py-24">
      <Container size="lg">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">Everything the after asks of you, in one calm place</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Not another dashboard of buttons &mdash; a companion that carries the
            load with you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-lifted"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/14 text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
                <pillar.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl">{pillar.title}</h3>
              <p className="mt-2.5 leading-relaxed text-muted-foreground">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
