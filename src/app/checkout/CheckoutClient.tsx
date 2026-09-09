'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatNim } from '@/components/PriceBlock'
import EmptyState from '@/components/EmptyState'
import Link from 'next/link'
import { initMiniApp, payOrderWithNim, NimiqMiniAppUnavailableError } from '@/lib/nimiq/miniAppSdk'
import type { Currency } from '@/types'

type PaymentState = 'idle' | 'awaiting-wallet' | 'success' | 'failed'

const MERCHANT_ADDRESS = process.env.NEXT_PUBLIC_MERCHANT_NIM_ADDRESS ?? ''

export default function CheckoutClient() {
  const { items, subtotalNim, clear } = useCart()
  const { show } = useToast()
  const router = useRouter()

  const [currency, setCurrency] = useState<Currency>('NIM')
  const [state, setState] = useState<PaymentState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Optimistic until init() actually resolves or fails — avoids flashing
  // the warning before we've had a chance to check.
  const [inNimiqPay, setInNimiqPay] = useState(true)

  useEffect(() => {
    let cancelled = false
    initMiniApp()
      .then(() => {
        if (!cancelled) setInNimiqPay(true)
      })
      .catch(() => {
        if (!cancelled) setInNimiqPay(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (items.length === 0 && state !== 'success') {
    return (
      <div className="px-4 pt-5">
        <h1 className="font-display text-xl font-semibold text-ink-950">Checkout</h1>
        <EmptyState
          title="Nothing to check out"
          description="Add a product to your cart first."
          action={
            <Link href="/explore" className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950">
              Explore deals
            </Link>
          }
        />
      </div>
    )
  }

  const cashbackEarned = items.reduce(
    (sum, i) => sum + (i.product.deal_price_nim * i.product.cashback_percent) / 100 * i.quantity,
    0
  )

  async function handlePay() {
    setErrorMessage(null)

    if (currency !== 'NIM') {
      setErrorMessage(
        'USDT checkout is not yet available. The Nimiq Pay Mini Apps provider only exposes NIM transaction methods today — see the README for details.'
      )
      return
    }

    if (!MERCHANT_ADDRESS) {
      setErrorMessage('Merchant address is not configured (NEXT_PUBLIC_MERCHANT_NIM_ADDRESS).')
      return
    }

    setState('awaiting-wallet')

    try {
      const orderReference = crypto.randomUUID()

      const { hash } = await payOrderWithNim({
        merchantAddress: MERCHANT_ADDRESS,
        amountNim: subtotalNim,
        orderReference,
      })

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference,
          currency,
          totalNim: subtotalNim,
          cashbackEarned,
          txHash: hash,
          status: 'confirmed',
          items: items.map((i) => ({
            productId: i.product.id,
            title: i.product.title,
            unitPriceNim: i.product.deal_price_nim,
            quantity: i.quantity,
          })),
        }),
      })

      if (!res.ok) throw new Error('Order could not be recorded after payment.')

      clear()
      setState('success')
      show('Payment confirmed', 'success')
    } catch (err) {
      if (err instanceof NimiqMiniAppUnavailableError) setInNimiqPay(false)

      const message =
        err instanceof Error ? err.message : 'Payment failed. Please try again.'

      setErrorMessage(message)
      setState('failed')

      // Record the failed attempt too, so it's visible in order history —
      // best-effort; ignore network errors here.
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: crypto.randomUUID(),
          currency,
          totalNim: subtotalNim,
          cashbackEarned: 0,
          txHash: null,
          status: 'failed',
          items: items.map((i) => ({
            productId: i.product.id,
            title: i.product.title,
            unitPriceNim: i.product.deal_price_nim,
            quantity: i.quantity,
          })),
        }),
      }).catch(() => {})
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 px-6 pt-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-50 text-mint-500">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-xl font-semibold text-ink-950">Payment confirmed</h1>
        <p className="text-sm text-ink-950/60">
          Your order is on its way. Cashback has been added to your Rewards balance.
        </p>
        <div className="mt-3 flex w-full gap-2.5">
          <Link href="/orders" className="flex-1 rounded-full bg-ink-950/[0.06] py-3 text-sm font-semibold text-ink-950">
            View Orders
          </Link>
          <Link href="/" className="flex-1 rounded-full bg-gold-400 py-3 text-sm font-semibold text-ink-950">
            Keep Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-8">
      <h1 className="font-display text-xl font-semibold text-ink-950">Checkout</h1>

      <section className="rounded-card bg-white p-4 shadow-card ring-1 ring-ink-950/[0.04]">
        <h2 className="mb-2 text-sm font-semibold text-ink-950">Order summary</h2>
        <ul className="flex flex-col gap-1.5">
          {items.map((i) => (
            <li key={i.product.id} className="flex justify-between text-sm text-ink-950/70">
              <span className="line-clamp-1 pr-2">
                {i.product.title} × {i.quantity}
              </span>
              <span className="shrink-0">{formatNim(i.product.deal_price_nim * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-ink-950/8 pt-3 text-sm font-semibold text-ink-950">
          <span>Total</span>
          <span className="font-display">{formatNim(subtotalNim)}</span>
        </div>
        <p className="mt-1 text-xs text-mint-600">
          You'll earn {cashbackEarned.toFixed(2)} NIM cashback on this order
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-950">Pay with</h2>
        <div className="flex gap-2.5">
          <button
            onClick={() => setCurrency('NIM')}
            className={`flex-1 rounded-card border py-3 text-sm font-semibold ${
              currency === 'NIM'
                ? 'border-gold-400 bg-gold-50 text-ink-950'
                : 'border-ink-950/10 bg-white text-ink-950/70'
            }`}
          >
            NIM
          </button>
          <button
            onClick={() => setCurrency('USDT')}
            className="flex-1 rounded-card border border-ink-950/10 bg-white py-3 text-sm font-semibold text-ink-950/40"
          >
            USDT
            <span className="ml-1.5 rounded-sq bg-ink-950/[0.06] px-1.5 py-0.5 text-[10px] font-semibold">
              Soon
            </span>
          </button>
        </div>
        {currency === 'USDT' && (
          <p className="mt-2 text-xs text-ink-950/50">
            The Nimiq Pay Mini Apps provider currently only exposes NIM payment methods, so USDT
            checkout isn't available inside this Mini App yet.
          </p>
        )}
      </section>

      {!inNimiqPay && (
        <p className="rounded-sq bg-gold-50 px-3 py-2.5 text-xs text-gold-600">
          Open this Mini App from inside Nimiq Pay to complete a real payment. Outside Nimiq Pay
          the wallet provider isn't available.
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="rounded-sq bg-ink-950/[0.06] px-3 py-2.5 text-xs text-ink-950">
          {errorMessage}
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={state === 'awaiting-wallet' || currency !== 'NIM'}
        className="w-full rounded-full bg-gold-400 py-3.5 text-sm font-semibold text-ink-950 disabled:opacity-50"
      >
        {state === 'awaiting-wallet' ? 'Confirm in Nimiq Pay…' : `Pay ${formatNim(subtotalNim)} with Nimiq Pay`}
      </button>
    </div>
  )
}
