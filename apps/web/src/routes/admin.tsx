import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from 'convex/react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

import { api } from '../../convex/_generated/api'

function SignIn() {
  const [error, setError] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const result = isSigningUp
      ? await authClient.signUp.email({ email, name: email, password })
      : await authClient.signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message ?? 'Sign-in failed.')
    }
  }

  return (
    <form className="grid w-full max-w-sm gap-4" onSubmit={handleSubmit}>
      <h1 className="font-semibold text-2xl">Admin sign-in</h1>
      <Input name="email" placeholder="Email" required type="email" />
      <Input minLength={8} name="password" placeholder="Password" required type="password" />
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit">{isSigningUp ? 'Create account' : 'Sign in'}</Button>
      <Button onClick={() => setIsSigningUp(!isSigningUp)} type="button" variant="link">
        {isSigningUp ? 'Use an existing account' : 'Create the first admin account'}
      </Button>
    </form>
  )
}

function AdminContent() {
  const isAdmin = useQuery(api.auth.isAdmin)

  if (isAdmin === undefined) {
    return <p>Checking access…</p>
  }

  if (!isAdmin) {
    return <p>Unauthorized</p>
  }

  return <Outlet />
}

function AdminRoute() {
  return (
    <>
      <AuthLoading>
        <main className="grid min-h-screen place-items-center p-6">Checking access…</main>
      </AuthLoading>
      <Unauthenticated>
        <main className="grid min-h-screen place-items-center p-6"><SignIn /></main>
      </Unauthenticated>
      <Authenticated><AdminContent /></Authenticated>
    </>
  )
}

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})
