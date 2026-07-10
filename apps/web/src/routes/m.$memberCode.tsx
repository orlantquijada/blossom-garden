import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'

import { qrUrl } from '@/lib/utils'

import { api } from '../../convex/_generated/api'

function MemberCardPage() {
  const { memberCode } = Route.useParams()
  const card = useQuery(api.members.getCard, { memberCode })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#060504] px-6 py-10 text-center text-[#ede5d4]">
      {card === undefined ? (
        <p className="text-[#ede5d4]/60">Loading your pass…</p>
      ) : null}

      {card === null ? (
        <>
          <h1 className="font-fraunces text-2xl">Pass not found</h1>
          <p className="mt-2 text-[#ede5d4]/70 text-sm">
            This member code doesn't exist. It may have been removed.
          </p>
          <Link
            className="mt-6 rounded-md bg-[#e6a42b] px-9 py-3 font-fraunces text-[#060504] tracking-wide hover:opacity-85"
            to="/signup"
          >
            Sign up again
          </Link>
        </>
      ) : null}

      {card ? (
        <>
          <p className="font-fraunces text-[#e6a42b] text-sm tracking-[0.45em]">
            BLOSSOM GARDEN
          </p>
          <h1 className="mt-3 font-fraunces text-3xl">{card.name}</h1>
          <p className="mt-1 text-[#e6a42b] text-sm tracking-[0.2em]">
            {card.status === 'vip' ? 'VIP MEMBER' : 'MEMBER'}
          </p>

          <img
            alt={`Member QR code ${card.memberCode}`}
            className="mt-8 size-56 rounded-lg border border-[#e6a42b]/40 bg-white p-4"
            src={qrUrl(card.memberCode, 224)}
          />
          <p className="mt-4 font-mono text-[#e6a42b] text-lg tracking-widest">
            {card.memberCode}
          </p>

          <p className="mt-6 max-w-sm text-[#ede5d4]/70 text-sm leading-relaxed">
            Screenshot or bookmark this page and show it at the counter. Staff
            scan or enter your code to log your visit.
          </p>
          <Link
            className="mt-8 text-[#e6a42b]/80 text-sm underline-offset-4 hover:underline"
            to="/"
          >
            Back to Blossom Garden
          </Link>
        </>
      ) : null}
    </main>
  )
}

export const Route = createFileRoute('/m/$memberCode')({
  component: MemberCardPage,
  head: () => ({ styles: [{ children: 'html { background: #060504 }' }] }),
})
