"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DocumentKind } from "@/lib/domain/enums";
import { uploadDocumentAction } from "@/app/(app)/documents/actions";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploader() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [kind, setKind] = React.useState<string>("death_certificate");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function submit() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", kind);
    startTransition(async () => {
      const result = await uploadDocumentAction(formData);
      if (result.ok) {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-5">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={(e) => {
          setError(null);
          setFile(e.target.files?.[0] ?? null);
        }}
      />

      {file ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove selected file"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center gap-2 rounded-xl py-6 text-center transition-colors hover:bg-surface-muted/60"
          )}
        >
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Upload className="size-6" aria-hidden />
          </span>
          <span className="font-medium">Choose a file to keep safe</span>
          <span className="text-sm text-muted-foreground">
            The death certificate, will, IDs, statements&hellip;
          </span>
        </button>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">This is a:</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-10 rounded-lg border border-input bg-surface px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {DocumentKind.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <Button
          onClick={submit}
          loading={isPending}
          disabled={!file && !isPending}
          className="sm:ml-auto"
        >
          <Upload aria-hidden />
          Upload
        </Button>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
    </div>
  );
}
