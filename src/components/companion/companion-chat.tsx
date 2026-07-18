"use client";

import * as React from "react";
import { SendHorizontal } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { cn, createId } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What should I focus on first?",
  "How do I close a bank account?",
  "I'm feeling overwhelmed.",
  "What do I need for the death certificate?",
];

export function CompanionChat({
  initialMessages,
}: {
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const userMsg: ChatMessage = {
      id: createId("m"),
      role: "user",
      content: trimmed,
    };
    const assistantId = createId("m");
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "I'm sorry — something went wrong just then. Please try again in a moment.",
              }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-8 sm:px-8"
        role="log"
        aria-live="polite"
        aria-label="Conversation with your companion"
      >
        <div className="mx-auto max-w-2xl space-y-6">
          {isEmpty ? (
            <div className="pt-8 text-center">
              <LogoMark className="mx-auto size-12" />
              <h1 className="mt-5 text-2xl">I&rsquo;m here whenever you need</h1>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Ask me anything about what to do next, how to handle a
                particular account, or how you&rsquo;re feeling. I know your
                situation, so you never have to start from scratch.
              </p>
              <div className="mx-auto mt-8 grid max-w-lg gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-surface p-3.5 text-left text-sm transition-colors hover:border-primary/50 hover:bg-surface-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
        </div>
      </div>

      <div className="border-t border-border bg-surface/60 px-5 py-4 sm:px-8">
        <form
          className="mx-auto flex max-w-2xl items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask me anything…"
            aria-label="Your message"
            className="max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-input bg-surface px-4 py-2.5 text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <SendHorizontal className="size-5" aria-hidden />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-muted-foreground">
          The After offers general guidance, not legal or financial advice.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {!isUser && (
        <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12">
          <LogoMark className="size-5" />
        </span>
      )}
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-surface-muted text-foreground"
        )}
      >
        {message.content || (
          <span className="inline-flex gap-1" aria-label="Thinking">
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
          </span>
        )}
      </div>
    </div>
  );
}
