"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "the-after-theme";
type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getActiveTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "dark" || explicit === "light") return explicit;
  return getSystemTheme();
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    setTheme(getActiveTheme());
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private mode); the choice still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle color theme"
      }
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full text-muted-foreground",
        "transition-colors hover:bg-surface-muted hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      {/* Render nothing theme-specific until mounted to avoid hydration mismatch. */}
      {mounted && theme === "dark" ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </button>
  );
}
