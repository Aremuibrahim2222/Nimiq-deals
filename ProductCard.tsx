import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import PriceBlock from './PriceBlock'
import CashbackBadge from './CashbackBadge'
import RatingStars from './RatingStars'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-ink-950/[0.04] transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ink-950/[0.03]">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          sizes="(max-width: 480px) 50vw, 200px"
          className="object-cover"
        />
        {product.is_ending_soon && (
          <span className="absolute left-2 top-2 rounded-sq bg-ink-950/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Ending soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-ink-950">
          {product.title}
        </h3>
        <RatingStars rating={product.rating} count={product.rating_count} />
        <PriceBlock original={product.original_price_nim} deal={product.deal_price_nim} />
        <CashbackBadge percent={product.cashback_percent} />
      </div>
    </Link>
  )
}
