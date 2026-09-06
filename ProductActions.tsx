'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/types'

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { show } = useToast()
  const router = useRouter()
  const outOfStock = product.stock <= 0

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-30 mx-auto flex max-w-md gap-2.5 border-t border-ink-950/8 bg-white/95 px-4 py-3 backdrop-blur">
      <button
        disabled={outOfStock}
        onClick={() => {
          addItem(product)
          show('Added to cart', 'success')
        }}
        className="flex-1 rounded-full bg-ink-950/[0.06] py-3 text-sm font-semibold text-ink-950 disabled:opacity-40"
      >
        Add to Cart
      </button>
      <button
        disabled={outOfStock}
        onClick={() => {
          addItem(product)
          router.push('/checkout')
        }}
        className="flex-1 rounded-full bg-gold-400 py-3 text-sm font-semibold text-ink-950 disabled:opacity-40"
      >
        {outOfStock ? 'Out of stock' : 'Buy Now'}
      </button>
    </div>
  )
}
