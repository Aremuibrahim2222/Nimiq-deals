import Link from 'next/link'
import type { Category } from '@/types'

export default function CategoryChip({
  category,
  active = false,
}: {
  category: Category
  active?: boolean
}) {
  return (
    <Link
      href={`/explore?category=${category.slug}`}
      className={`flex shrink-0 flex-col items-center gap-1.5 ${active ? '' : ''}`}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full text-xl ${
          active ? 'bg-gold-400 text-ink-950' : 'bg-white text-ink-950 ring-1 ring-ink-950/8'
        }`}
      >
        {category.icon}
      </span>
      <span className="text-[11px] font-medium text-ink-950/80">{category.name}</span>
    </Link>
  )
}
