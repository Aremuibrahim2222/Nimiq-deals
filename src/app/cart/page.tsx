'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { formatNim } from '@/components/PriceBlock'
import EmptyState from '@/components/EmptyState'
import ProductVisual, { parseVisualUrl } from '@/components/ProductVisual'

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalNim } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="px-4 pt-5">
        <h1 className="font-display text-xl font-semibold text-ink-950">Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Browse today's deals and add something you like."
          action={
            <Link href="/explore" className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950">
              Explore deals
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-32">
      <h1 className="font-display text-xl font-semibold text-ink-950">Cart</h1>

      <ul className="flex flex-col gap-3">
        {items.map(({ product, quantity }) => {
          const visual = parseVisualUrl(product.image_url)
          return (
            <li key={product.id} className="flex gap-3 rounded-card bg-white p-2.5 shadow-card ring-1 ring-ink-950/[0.04]">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sq bg-ink-950/[0.03]">
                {visual ? (
                  <ProductVisual icon={visual.icon} category={visual.category} />
                ) : (
                  <Image src={product.image_url} alt={product.title} fill sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 text-sm font-medium text-ink-950">{product.title}</h3>
                  <p className="font-display text-sm font-semibold text-ink-950">
                    {formatNim(product.deal_price_nim)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-ink-950/[0.05] px-1">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="h-7 w-7 rounded-full text-base font-semibold text-ink-950"
                    >
                      –
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="h-7 w-7 rounded-full text-base font-semibold text-ink-950"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs font-medium text-ink-950/45 underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="fixed inset-x-0 bottom-[76px] z-30 mx-auto max-w-md border-t border-ink-950/8 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink-950/60">Total</span>
          <span className="font-display text-base font-semibold text-ink-950">{formatNim(subtotalNim)}</span>
        </div>
        <button
          onClick={() => router.push('/checkout')}
          className="w-full rounded-full bg-gold-400 py-3 text-sm font-semibold text-ink-950"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
