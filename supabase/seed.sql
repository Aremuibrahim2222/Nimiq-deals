-- Nimiq Deals — demo data seed (SQL Editor version)
--
-- Pure SQL equivalent of scripts/seed.ts, for pasting straight into the
-- Supabase SQL Editor. Inserts the same 6 categories and 30 products
-- (27 original demo products + 3 low-cost ~10 NIM test products: Kitchen
-- Spoon, Phone Charger, Earphones).
--
-- Run this AFTER supabase/schema.sql has already been applied.
--
-- NOTE on images: image_url stores a `visual:<category>:<icon>` string,
-- not a photo URL. The app renders it locally as an original SVG icon
-- (src/components/ProductVisual.tsx) instead of hotlinking a photo, so
-- every product image is guaranteed to match the product and never 404s
-- on Vercel. See that file for the full reasoning.
--
-- Safe to re-run for categories (upserted by slug). Re-running this file
-- will insert the products again each time (the products table has no
-- unique constraint to conflict on) — if you want a clean reset first, run:
--   delete from public.products;
-- before re-running this file.

-- ---------------------------------------------------------------------------
-- Categories (safe to run more than once)
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, icon) values
  ('electronics', 'Electronics', '🎧'),
  ('fashion', 'Fashion', '👕'),
  ('gaming', 'Gaming', '🎮'),
  ('home', 'Home', '🏠'),
  ('accessories', 'Accessories', '⌚'),
  ('gifts', 'Gifts', '🎁')
on conflict (slug) do update
  set name = excluded.name,
      icon = excluded.icon;

-- ---------------------------------------------------------------------------
-- Products (30 demo products across the 6 categories above)
-- ---------------------------------------------------------------------------
insert into public.products (
  title,
  description,
  image_url,
  category_id,
  rating,
  rating_count,
  original_price_nim,
  deal_price_nim,
  cashback_percent,
  stock,
  is_featured,
  is_ending_soon,
  ends_at
)
select
  v.title,
  v.description,
  v.image_url,
  c.id as category_id,
  v.rating,
  v.rating_count,
  v.original_price_nim,
  v.deal_price_nim,
  v.cashback_percent,
  v.stock,
  v.is_featured,
  v.is_ending_soon,
  case when v.is_ending_soon then now() + interval '36 hours' else null end as ends_at
