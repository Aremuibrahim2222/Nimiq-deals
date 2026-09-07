import { createClient } from '@/lib/supabase/server'
import NimiqLogo from '@/components/NimiqLogo'
import SearchBar from '@/components/SearchBar'
import CategoryChip from '@/components/CategoryChip'
import SectionHeader from '@/components/SectionHeader'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import type { Category, Product } from '@/types'

export const revalidate = 0

async function getData() {
  const supabase = createClient()

  const [{ data: categories }, { data: featured }, { data: latest }, { data: endingSoon }, { data: bestCashback }] =
    await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*').eq('is_featured', true).limit(8),
      supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8),
      supabase.from('products').select('*').eq('is_ending_soon', true).limit(8),
      supabase.from('products').select('*').order('cashback_percent', { ascending: false }).limit(8),
    ])

  return {
    categories: (categories ?? []) as Category[],
    featured: (featured ?? []) as Product[],
    latest: (latest ?? []) as Product[],
    endingSoon: (endingSoon ?? []) as Product[],
    bestCashback: (bestCashback ?? []) as Product[],
  }
}

export default async function HomePage() {
  const { categories, featured, latest, endingSoon, bestCashback } = await getData()
  const hasAnyProducts = [featured, latest, endingSoon, bestCashback].some((l) => l.length > 0)

  return (
    <div className="flex flex-col gap-6 px-4 pt-5">
      <header className="flex items-center gap-2.5">
        <NimiqLogo size={30} />
        <span className="font-display text-lg font-semibold text-ink-950">Nimiq Deals</span>
      </header>

      <SearchBar />

      {!hasAnyProducts && (
        <EmptyState
          title="No deals yet"
          description="Seed the database with demo products to see the marketplace in action — see supabase/schema.sql and scripts/seed.ts."
        />
      )}

      {categories.length > 0 && (
        <section>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1">
            {categories.map((c) => (
              <CategoryChip key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section>
          <SectionHeader title="Featured Deals" href="/explore" />
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {featured.map((p) => (
              <div key={p.id} className="w-40 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section>
          <SectionHeader title="Today's Deals" href="/explore" />
          <div className="grid grid-cols-2 gap-3">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {endingSoon.length > 0 && (
        <section>
          <SectionHeader title="Ending Soon" href="/explore?sort=ending" />
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {endingSoon.map((p) => (
              <div key={p.id} className="w-40 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {bestCashback.length > 0 && (
        <section className="pb-4">
          <SectionHeader title="Best Cashback" href="/explore?sort=cashback" />
          <div className="grid grid-cols-2 gap-3">
            {bestCashback.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
