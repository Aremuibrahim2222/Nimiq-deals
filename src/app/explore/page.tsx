import { createClient } from '@/lib/supabase/server'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import FiltersBar from './FiltersBar'
import type { Category, Product } from '@/types'

export const revalidate = 0

interface Props {
  searchParams: {
    q?: string
    category?: string
    sort?: string
    minCashback?: string
    minDiscount?: string
  }
}

export default async function ExplorePage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  let query = supabase.from('products').select('*, category:categories(*)')

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }
  if (searchParams.category) {
    const cat = (categories ?? []).find((c) => c.slug === searchParams.category)
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (searchParams.minCashback) {
    query = query.gte('cashback_percent', Number(searchParams.minCashback))
  }

  switch (searchParams.sort) {
    case 'ending':
      query = query.eq('is_ending_soon', true)
      break
    case 'cashback':
      query = query.order('cashback_percent', { ascending: false })
      break
    case 'price_asc':
      query = query.order('deal_price_nim', { ascending: true })
      break
    case 'price_desc':
      query = query.order('deal_price_nim', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query.limit(60)

  let results = (products ?? []) as Product[]
  if (searchParams.minDiscount) {
    const min = Number(searchParams.minDiscount)
    results = results.filter(
      (p) =>
        p.original_price_nim > 0 &&
        Math.round(((p.original_price_nim - p.deal_price_nim) / p.original_price_nim) * 100) >= min
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-5">
      <h1 className="font-display text-xl font-semibold text-ink-950">Explore</h1>
      <SearchBar />
      <FiltersBar categories={(categories ?? []) as Category[]} />

      {results.length === 0 ? (
        <EmptyState
          title="No deals match those filters"
          description="Try clearing a filter or searching a different term."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
