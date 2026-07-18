import { Link, createFileRoute } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

function Home() {
  return (
    <main className="garden bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <img
        alt="Blossom Garden"
        className="w-full max-w-sm"
        height="220"
        src="/blossom-garden-logo.svg"
        width="420"
      />

      <p className="font-fraunces text-primary -mt-3 text-sm tracking-[0.45em]">
        CAFE &amp; BAR
      </p>

      <p className="text-primary/80 mt-5 text-sm tracking-[0.15em]">
        ブロッサムガーデン &middot; カフェ &amp; バー
      </p>

      <p className="text-foreground/75 mt-7 max-w-md text-base leading-relaxed">
        Scan a QR to join, receive your personal member code, and let our staff
        recognize your VIP status and visit history the moment you walk in.
      </p>

      <div className="mt-11">
        <Link
          className="font-fraunces bg-primary text-primary-foreground rounded-md px-9 py-3 text-base tracking-wide transition-opacity hover:opacity-85"
          to="/signup"
        >
          Join the Membership
        </Link>
        <Authenticated>
          <ProfileLink />
        </Authenticated>
      </div>
    </main>
  );
}

function ProfileLink() {
  const card = useQuery(api.members.getMyCard);

  return card ? (
    <Link
      className="font-fraunces border-primary text-primary ml-3 rounded-md border px-9 py-3 text-base tracking-wide transition-opacity hover:opacity-85"
      params={{ memberCode: card.memberCode }}
      to="/m/$memberCode"
    >
      Profile
    </Link>
  ) : null;
}

export const Route = createFileRoute("/")({
  component: Home,
  // html/body stay themed for admin; overscroll behind landing must match its black
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
