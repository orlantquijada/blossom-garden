import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'

function SignupPlaceholder() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center gap-6">
        <p className="font-medium text-muted-foreground text-sm">
          Customer signup
        </p>
        <h1 className="font-semibold text-4xl tracking-normal">
          Signup flow placeholder
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          The public member signup flow is intentionally parked until the admin
          proof of concept is useful.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin">
              <Settings />
              Open admin
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft />
              Public placeholder
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/signup')({
  component: SignupPlaceholder,
})