from (
  values
    -- Electronics
    ('Wireless ANC Headphones', 'Over-ear headphones with active noise cancellation and 30-hour battery life.', 'visual:electronics:headphones', 'electronics', 4.7, 812, 1800, 1180, 4, 42, true, false),
    ('Mechanical Keyboard 75%', 'Hot-swappable switches, PBT keycaps, USB-C, per-key RGB.', 'visual:electronics:keyboard', 'electronics', 4.6, 340, 950, 690, 5, 58, false, false),
    ('Portable SSD 1TB', 'USB-C 3.2 external drive, 1050MB/s read speed, pocket-sized aluminum shell.', 'visual:electronics:ssd', 'electronics', 4.8, 590, 1100, 860, 3, 75, false, false),
    ('Smart Fitness Band', 'Heart-rate, sleep tracking, 14-day battery, water resistant to 50m.', 'visual:electronics:fitness-band', 'electronics', 4.4, 221, 480, 299, 6, 120, false, true),
    ('4K Webcam', '4K/30fps webcam with auto-focus and a built-in privacy shutter.', 'visual:electronics:webcam', 'electronics', 4.3, 148, 620, 449, 4, 64, false, false),
    ('Fast Wireless Charger Stand', '15W wireless charging stand, works through most cases.', 'visual:electronics:charger', 'electronics', 4.5, 402, 260, 165, 5, 96, false, false),
    ('Phone Charger', '20W USB-C fast charger cable, 1m braided, durable everyday charging.', 'visual:electronics:phone-charger', 'electronics', 4.4, 76, 16, 10, 5, 250, false, false),
    ('Earphones', 'Wired in-ear earphones with in-line mic, lightweight and comfortable.', 'visual:electronics:earphones', 'electronics', 4.2, 61, 15, 9, 5, 260, false, false),

    -- Fashion
    ('Organic Cotton Hoodie', 'Heavyweight fleece hoodie in a relaxed fit, GOTS-certified cotton.', 'visual:fashion:hoodie', 'fashion', 4.6, 265, 620, 430, 5, 88, true, false),
    ('Everyday Sneakers', 'Lightweight knit sneakers with a cushioned sole for all-day wear.', 'visual:fashion:sneaker', 'fashion', 4.5, 512, 890, 599, 4, 70, false, false),
    ('Linen Overshirt', 'Breathable linen-blend overshirt, garment-dyed for a soft finish.', 'visual:fashion:shirt', 'fashion', 4.2, 96, 540, 385, 3, 54, false, true),
    ('Classic Denim Jacket', 'Mid-wash denim jacket with a tailored fit and brass buttons.', 'visual:fashion:jacket', 'fashion', 4.4, 178, 780, 560, 5, 40, false, false),
    ('Merino Wool Beanie', 'Soft merino wool beanie, one size, machine washable.', 'visual:fashion:beanie', 'fashion', 4.7, 233, 190, 129, 6, 150, false, false),

    -- Gaming
    ('Wireless Pro Controller', 'Low-latency wireless controller with remappable back paddles.', 'visual:gaming:controller', 'gaming', 4.6, 601, 560, 399, 5, 85, true, false),
    ('RGB Gaming Mouse', '19,000 DPI optical sensor, 6 programmable buttons, ultralight shell.', 'visual:gaming:mouse', 'gaming', 4.5, 389, 340, 229, 4, 110, false, false),
    ('Gaming Headset', '7.1 surround sound with a detachable noise-cancelling mic.', 'visual:gaming:headset', 'gaming', 4.4, 274, 480, 329, 5, 66, false, false),
    ('Adjustable Monitor Arm', 'Gas-spring monitor arm, fits 17"-34" displays, full range of motion.', 'visual:gaming:monitor-arm', 'gaming', 4.6, 145, 420, 289, 3, 47, false, true),
    ('Mini Retro Console', 'Plug-and-play console preloaded with classic-style games.', 'visual:gaming:console', 'gaming', 4.3, 198, 390, 265, 7, 90, false, false),

    -- Home
    ('Ceramic Pour-Over Set', 'Hand-glazed ceramic dripper with matching carafe, serves 2.', 'visual:home:pour-over', 'home', 4.7, 156, 340, 245, 4, 60, true, false),
    ('Aroma Diffuser', 'Ultrasonic essential-oil diffuser with 7-color ambient light.', 'visual:home:diffuser', 'home', 4.4, 210, 260, 179, 5, 100, false, false),
    ('Linen Throw Blanket', 'Stonewashed linen-cotton throw, 130x170cm, four colorways.', 'visual:home:blanket', 'home', 4.6, 132, 380, 269, 4, 72, false, false),
    ('Cast Iron Skillet 12"', 'Pre-seasoned cast iron skillet, oven-safe to 500°F.', 'visual:home:skillet', 'home', 4.8, 305, 320, 219, 3, 55, false, true),
    ('Smart LED Light Strip', '5m app-controlled RGB light strip with music sync.', 'visual:home:led-strip', 'home', 4.3, 267, 220, 149, 6, 130, false, false),
    ('Kitchen Spoon', 'Solid beechwood cooking spoon, heat-safe and gentle on non-stick pans.', 'visual:home:spoon', 'home', 4.6, 58, 16, 10, 5, 300, false, false),

    -- Accessories
    ('Minimalist Leather Wallet', 'Full-grain leather card wallet with a slim silhouette.', 'visual:accessories:wallet', 'accessories', 4.6, 221, 260, 179, 5, 95, true, false),
    ('Titanium Watch', 'Brushed titanium case, sapphire crystal, 100m water resistance.', 'visual:accessories:watch', 'accessories', 4.7, 88, 2400, 1690, 3, 20, false, false),
    ('Polarized Sunglasses', 'UV400 polarized lenses in an acetate frame.', 'visual:accessories:sunglasses', 'accessories', 4.4, 176, 340, 235, 5, 84, false, false),

    -- Gifts
    ('Scented Candle Trio', 'Set of three soy-wax candles: cedar, fig, and sea salt.', 'visual:gifts:candle', 'gifts', 4.8, 302, 210, 149, 6, 140, true, false),
    ('Board Game Night Bundle', 'Three party games in one box, 2-8 players, ages 12+.', 'visual:gifts:board-game', 'gifts', 4.6, 118, 480, 335, 4, 45, false, true),
    ('Engraved Journal Set', 'Refillable leather journal with a matching pen, gift-boxed.', 'visual:gifts:journal', 'gifts', 4.5, 94, 190, 129, 5, 68, false, false)
) as v (
  title,
  description,
  image_url,
  category_slug,
  rating,
  rating_count,
  original_price_nim,
  deal_price_nim,
  cashback_percent,
  stock,
  is_featured,
  is_ending_soon
)
join public.categories c on c.slug = v.category_slug;
