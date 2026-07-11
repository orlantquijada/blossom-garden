import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { FormEvent } from "react";

import { api } from "../../convex/_generated/api";

const inputClass =
  "rounded-md border border-[#e6a42b]/40 bg-transparent px-4 py-3 text-[#ede5d4] text-base outline-none placeholder:text-[#ede5d4]/35 focus:border-[#e6a42b]";

function SignupPage() {
  const signUp = useMutation(api.members.signUp);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      const { memberCode } = await signUp({
        email: String(form.get("email") ?? "").trim(),
        name: String(form.get("name") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim() || undefined,
      });
      await navigate({ params: { memberCode }, to: "/m/$memberCode" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Signup failed.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#060504] px-6 py-10 text-[#ede5d4]">
      <div className="w-full max-w-md">
        <p className="font-fraunces text-sm tracking-[0.45em] text-[#e6a42b]">
          BLOSSOM GARDEN
        </p>
        <h1 className="font-fraunces mt-3 text-3xl text-[#ede5d4]">
          Join the membership
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#ede5d4]/70">
          Sign up once and receive your personal member QR. Show it at the
          counter to log your visits and unlock VIP status.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5" htmlFor="member-name">
            <span className="text-sm tracking-wide text-[#e6a42b]">Name</span>
            <input
              aria-label="Name"
              autoComplete="name"
              className={inputClass}
              id="member-name"
              maxLength={100}
              name="name"
              required
              type="text"
            />
          </label>
          <label className="grid gap-1.5" htmlFor="member-email">
            <span className="text-sm tracking-wide text-[#e6a42b]">Email</span>
            <input
              aria-label="Email"
              autoComplete="email"
              className={inputClass}
              id="member-email"
              inputMode="email"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="grid gap-1.5" htmlFor="member-phone">
            <span className="text-sm tracking-wide text-[#e6a42b]">
              Phone (optional)
            </span>
            <input
              aria-label="Phone"
              autoComplete="tel"
              className={inputClass}
              id="member-phone"
              inputMode="tel"
              name="phone"
              type="tel"
            />
          </label>
          {error ? (
            <p aria-live="polite" className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="font-fraunces mt-2 rounded-md bg-[#e6a42b] px-9 py-3 text-base tracking-wide text-[#060504] transition-opacity hover:opacity-85 disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Creating your pass…" : "Get my member QR"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#ede5d4]/50">
          Already a member? Sign up with the same email to see your pass again.
        </p>
        <Link
          className="mt-4 inline-block text-sm text-[#e6a42b]/80 underline-offset-4 hover:underline"
          to="/"
        >
          Back to Blossom Garden
        </Link>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
