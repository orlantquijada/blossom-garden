import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Check, Crown, Flower2, ScanLine, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LanguagePicker } from "@/components/language-picker";

import { qrUrl } from "@/lib/utils";

import { api } from "../../convex/_generated/api";

const checkInButtonClass =
  "font-fraunces bg-primary text-primary-foreground focus-visible:outline-primary mt-8 flex w-full items-center justify-center gap-2 rounded-md px-5 py-3.5 text-base font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-70";

function CheckInButton({ isOwnCard }: { readonly isOwnCard: boolean }) {
  const { t } = useTranslation();
  const checkInSelf = useMutation(api.scanLogs.checkInSelf);
  const checkedInRecently = useQuery(api.scanLogs.checkedInRecently) ?? false;
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => setToast(false), 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!isOwnCard) {
    // Someone else's pass (or signed out): no self check-in, just point at the QR.
    return (
      <>
        <a className={checkInButtonClass} href="#member-qr">
          <ScanLine className="size-5" /> {t("checkIn")}
        </a>
        <p className="text-foreground/55 mt-2 text-center text-xs">
          {t("showQrHint")}
        </p>
      </>
    );
  }

  const toastEl = toast ? (
    <output className="bg-primary text-primary-foreground font-fraunces animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-50 block -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap shadow-lg">
      ✿ {t("checkedIn")}
    </output>
  ) : null;

  if (checkedInRecently) {
    return (
      <>
        <div className="font-fraunces border-primary/35 text-primary mt-8 flex w-full items-center justify-center gap-2 rounded-md border px-5 py-3.5 text-base font-semibold tracking-[0.12em] uppercase">
          <Check className="size-5" /> {t("checkedIn")}
        </div>
        <p className="text-foreground/55 mt-2 text-center text-xs">
          {t("alreadyCheckedIn")}
        </p>
        {toastEl}
      </>
    );
  }

  async function handleClick() {
    setBusy(true);
    setFailed(false);

    try {
      const { already } = await checkInSelf({});

      if (!already) {
        setToast(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className={checkInButtonClass}
        disabled={busy}
        onClick={handleClick}
        type="button"
      >
        <ScanLine className="size-5" />
        {busy ? t("checkingIn") : t("checkIn")}
      </button>
      <p
        aria-live="polite"
        className="text-foreground/55 mt-2 text-center text-xs"
      >
        {failed ? t("checkInFailed") : t("showQrHint")}
      </p>
      {toastEl}
    </>
  );
}

function MemberCardPage() {
  const { i18n, t } = useTranslation();
  const { memberCode } = Route.useParams();
  const card = useQuery(api.members.getCard, { memberCode });
  const myCard = useQuery(api.members.getMyCard);
  const isVip = card?.status === "vip";
  const isOwnCard = !!card && myCard?.memberCode === card.memberCode;

  return (
    <main className="garden bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="absolute top-5 right-5 z-10 sm:top-7 sm:right-7">
        <LanguagePicker />
      </div>

      {card === undefined ? (
        <p className="text-foreground/60">{t("loadingPass")}</p>
      ) : null}

      {card === null ? (
        <>
          <h1 className="font-fraunces text-2xl">{t("passNotFound")}</h1>
          <p className="text-foreground/70 mt-2 text-sm">
            {t("passNotFoundIntro")}
          </p>
          <Link
            className="font-fraunces bg-primary text-primary-foreground mt-6 rounded-md px-9 py-3 tracking-wide hover:opacity-85"
            to="/signup"
          >
            {t("signUpAgain")}
          </Link>
        </>
      ) : null}

      {card ? (
        <section className="bg-background w-full max-w-[30rem] rounded-[1.4rem] border p-5 sm:p-8">
          <div
            className="bg-primary relative grid aspect-square w-full place-items-center overflow-hidden rounded-t-[48%] rounded-b-lg"
            id="member-qr"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#f3cd7a,transparent_60%)]"
            />
            <Flower2
              aria-hidden="true"
              className="text-primary-foreground/[0.06] absolute size-[85%]"
              strokeWidth={0.7}
            />
            <img
              alt={`${t("memberQr")} ${card.memberCode}`}
              className="relative w-[72%] rounded-xl border border-[#060504]/15 bg-[#fffdf4] p-4 shadow-xl"
              src={qrUrl(card.memberCode)}
            />
          </div>

          <div className="px-1 pt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-fraunces text-foreground text-5xl leading-none font-semibold">
                  {card.name}
                </h1>
                <p className="text-primary mt-2 flex items-center gap-2 text-sm font-bold tracking-[0.18em] uppercase">
                  {isVip ? (
                    <Crown className="size-4" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {isVip ? t("vipCustomer") : t("regularCustomer")}
                </p>
              </div>
              <p className="text-primary/60 hidden font-mono text-[10px] sm:block">
                {card.memberCode}
              </p>
            </div>

            <CheckInButton isOwnCard={isOwnCard} />

            <footer className="border-primary/25 mt-8 flex items-end justify-between gap-4 border-t pt-5">
              <div>
                <p className="text-primary/65 text-[10px] font-bold tracking-[0.18em] uppercase">
                  {t("memberSince")}
                </p>
                <p className="font-fraunces text-foreground mt-1 text-lg font-semibold">
                  {new Date(card.createdAt).toLocaleDateString(i18n.language, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-primary/65 text-[10px] font-bold tracking-[0.18em] uppercase">
                  {t("visits")}
                </p>
                <p className="font-fraunces text-foreground mt-1 flex items-center gap-1.5 text-lg font-semibold">
                  {card.visits}
                  {card.visits > 0 ? (
                    <span aria-hidden="true" className="text-primary text-sm">
                      {"✿".repeat(Math.min(card.visits, 5))}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="text-primary flex items-center gap-2 text-right">
                <Flower2 className="size-8" strokeWidth={1.5} />
                <p className="font-fraunces text-sm leading-[0.85] font-semibold">
                  Blossom
                  <br />
                  Garden
                </p>
              </div>
            </footer>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              className="text-primary/65 text-xs underline-offset-4 hover:underline"
              to="/"
            >
              {t("backHome")}
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export const Route = createFileRoute("/m/$memberCode")({
  component: MemberCardPage,
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
