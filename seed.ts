/**
 * Seeds Supabase with demo categories and products.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npm run seed
 *
 * Never ship the service role key to the client — this script only ever
 * runs locally / in CI.
 *
 * NOTE on images: `image_url` stores a `visual:<category>:<icon>` string,
 * not a photo URL. It's rendered locally by src/components/ProductVisual.tsx
 * as an original SVG icon instead of a hotlinked photo — see that file for
 * why (accuracy, licensing, and reliability on Vercel).
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

const categories = [
  { slug: 'electronics', name: 'Electronics', icon: '🎧' },
  { slug: 'fashion', name: 'Fashion', icon: '👕' },
  { slug: 'gaming', name: 'Gaming', icon: '🎮' },
  { slug: 'home', name: 'Home', icon: '🏠' },
  { slug: 'accessories', name: 'Accessories', icon: '⌚' },
  { slug: 'gifts', name: 'Gifts', icon: '🎁' },
]

function visual(category: string, icon: string) {
  return `visual:${category}:${icon}`
}

const products: Array<{
  title: string
  description: string
  category: string
  image: string
  original: number
  deal: number
  cashback: number
  rating: number
  ratingCount: number
  stock: number
  featured?: boolean
  endingSoon?: boolean
}> = [
  { title: 'Wireless ANC Headphones', description: 'Over-ear headphones with active noise cancellation and 30-hour battery life.', category: 'electronics', image: visual('electronics', 'headphones'), original: 1800, deal: 1180, cashback: 4, rating: 4.7, ratingCount: 812, stock: 42, featured: true },
  { title: 'Mechanical Keyboard 75%', description: 'Hot-swappable switches, PBT keycaps, USB-C, per-key RGB.', category: 'electronics', image: visual('electronics', 'keyboard'), original: 950, deal: 690, cashback: 5, rating: 4.6, ratingCount: 340, stock: 58 },
  { title: 'Portable SSD 1TB', description: 'USB-C 3.2 external drive, 1050MB/s read speed, pocket-sized aluminum shell.', category: 'electronics', image: visual('electronics', 'ssd'), original: 1100, deal: 860, cashback: 3, rating: 4.8, ratingCount: 590, stock: 75 },
  { title: 'Smart Fitness Band', description: 'Heart-rate, sleep tracking, 14-day battery, water resistant to 50m.', category: 'electronics', image: visual('electronics', 'fitness-band'), original: 480, deal: 299, cashback: 6, rating: 4.4, ratingCount: 221, stock: 120, endingSoon: true },
  { title: '4K Webcam', description: '4K/30fps webcam with auto-focus and a built-in privacy shutter.', category: 'electronics', image: visual('electronics', 'webcam'), original: 620, deal: 449, cashback: 4, rating: 4.3, ratingCount: 148, stock: 64 },
  { title: 'Fast Wireless Charger Stand', description: '15W wireless charging stand, works through most cases.', category: 'electronics', image: visual('electronics', 'charger'), original: 260, deal: 165, cashback: 5, rating: 4.5, ratingCount: 402, stock: 96 },

  { title: 'Organic Cotton Hoodie', description: 'Heavyweight fleece hoodie in a relaxed fit, GOTS-certified cotton.', category: 'fashion', image: visual('fashion', 'hoodie'), original: 620, deal: 430, cashback: 5, rating: 4.6, ratingCount: 265, stock: 88, featured: true },
  { title: 'Everyday Sneakers', description: 'Lightweight knit sneakers with a cushioned sole for all-day wear.', category: 'fashion', image: visual('fashion', 'sneaker'), original: 890, deal: 599, cashback: 4, rating: 4.5, ratingCount: 512, stock: 70 },
  { title: 'Linen Overshirt', description: 'Breathable linen-blend overshirt, garment-dyed for a soft finish.', category: 'fashion', image: visual('fashion', 'shirt'), original: 540, deal: 385, cashback: 3, rating: 4.2, ratingCount: 96, stock: 54, endingSoon: true },
  { title: 'Classic Denim Jacket', description: 'Mid-wash denim jacket with a tailored fit and brass buttons.', category: 'fashion', image: visual('fashion', 'jacket'), original: 780, deal: 560, cashback: 5, rating: 4.4, ratingCount: 178, stock: 40 },
  { title: 'Merino Wool Beanie', description: 'Soft merino wool beanie, one size, machine washable.', category: 'fashion', image: visual('fashion', 'beanie'), original: 190, deal: 129, cashback: 6, rating: 4.7, ratingCount: 233, stock: 150 },

  { title: 'Wireless Pro Controller', description: 'Low-latency wireless controller with remappable back paddles.', category: 'gaming', image: visual('gaming', 'controller'), original: 560, deal: 399, cashback: 5, rating: 4.6, ratingCount: 601, stock: 85, featured: true },
  { title: 'RGB Gaming Mouse', description: '19,000 DPI optical sensor, 6 programmable buttons, ultralight shell.', category: 'gaming', image: visual('gaming', 'mouse'), original: 340, deal: 229, cashback: 4, rating: 4.5, ratingCount: 389, stock: 110 },
  { title: 'Gaming Headset', description: '7.1 surround sound with a detachable noise-cancelling mic.', category: 'gaming', image: visual('gaming', 'headset'), original: 480, deal: 329, cashback: 5, rating: 4.4, ratingCount: 274, stock: 66 },
  { title: 'Adjustable Monitor Arm', description: 'Gas-spring monitor arm, fits 17"–34" displays, full range of motion.', category: 'gaming', image: visual('gaming', 'monitor-arm'), original: 420, deal: 289, cashback: 3, rating: 4.6, ratingCount: 145, stock: 47, endingSoon: true },
  { title: 'Mini Retro Console', description: 'Plug-and-play console preloaded with classic-style games.', category: 'gaming', image: visual('gaming', 'console'), original: 390, deal: 265, cashback: 7, rating: 4.3, ratingCount: 198, stock: 90 },

  { title: 'Ceramic Pour-Over Set', description: 'Hand-glazed ceramic dripper with matching carafe, serves 2.', category: 'home', image: visual('home', 'pour-over'), original: 340, deal: 245, cashback: 4, rating: 4.7, ratingCount: 156, stock: 60, featured: true },
  { title: 'Aroma Diffuser', description: 'Ultrasonic essential-oil diffuser with 7-color ambient light.', category: 'home', image: visual('home', 'diffuser'), original: 260, deal: 179, cashback: 5, rating: 4.4, ratingCount: 210, stock: 100 },
  { title: 'Linen Throw Blanket', description: 'Stonewashed linen-cotton throw, 130x170cm, four colorways.', category: 'home', image: visual('home', 'blanket'), original: 380, deal: 269, cashback: 4, rating: 4.6, ratingCount: 132, stock: 72 },
  { title: 'Cast Iron Skillet 12"', description: 'Pre-seasoned cast iron skillet, oven-safe to 500°F.', category: 'home', image: visual('home', 'skillet'), original: 320, deal: 219, cashback: 3, rating: 4.8, ratingCount: 305, stock: 55, endingSoon: true },
  { title: 'Smart LED Light Strip', description: '5m app-controlled RGB light strip with music sync.', category: 'home', image: visual('home', 'led-strip'), original: 220, deal: 149, cashback: 6, rating: 4.3, ratingCount: 267, stock: 130 },
  { title: 'Kitchen Spoon', description: 'Solid beechwood cooking spoon, heat-safe and gentle on non-stick pans.', category: 'home', image: visual('home', 'spoon'), original: 16, deal: 10, cashback: 5, rating: 4.6, ratingCount: 58, stock: 300 },

  { title: 'Minimalist Leather Wallet', description: 'Full-grain leather card wallet with a slim silhouette.', category: 'accessories', image: visual('accessories', 'wallet'), original: 260, deal: 179, cashback: 5, rating: 4.6, ratingCount: 221, stock: 95, featured: true },
  { title: 'Titanium Watch', description: 'Brushed titanium case, sapphire crystal, 100m water resistance.', category: 'accessories', image: visual('accessories', 'watch'), original: 2400, deal: 1690, cashback: 3, rating: 4.7, ratingCount: 88, stock: 20 },
  { title: 'Polarized Sunglasses', description: 'UV400 polarized lenses in an acetate frame.', category: 'accessories', image: visual('accessories', 'sunglasses'), original: 340, deal: 235, cashback: 5, rating: 4.4, ratingCount: 176, stock: 84 },

  { title: 'Scented Candle Trio', description: 'Set of three soy-wax candles: cedar, fig, and sea salt.', category: 'gifts', image: visual('gifts', 'candle'), original: 210, deal: 149, cashback: 6, rating: 4.8, ratingCount: 302, stock: 140, featured: true },
  { title: 'Board Game Night Bundle', description: 'Three party games in one box, 2–8 players, ages 12+.', category: 'gifts', image: visual('gifts', 'board-game'), original: 480, deal: 335, cashback: 4, rating: 4.6, ratingCount: 118, stock: 45, endingSoon: true },
  { title: 'Engraved Journal Set', description: 'Refillable leather journal with a matching pen, gift-boxed.', category: 'gifts', image: visual('gifts', 'journal'), original: 190, deal: 129, cashback: 5, rating: 4.5, ratingCount: 94, stock: 68 },

  // Low-cost test products (~10 NIM) — small enough for quick real-payment testing.
  { title: 'Phone Charger', description: '20W USB-C fast charger cable, 1m braided, durable everyday charging.', category: 'electronics', image: visual('electronics', 'phone-charger'), original: 16, deal: 10, cashback: 5, rating: 4.4, ratingCount: 76, stock: 250 },
  { title: 'Earphones', description: 'Wired in-ear earphones with in-line mic, lightweight and comfortable.', category: 'electronics', image: visual('electronics', 'earphones'), original: 15, deal: 9, cashback: 5, rating: 4.2, ratingCount: 61, stock: 260 },
]

async function main() {
  console.log('Seeding categories…')
  const { data: catRows, error: catErr } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()
  if (catErr) throw catErr

  const catBySlug = Object.fromEntries((catRows ?? []).map((c) => [c.slug, c.id]))

  console.log('Seeding products…')
  const rows = products.map((p) => ({
    title: p.title,
    description: p.description,
    image_url: p.image,
    category_id: catBySlug[p.category],
    rating: p.rating,
    rating_count: p.ratingCount,
    original_price_nim: p.original,
    deal_price_nim: p.deal,
    cashback_percent: p.cashback,
    stock: p.stock,
    is_featured: !!p.featured,
    is_ending_soon: !!p.endingSoon,
    ends_at: p.endingSoon ? new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString() : null,
  }))

  const { error: prodErr } = await supabase.from('products').insert(rows)
  if (prodErr) throw prodErr

  console.log(`Seeded ${categories.length} categories and ${rows.length} products.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
