"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  signInAction,
  signUpAction,
  signInWithGoogleAction,
  type AuthActionState,
} from "@/lib/auth/email-actions";

export function AuthForm({
  mode,
  next = "/plan",
}: {
  mode: "signin" | "signup";
  next?: string;
}) {
  const action = mode === "signin" ? signInAction : signUpAction;
  const [state, formAction, isPending] = React.useActionState<
    AuthActionState,
    FormData
  >(action, {});

  return (
    <div className="space-y-5">
      <form action={signInWithGoogleAction}>
        <Button type="submit" variant="outline" className="w-full">
          Continue with Google
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Email">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </Field>
        <Field
          label="Password"
          hint={mode === "signup" ? "At least 8 characters." : undefined}
        >
          <Input
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
          />
        </Field>

        {state.error && (
          <p className="text-sm font-medium text-danger" role="alert">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="text-sm font-medium text-success" role="status">
            {state.message}
          </p>
        )}

        <Button type="submit" className="w-full" loading={isPending}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <Link
              href="/sign-up"
              className="text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
