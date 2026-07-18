import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";

export function PrivacyNote() {
  return (
    <section className="py-8">
      <Container size="md">
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-surface p-7 shadow-soft sm:flex-row sm:items-center">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <ShieldCheck className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl">Yours, and only yours</h2>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">
              Your information is private to you. Share nothing you don&rsquo;t
              want to, and export or permanently delete everything at any time.
              There is no rush, and no one looking over your shoulder.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
