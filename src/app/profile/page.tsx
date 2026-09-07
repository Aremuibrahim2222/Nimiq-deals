import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/auth-actions'
import NimiqLogo from '@/components/NimiqLogo'
import { formatNim } from '@/components/PriceBlock'
import type { Profile } from '@/types'

export const revalidate = 0

export default async function ProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectedFrom=/profile')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const p = profile as Profile | null

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-6">
      <h1 className="font-display text-xl font-semibold text-ink-950">Profile</h1>

      <div className="flex items-center gap-3 rounded-card bg-white p-4 shadow-card ring-1 ring-ink-950/[0.04]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-lg font-semibold text-gold-600">
          {user.email?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="text-sm font-medium text-ink-950">{user.email}</p>
          <p className="text-xs text-ink-950/45">
            Member since{' '}
            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-ink-950/[0.04]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-950/60">Cashback balance</span>
          <span className="font-display font-semibold text-ink-950">
            {formatNim(Number(p?.cashback_balance_nim ?? 0))}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-card bg-white p-4 shadow-card ring-1 ring-ink-950/[0.04]">
        <NimiqLogo size={22} />
        <p className="text-xs text-ink-950/55">Payments run through the Nimiq Pay Mini Apps Framework.</p>
      </div>

      <form action={logoutAction}>
        <button className="w-full rounded-full bg-ink-950/[0.06] py-3.5 text-sm font-semibold text-ink-950">
          Log out
        </button>
      </form>
    </div>
  )
}
