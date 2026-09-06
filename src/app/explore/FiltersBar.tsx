'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types'

const SORTS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'cashback', label: 'Best cashback' },
  { value: 'ending', label: 'Ending soon' },
]

const CASHBACK_OPTIONS = [
  { value: '', label: 'Any cashback' },
  { value: '3', label: '3%+' },
  { value: '5', label: '5%+' },
  { value: '6', label: '6%+' },
]

const DISCOUNT_OPTIONS = [
  { value: '', label: 'Any discount' },
  { value: '20', label: '20%+' },
  { value: '30', label: '30%+' },
  { value: '40', label: '40%+' },
]

export default function FiltersBar({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/explore?${params.toString()}`)
  }

  const select =
    'shrink-0 rounded-full bg-white px-3 py-2 text-xs font-medium text-ink-950 shadow-card ring-1 ring-ink-950/[0.06] focus:outline-none focus:ring-2 focus:ring-gold-400'

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <select
        className={select}
        value={searchParams.get('category') ?? ''}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className={select}
        value={searchParams.get('sort') ?? ''}
        onChange={(e) => update('sort', e.target.value)}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className={select}
        value={searchParams.get('minDiscount') ?? ''}
        onChange={(e) => update('minDiscount', e.target.value)}
      >
        {DISCOUNT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        className={select}
        value={searchParams.get('minCashback') ?? ''}
        onChange={(e) => update('minCashback', e.target.value)}
      >
        {CASHBACK_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
