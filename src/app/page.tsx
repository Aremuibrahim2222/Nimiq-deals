import Link from 'next/link'
import NimiqLogo from '@/components/NimiqLogo'
import { signUpAction } from '@/app/auth-actions'

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; redirectedFrom?: string }
}) {
  return (
    <div className="flex min-h-dvh flex-col justify-center gap-6 px-6 py-10">
      <div className="flex flex-col items-center gap-2">
        <NimiqLogo size={44} />
        <h1 className="font-display text-xl font-semibold text-ink-950">Create your account</h1>
        <p className="text-sm text-ink-950/55">Join Nimiq Deals in seconds</p>
      </div>

      <form action={signUpAction} className="flex flex-col gap-3">
        <input type="hidden" name="redirectedFrom" value={searchParams.redirectedFrom ?? '/'} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-950">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-sq border border-ink-950/10 bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-gold-400"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-950">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="rounded-sq border border-ink-950/10 bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-gold-400"
          />
        </label>

        {searchParams.error && (
          <p role="alert" className="rounded-sq bg-ink-950/[0.06] px-3 py-2.5 text-xs text-ink-950">
            {searchParams.error}
          </p>
        )}

        <button className="mt-2 rounded-full bg-gold-400 py-3.5 text-sm font-semibold text-ink-950">
          Sign up
        </button>
      </form>

      <p className="text-center text-sm text-ink-950/60">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-gold-600">
          Log in
        </Link>
      </p>
    </div>
  )
}
