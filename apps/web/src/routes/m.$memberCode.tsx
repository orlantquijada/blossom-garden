import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import { qrUrl } from "@/lib/utils";

import { api } from "../../convex/_generated/api";

function MemberCardPage() {
  const { memberCode } = Route.useParams();
  const card = useQuery(api.members.getCard, { memberCode });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#060504] px-6 py-10 text-center text-[#ede5d4]">
      {card === undefined ? (
        <p className="text-[#ede5d4]/60">Loading your pass…</p>
      ) : null}

      {card === null ? (
        <>
          <h1 className="font-fraunces text-2xl">Pass not found</h1>
          <p className="mt-2 text-sm text-[#ede5d4]/70">
            This member code doesn&apos;t exist. It may have been removed.
          </p>
          <Link
            className="font-fraunces mt-6 rounded-md bg-[#e6a42b] px-9 py-3 tracking-wide text-[#060504] hover:opacity-85"
            to="/signup"
          >
            Sign up again
          </Link>
        </>
      ) : null}

      {card ? (
        <>
          <p className="font-fraunces text-sm tracking-[0.45em] text-[#e6a42b]">
            BLOSSOM GARDEN
          </p>
          <h1 className="font-fraunces mt-3 text-3xl">{card.name}</h1>
          <p className="mt-1 text-sm tracking-[0.2em] text-[#e6a42b]">
            {card.status === "vip" ? "VIP MEMBER" : "MEMBER"}
          </p>

          <img
            alt={`Member QR code ${card.memberCode}`}
            className="mt-8 size-56 rounded-lg border border-[#e6a42b]/40 bg-white p-4"
            src={qrUrl(card.memberCode, 224)}
          />
          <p className="mt-4 font-mono text-lg tracking-widest text-[#e6a42b]">
            {card.memberCode}
          </p>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#ede5d4]/70">
            Screenshot or bookmark this page and show it at the counter. Staff
            scan or enter your code to log your visit.
          </p>
          <Link
            className="mt-8 text-sm text-[#e6a42b]/80 underline-offset-4 hover:underline"
            to="/"
          >
            Back to Blossom Garden
          </Link>
        </>
      ) : null}
    </main>
  );
}

export const Route = createFileRoute("/m/$memberCode")({
  component: MemberCardPage,
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
