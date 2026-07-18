import { ClipboardList, MessagesSquare, PenLine, Footprints } from "lucide-react";
import { Container } from "@/components/ui/container";

const steps = [
  {
    icon: MessagesSquare,
    title: "Tell us what happened, gently",
    body: "A short, kind conversation — no forms to decode. Share only what you're ready to, and skip anything you're not.",
  },
  {
    icon: ClipboardList,
    title: "Get a plan for your situation",
    body: "A clear, prioritized checklist with the deadlines that matter, grouped into what's urgent and what can quietly wait.",
  },
  {
    icon: PenLine,
    title: "Let us draft the hard parts",
    body: "Notification letters and phone scripts, personalized to your loved one and ready to send or read aloud.",
  },
  {
    icon: Footprints,
    title: "Move at your own pace",
    body: "Everything saves as you go. Come back tomorrow, next week, or whenever you have the strength.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20" id="how-it-works">
      <Container size="lg">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">How The After helps</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four steps, and never more than one at a time.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-surface p-6 shadow-soft"
            >
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <step.icon className="size-6" aria-hidden />
              </span>
              <span
                className="absolute right-5 top-5 font-serif text-2xl text-border"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="text-lg">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
