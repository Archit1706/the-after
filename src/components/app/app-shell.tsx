"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/actions";
import { NAV_ITEMS } from "./nav";

interface ShellUser {
  name: string | null;
  email: string | null;
  isGuest: boolean;
}

export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-border bg-surface lg:flex lg:flex-col">
        <SidebarContent user={user} pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/plan" aria-label="The After — your plan">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="animate-rise absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-border bg-surface">
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <SidebarContent user={user} pathname={pathname} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function SidebarContent({
  user,
  pathname,
}: {
  user: ShellUser;
  pathname: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="hidden px-5 py-6 lg:block">
        <Link href="/plan" aria-label="The After — your plan">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name || (user.isGuest ? "Guest" : "You")}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email || (user.isGuest ? "Not signed in" : "")}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <LogOut className="size-5 shrink-0" aria-hidden />
            {user.isGuest ? "Start over" : "Sign out"}
          </button>
        </form>
      </div>
    </div>
  );
}
