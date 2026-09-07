import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatNim } from '@/components/PriceBlock'
import EmptyState from '@/components/EmptyState'
import type { Order } from '@/types'

export const revalidate = 0

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-mint-50 text-mint-600',
  pending: 'bg-gold-50 text-gold-600',
  failed: 'bg-ink-950/[0.06] text-ink-950/60',
}

export default async function OrdersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectedFrom=/orders')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = (orders ?? []) as Order[]

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-6">
      <h1 className="font-display text-xl font-semibold text-ink-950">Orders</h1>

      {list.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your order history will show up here once you check out."
          action={
            <Link href="/explore" className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950">
              Explore deals
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((order) => (
            <li key={order.id} className="rounded-card bg-white p-4 shadow-card ring-1 ring-ink-950/[0.04]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-ink-950/45">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className={`rounded-sq px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <ul className="mb-2 flex flex-col gap-1">
                {order.items?.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-ink-950/75">
                    <span className="line-clamp-1 pr-2">
                      {item.product_title} × {item.quantity}
                    </span>
                    <span className="shrink-0">{formatNim(item.unit_price_nim * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-ink-950/8 pt-2 text-sm">
                <span className="font-medium text-ink-950">
                  Total · {formatNim(order.total_nim)} {order.currency}
                </span>
                {order.cashback_earned > 0 && (
                  <span className="text-xs font-medium text-mint-600">
                    +{formatNim(order.cashback_earned)} cashback
                  </span>
                )}
              </div>

              {order.tx_reference && (
                <p className="mt-2 truncate text-[11px] text-ink-950/40">Tx: {order.tx_reference}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
