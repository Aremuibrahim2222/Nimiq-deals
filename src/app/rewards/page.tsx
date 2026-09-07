import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatNim } from '@/components/PriceBlock'
import EmptyState from '@/components/EmptyState'
import type { Profile, RewardEntry } from '@/types'

export const revalidate = 0

export default async function RewardsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectedFrom=/rewards')

  const [{ data: profile }, { data: rewards }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const p = profile as Profile | null
  const entries = (rewards ?? []) as RewardEntry[]
  const totalEarned = entries.reduce((sum, r) => sum + Number(r.amount_nim), 0)

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-6">
      <h1 className="font-display text-xl font-semibold text-ink-950">Rewards</h1>

      <div className="rounded-card bg-ink-950 p-5 text-white shadow-card">
        <p className="text-xs uppercase tracking-wide text-white/60">Cashback balance</p>
        <p className="font-display text-3xl font-semibold text-gold-300">
          {formatNim(Number(p?.cashback_balance_nim ?? 0))}
        </p>
        <p className="mt-2 text-xs text-white/50">
          {formatNim(totalEarned)} earned in total across {entries.length} order
          {entries.length === 1 ? '' : 's'}
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-950">History</h2>
        {entries.length === 0 ? (
          <EmptyState title="No cashback yet" description="Cashback appears here after your first confirmed order." />
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-card bg-white p-3.5 shadow-card ring-1 ring-ink-950/[0.04]"
              >
                <div>
                  <p className="text-sm font-medium text-ink-950">Cashback earned</p>
                  <p className="text-xs text-ink-950/45">
                    {new Date(r.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="font-display text-sm font-semibold text-mint-600">
                  +{formatNim(Number(r.amount_nim))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
