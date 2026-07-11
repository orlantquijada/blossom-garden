import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { api } from "../../convex/_generated/api";

function SignIn() {
  const [error, setError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  let submitLabel = isSigningUp ? "Create account" : "Sign in";

  if (submitting) {
    submitLabel = "Please wait…";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const result = isSigningUp
        ? await authClient.signUp.email({ email, name: email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Authentication failed.");
      }
    } catch {
      setError("Could not reach the authentication service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid w-full max-w-sm gap-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-semibold">
        Admin {isSigningUp ? "sign-up" : "sign-in"}
      </h1>
      <label htmlFor="admin-email">Email</label>
      <Input
        autoComplete="username"
        id="admin-email"
        inputMode="email"
        name="email"
        required
        type="email"
      />
      <label htmlFor="admin-password">Password</label>
      <Input
        aria-describedby={isSigningUp ? "admin-password-help" : undefined}
        autoComplete={isSigningUp ? "new-password" : "current-password"}
        id="admin-password"
        maxLength={128}
        minLength={8}
        name="password"
        required
        type="password"
      />
      {isSigningUp ? (
        <p className="text-muted-foreground text-sm" id="admin-password-help">
          Use 8–128 characters.
        </p>
      ) : null}
      {error ? (
        <p aria-live="polite" className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button disabled={submitting} type="submit">
        {submitLabel}
      </Button>
      <Button
        disabled={submitting}
        onClick={() => {
          setError("");
          setIsSigningUp(!isSigningUp);
        }}
        type="button"
        variant="link"
      >
        {isSigningUp
          ? "Use an existing account"
          : "Create the first admin account"}
      </Button>
    </form>
  );
}

function AdminContent() {
  const isAdmin = useQuery(api.auth.isAdmin);

  if (isAdmin === undefined) {
    return <p>Checking access…</p>;
  }

  if (!isAdmin) {
    return <p>Unauthorized</p>;
  }

  return <Outlet />;
}

function AdminRoute() {
  return (
    <>
      <AuthLoading>
        <main className="grid min-h-screen place-items-center p-6">
          Checking access…
        </main>
      </AuthLoading>
      <Unauthenticated>
        <main className="grid min-h-screen place-items-center p-6">
          <SignIn />
        </main>
      </Unauthenticated>
      <Authenticated>
        <AdminContent />
      </Authenticated>
    </>
  );
}

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});
