import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RatingStars from '@/components/RatingStars'
import PriceBlock from '@/components/PriceBlock'
import CashbackBadge from '@/components/CashbackBadge'
import type { Product } from '@/types'
import ProductActions from './ProductActions'

export const revalidate = 0

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!product) notFound()
  const p = product as Product

  return (
    <div className="flex flex-col pb-28">
      <div className="relative aspect-square w-full bg-ink-950/[0.03]">
        <Image src={p.image_url} alt={p.title} fill sizes="480px" className="object-cover" priority />
        {p.is_ending_soon && (
          <span className="absolute left-4 top-4 rounded-sq bg-ink-950/85 px-2 py-1 text-xs font-semibold text-white">
            Ending soon
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4">
        <h1 className="font-display text-xl font-semibold leading-snug text-ink-950">{p.title}</h1>
        <RatingStars rating={p.rating} count={p.rating_count} size="md" />
        <div className="flex items-center gap-2">
          <PriceBlock original={p.original_price_nim} deal={p.deal_price_nim} size="lg" />
          <CashbackBadge percent={p.cashback_percent} />
        </div>

        <p className="text-sm leading-relaxed text-ink-950/70">{p.description}</p>

        <p className="text-xs text-ink-950/50">
          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
        </p>
      </div>

      <ProductActions product={p} />
    </div>
  )
}
