import { Container } from "@/components/ui/container";

export function Reassurance() {
  return (
    <section className="py-16 sm:py-20">
      <Container size="sm">
        <div className="rounded-2xl border border-border bg-surface px-7 py-10 shadow-soft sm:px-12 sm:py-14">
          <h2 className="text-2xl sm:text-3xl">You didn&rsquo;t ask for this list.</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Bank accounts to close. A death certificate to order &mdash; and
              copies, so many copies. Subscriptions that keep charging. A
              pension, perhaps. Accounts that still suggest their birthday.
            </p>
            <p>
              It&rsquo;s a second full-time job, arriving at the worst possible
              moment. And most people face it with a stack of tabs, a legal pad,
              and no idea what&rsquo;s urgent.
            </p>
            <p className="font-medium text-foreground">
              The After holds all of it for you &mdash; what to do, who to
              contact, and by when &mdash; so you only ever have to look at the
              next small step.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
