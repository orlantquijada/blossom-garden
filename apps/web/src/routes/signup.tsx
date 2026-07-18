import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { UserRound } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { api } from "../../convex/_generated/api";
import { authClient, initialMemberCredential } from "../lib/auth-client";
import { LanguagePicker } from "../components/language-picker";

const inputClass =
  "rounded-md border border-input bg-transparent px-4 py-3 text-foreground text-base outline-none placeholder:text-foreground/35 focus:border-primary";

function ProfileLink() {
  const { t } = useTranslation();
  const card = useQuery(api.members.getMyCard);

  return card ? (
    <Link
      aria-label={t("profile")}
      className="border-input bg-card text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-ring grid size-9 place-items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
      params={{ memberCode: card.memberCode }}
      title={t("profile")}
      to="/m/$memberCode"
    >
      <UserRound aria-hidden="true" className="size-4" />
    </Link>
  ) : null;
}

const getMyCardForSignup = createServerFn({ method: "GET" }).handler(
  async () => {
    const { fetchAuthQuery } = await import("@/lib/auth-server");
    return await fetchAuthQuery(api.members.getMyCard, {});
  }
);

function SignupPage() {
  const signUp = useMutation(api.members.signUp);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const name = String(form.get("name") ?? "").trim();

    try {
      const auth = await authClient.signUp.email({
        email,
        name,
        password: initialMemberCredential,
      });

      if (auth.error) {
        throw new Error(auth.error.message ?? "Account creation failed.");
      }

      const { memberCode } = await signUp({
        email,
        name,
        phone: String(form.get("phone") ?? "").trim() || undefined,
      });
      await navigate({ params: { memberCode }, to: "/m/$memberCode" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("signupFailed"));
      setSubmitting(false);
    }
  }

  return (
    <main className="garden bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="absolute top-5 right-5 z-10 flex items-center gap-2 sm:top-7 sm:right-7">
        <Authenticated>
          <ProfileLink />
        </Authenticated>
        <LanguagePicker />
      </div>
      <div className="w-full max-w-md">
        <p className="font-fraunces text-primary text-sm tracking-[0.45em]">
          BLOSSOM GARDEN
        </p>
        <h1 className="font-fraunces text-foreground mt-3 text-3xl">
          {t("title")}
        </h1>
        <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
          {t("intro")}
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5" htmlFor="member-name">
            <span className="text-primary text-sm tracking-wide">
              {t("name")}
            </span>
            <input
              aria-label={t("name")}
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
            <span className="text-primary text-sm tracking-wide">
              {t("email")}
            </span>
            <input
              aria-label={t("email")}
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
            <span className="text-primary text-sm tracking-wide">
              {t("phone")}{" "}
              <span className="text-foreground/45">({t("optional")})</span>
            </span>
            <input
              aria-label={t("phone")}
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
            className="font-fraunces bg-primary text-primary-foreground mt-2 rounded-md px-9 py-3 text-base tracking-wide transition-opacity hover:opacity-85 disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting ? t("creating") : t("submit")}
          </button>
        </form>

        <p className="text-foreground/50 mt-6 text-sm">{t("alreadyMember")}</p>
        <Link
          className="text-primary/80 mt-4 inline-block text-sm underline-offset-4 hover:underline"
          to="/"
        >
          {t("back")}
        </Link>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/signup")({
  loader: async () => {
    const card = await getMyCardForSignup();

    if (card) {
      throw redirect({
        params: { memberCode: card.memberCode },
        to: "/m/$memberCode",
      });
    }
  },
  component: SignupPage,
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
