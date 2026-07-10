import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { api } from '../../convex/_generated/api'

const inputClass =
  'rounded-md border border-[#e6a42b]/40 bg-transparent px-4 py-3 text-[#ede5d4] text-base outline-none placeholder:text-[#ede5d4]/35 focus:border-[#e6a42b]'

function SignupPage() {
  const signUp = useMutation(api.members.signUp)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const form = new FormData(event.currentTarget)

    try {
      const { memberCode } = await signUp({
        email: String(form.get('email') ?? '').trim(),
        name: String(form.get('name') ?? '').trim(),
        phone: String(form.get('phone') ?? '').trim() || undefined,
      })
      await navigate({ params: { memberCode }, to: '/m/$memberCode' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Signup failed.')
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#060504] px-6 py-10 text-[#ede5d4]">
      <div className="w-full max-w-md">
        <p className="font-fraunces text-[#e6a42b] text-sm tracking-[0.45em]">
          BLOSSOM GARDEN
        </p>
        <h1 className="mt-3 font-fraunces text-3xl text-[#ede5d4]">
          Join the membership
        </h1>
        <p className="mt-2 text-[#ede5d4]/70 text-sm leading-relaxed">
          Sign up once and receive your personal member QR. Show it at the
          counter to log your visits and unlock VIP status.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5">
            <span className="text-[#e6a42b] text-sm tracking-wide">Name</span>
            <input className={inputClass} name="name" required />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[#e6a42b] text-sm tracking-wide">Email</span>
            <input className={inputClass} name="email" required type="email" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[#e6a42b] text-sm tracking-wide">
              Phone (optional)
            </span>
            <input className={inputClass} name="phone" type="tel" />
          </label>
          {error ? <p className="text-red-400 text-sm">{error}</p> : null}
          <button
            className="mt-2 rounded-md bg-[#e6a42b] px-9 py-3 font-fraunces text-[#060504] text-base tracking-wide transition-opacity hover:opacity-85 disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Creating your pass…' : 'Get my member QR'}
          </button>
        </form>

        <p className="mt-6 text-[#ede5d4]/50 text-sm">
          Already a member? Sign up with the same email to see your pass again.
        </p>
        <Link
          className="mt-4 inline-block text-[#e6a42b]/80 text-sm underline-offset-4 hover:underline"
          to="/"
        >
          Back to Blossom Garden
        </Link>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/signup')({
  component: SignupPage,
  head: () => ({ styles: [{ children: 'html { background: #060504 }' }] }),
})
