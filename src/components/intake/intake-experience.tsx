"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import {
  visibleSteps,
  type IntakeAnswers,
  type IntakeStep,
} from "@/lib/intake/questions";
import { OptionCard } from "./option-card";
import { completeIntakeAction, saveProgressAction } from "@/app/begin/actions";

type Phase = "stepping" | "completing" | "error";

export function IntakeExperience({
  caseId,
  initialAnswers = {},
}: {
  caseId: string;
  initialAnswers?: IntakeAnswers;
}) {
  const router = useRouter();
  const storageKey = `after:intake:${caseId}`;

  const [answers, setAnswers] = React.useState<IntakeAnswers>(initialAnswers);
  const [currentId, setCurrentId] = React.useState<string>("intro");
  const [phase, setPhase] = React.useState<Phase>("stepping");
  const [saving, setSaving] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // Restore any in-progress answers from this browser.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const stored = JSON.parse(raw) as IntakeAnswers;
        setAnswers((prev) => ({ ...prev, ...stored }));
      }
    } catch {
      // Ignore malformed storage.
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist locally so nothing is lost if they step away.
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Storage may be unavailable.
    }
  }, [answers, hydrated, storageKey]);

  const steps = visibleSteps(answers);
  const index = Math.max(
    0,
    steps.findIndex((s) => s.id === currentId)
  );
  const step = steps[index];
  const progress = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 0;

  function advanceFrom(next: IntakeAnswers) {
    const list = visibleSteps(next);
    const idx = list.findIndex((s) => s.id === currentId);
    const nextStep = list[idx + 1];
    if (nextStep) {
      setCurrentId(nextStep.id);
    } else {
      void finish(next);
    }
  }

  function goBack() {
    if (index > 0) setCurrentId(steps[index - 1].id);
  }

  function selectSingle(key: keyof IntakeAnswers, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    // Let the selection register visually, then move on.
    window.setTimeout(() => advanceFrom(next), 260);
  }

  function toggleMulti(key: keyof IntakeAnswers, value: string) {
    const current = (answers[key] as string[] | undefined) ?? [];
    const nextValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [key]: nextValues });
  }

  function setText(key: keyof IntakeAnswers, value: string) {
    setAnswers({ ...answers, [key]: value });
  }

  async function finish(final: IntakeAnswers) {
    setPhase("completing");
    try {
      const result = await completeIntakeAction(caseId, final);
      if (result.ok) {
        try {
          window.localStorage.removeItem(storageKey);
        } catch {
          // ignore
        }
        router.push("/plan");
      }
    } catch {
      setPhase("error");
    }
  }

  async function saveAndPause() {
    setSaving(true);
    try {
      await saveProgressAction(caseId, answers);
      router.push("/");
    } catch {
      setSaving(false);
    }
  }

  if (phase === "completing") {
    return <BuildingPlan />;
  }

  if (phase === "error") {
    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-2xl">Something interrupted us</h1>
        <p className="text-muted-foreground">
          Your answers are safe. Let&rsquo;s try building your plan again.
        </p>
        <Button onClick={() => finish(answers)}>Try again</Button>
      </div>
    );
  }

  const value = step.key ? answers[step.key] : undefined;
  const hasValue = Array.isArray(value)
    ? value.length > 0
    : typeof value === "string"
      ? value.trim().length > 0
      : false;
  const isLast = index === steps.length - 1;
  const canContinueLabel = step.optional && !hasValue ? "Skip" : "Continue";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-8 sm:py-12">
      <Progress
        value={progress}
        label="Intake progress"
        className="mb-10"
      />

      <div
        key={step.id}
        className="animate-rise flex flex-1 flex-col"
        role="group"
        aria-labelledby={`prompt-${step.id}`}
      >
        <div className="mb-6 flex items-start gap-3">
          <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Heart className="size-4.5" aria-hidden />
          </span>
          <div>
            <h1
              id={`prompt-${step.id}`}
              className="text-2xl leading-snug sm:text-[1.7rem]"
            >
              {step.prompt}
            </h1>
            {step.helper && (
              <p className="mt-2 text-muted-foreground">{step.helper}</p>
            )}
          </div>
        </div>

        <div className="flex-1">
          <StepControl
            step={step}
            answers={answers}
            onSelectSingle={selectSingle}
            onToggleMulti={toggleMulti}
            onSetText={setText}
            onContinue={() => advanceFrom(answers)}
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            disabled={index === 0}
            className={cn(index === 0 && "invisible")}
          >
            <ArrowLeft aria-hidden />
            Back
          </Button>

          {step.kind !== "single" && (
            <Button onClick={() => advanceFrom(answers)}>
              {isLast ? "See my plan" : canContinueLabel}
              <ArrowRight aria-hidden />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={saveAndPause}
          disabled={saving}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save and continue later"}
        </button>
      </div>
    </div>
  );
}

function StepControl({
  step,
  answers,
  onSelectSingle,
  onToggleMulti,
  onSetText,
  onContinue,
}: {
  step: IntakeStep;
  answers: IntakeAnswers;
  onSelectSingle: (key: keyof IntakeAnswers, value: string) => void;
  onToggleMulti: (key: keyof IntakeAnswers, value: string) => void;
  onSetText: (key: keyof IntakeAnswers, value: string) => void;
  onContinue: () => void;
}) {
  if (step.kind === "intro" || step.kind === "outro") {
    return null;
  }

  const key = step.key!;
  const raw = answers[key];

  if (step.kind === "single") {
    return (
      <div className="flex flex-col gap-2.5" role="radiogroup">
        {step.options?.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={raw === opt.value}
            onSelect={() => onSelectSingle(key, opt.value)}
          />
        ))}
      </div>
    );
  }

  if (step.kind === "multi") {
    const selected = (raw as string[] | undefined) ?? [];
    return (
      <div className="flex flex-col gap-2.5">
        {step.options?.map((opt) => (
          <OptionCard
            key={opt.value}
            multi
            label={opt.label}
            description={opt.description}
            selected={selected.includes(opt.value)}
            onSelect={() => onToggleMulti(key, opt.value)}
          />
        ))}
      </div>
    );
  }

  if (step.kind === "longtext") {
    return (
      <Textarea
        autoFocus
        value={(raw as string) ?? ""}
        placeholder={step.placeholder}
        onChange={(e) => onSetText(key, e.target.value)}
        className="min-h-36"
      />
    );
  }

  // text or date
  return (
    <Input
      autoFocus
      type={step.kind === "date" ? "date" : "text"}
      value={(raw as string) ?? ""}
      placeholder={step.placeholder}
      onChange={(e) => onSetText(key, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onContinue();
        }
      }}
    />
  );
}

function BuildingPlan() {
  const lines = [
    "Reading what you shared…",
    "Sorting what needs care now from what can wait…",
    "Setting gentle timing for each step…",
    "Putting your plan together…",
  ];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = window.setInterval(
      () => setI((v) => (v + 1) % lines.length),
      1600
    );
    return () => window.clearInterval(t);
  }, [lines.length]);

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark className="size-14 animate-pulse" />
      <h1 className="text-2xl">Building your plan</h1>
      <p className="min-h-6 text-muted-foreground transition-opacity" aria-live="polite">
        {lines[i]}
      </p>
    </div>
  );
}
