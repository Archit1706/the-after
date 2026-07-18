"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Printer,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { LetterType } from "@/lib/domain/enums";
import type { Letter } from "@/lib/domain/schemas";
import {
  deleteLetterAction,
  regenerateLetterAction,
  updateLetterAction,
} from "@/app/(app)/letters/actions";

export function LetterEditor({ letter }: { letter: Letter }) {
  const [title, setTitle] = React.useState(letter.title);
  const [recipient, setRecipient] = React.useState(letter.recipient);
  const [subject, setSubject] = React.useState(letter.subject);
  const [body, setBody] = React.useState(letter.body);

  const snapshot = React.useRef({
    title: letter.title,
    recipient: letter.recipient,
    subject: letter.subject,
    body: letter.body,
  });

  const [savePending, startSave] = React.useTransition();
  const [regenPending, startRegen] = React.useTransition();
  const [deletePending, startDelete] = React.useTransition();
  const [justSaved, setJustSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const dirty =
    title !== snapshot.current.title ||
    recipient !== snapshot.current.recipient ||
    subject !== snapshot.current.subject ||
    body !== snapshot.current.body;

  function save() {
    startSave(async () => {
      try {
        await updateLetterAction(letter.id, {
          title,
          recipient,
          subject,
          body,
        });
        snapshot.current = { title, recipient, subject, body };
        setJustSaved(true);
        window.setTimeout(() => setJustSaved(false), 2000);
      } catch {
        // Keep edits in place.
      }
    });
  }

  function regenerate() {
    startRegen(async () => {
      try {
        const next = await regenerateLetterAction(letter.id);
        setSubject(next.subject);
        setBody(next.body);
        snapshot.current = { ...snapshot.current, subject: next.subject, body: next.body };
      } catch {
        // Leave current content.
      }
    });
  }

  function remove() {
    if (!window.confirm("Delete this letter? This can't be undone.")) return;
    startDelete(async () => {
      try {
        await deleteLetterAction(letter.id);
      } catch {
        // Redirect handles success.
      }
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked.
    }
  }

  function download() {
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "letter").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function print() {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    const escaped = body
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    win.document.write(`<!doctype html><html><head><title>${title}</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #1a1a1a; max-width: 640px; margin: 48px auto; padding: 0 24px; white-space: pre-wrap; }
      </style></head><body>${escaped}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/letters"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to letters
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="primary">{LetterType.labels[letter.type]}</Badge>
        {letter.status === "final" && <Badge variant="success">Final</Badge>}
      </div>

      <div className="mb-6 flex flex-wrap gap-2" data-no-print>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="outline" size="sm" onClick={download}>
          <Download aria-hidden />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={print}>
          <Printer aria-hidden />
          Print / PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={regenerate}
          loading={regenPending}
        >
          <RefreshCw aria-hidden />
          Regenerate
        </Button>
      </div>

      <div className="space-y-5">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Recipient">
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Field>
        {letter.type !== "phone_script" && (
          <Field label="Subject">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Field>
        )}
        <Field
          label={letter.type === "phone_script" ? "Script" : "Letter"}
          hint="Placeholders in [brackets] are for you to fill in."
        >
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[26rem] font-mono text-sm leading-relaxed"
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3" data-no-print>
        <Button onClick={save} disabled={!dirty} loading={savePending}>
          Save changes
        </Button>
        {justSaved && !dirty && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <Check className="size-4" aria-hidden />
            Saved
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-danger hover:bg-danger/10 hover:text-danger"
          onClick={remove}
          loading={deletePending}
        >
          <Trash2 aria-hidden />
          Delete
        </Button>
      </div>
    </div>
  );
}
