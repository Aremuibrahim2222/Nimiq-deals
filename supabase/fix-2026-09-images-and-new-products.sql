-- Nimiq Deals — fix images on the LIVE database + add low-cost test products
--
-- Your database already has the 27 demo products inserted from before, so
-- editing scripts/seed.ts or supabase/seed.sql alone won't change anything
-- that's already live — those files only affect *future* seeds. Run this
-- file once in the Supabase SQL Editor to fix what's already there.
--
-- What it does:
--   1. Updates image_url on each of the 27 existing products (matched by
--      title) from the old picsum.photos URLs to the new local
--      `visual:<category>:<icon>` values rendered by ProductVisual.tsx.
--   2. Inserts the 3 new ~10 NIM test products (Kitchen Spoon, Phone
--      Charger, Earphones) — guarded with NOT EXISTS so it's safe to run
--      this file more than once without creating duplicates.
--
-- Run this AFTER supabase/schema.sql has already been applied (it already
-- has been, since your app is live).

-- ---------------------------------------------------------------------------
-- 1. Fix image_url on existing products
-- ---------------------------------------------------------------------------
update public.products set image_url = 'visual:electronics:headphones'   where title = 'Wireless ANC Headphones';
update public.products set image_url = 'visual:electronics:keyboard'     where title = 'Mechanical Keyboard 75%';
update public.products set image_url = 'visual:electronics:ssd'          where title = 'Portable SSD 1TB';
update public.products set image_url = 'visual:electronics:fitness-band' where title = 'Smart Fitness Band';
update public.products set image_url = 'visual:electronics:webcam'       where title = '4K Webcam';
update public.products set image_url = 'visual:electronics:charger'      where title = 'Fast Wireless Charger Stand';

update public.products set image_url = 'visual:fashion:hoodie'   where title = 'Organic Cotton Hoodie';
update public.products set image_url = 'visual:fashion:sneaker'  where title = 'Everyday Sneakers';
update public.products set image_url = 'visual:fashion:shirt'    where title = 'Linen Overshirt';
update public.products set image_url = 'visual:fashion:jacket'   where title = 'Classic Denim Jacket';
update public.products set image_url = 'visual:fashion:beanie'   where title = 'Merino Wool Beanie';

update public.products set image_url = 'visual:gaming:controller'  where title = 'Wireless Pro Controller';
update public.products set image_url = 'visual:gaming:mouse'       where title = 'RGB Gaming Mouse';
update public.products set image_url = 'visual:gaming:headset'     where title = 'Gaming Headset';
update public.products set image_url = 'visual:gaming:monitor-arm' where title = 'Adjustable Monitor Arm';
update public.products set image_url = 'visual:gaming:console'     where title = 'Mini Retro Console';

update public.products set image_url = 'visual:home:pour-over' where title = 'Ceramic Pour-Over Set';
update public.products set image_url = 'visual:home:diffuser'  where title = 'Aroma Diffuser';
update public.products set image_url = 'visual:home:blanket'   where title = 'Linen Throw Blanket';
update public.products set image_url = 'visual:home:skillet'   where title = 'Cast Iron Skillet 12"';
update public.products set image_url = 'visual:home:led-strip' where title = 'Smart LED Light Strip';

update public.products set image_url = 'visual:accessories:wallet'     where title = 'Minimalist Leather Wallet';
update public.products set image_url = 'visual:accessories:watch'      where title = 'Titanium Watch';
update public.products set image_url = 'visual:accessories:sunglasses' where title = 'Polarized Sunglasses';

update public.products set image_url = 'visual:gifts:candle'      where title = 'Scented Candle Trio';
update public.products set image_url = 'visual:gifts:board-game'  where title = 'Board Game Night Bundle';
update public.products set image_url = 'visual:gifts:journal'     where title = 'Engraved Journal Set';

-- ---------------------------------------------------------------------------
-- 2. Add the 3 low-cost (~10 NIM) test products, if not already present
-- ---------------------------------------------------------------------------
insert into public.products (
  title, description, image_url, category_id, rating, rating_count,
  original_price_nim, deal_price_nim, cashback_percent, stock,
  is_featured, is_ending_soon, ends_at
)
select 'Kitchen Spoon',
       'Solid beechwood cooking spoon, heat-safe and gentle on non-stick pans.',
       'visual:home:spoon',
       c.id, 4.6, 58, 16, 10, 5, 300, false, false, null
from public.categories c
where c.slug = 'home'
  and not exists (select 1 from public.products p where p.title = 'Kitchen Spoon');

insert into public.products (
  title, description, image_url, category_id, rating, rating_count,
  original_price_nim, deal_price_nim, cashback_percent, stock,
  is_featured, is_ending_soon, ends_at
)
select 'Phone Charger',
       '20W USB-C fast charger cable, 1m braided, durable everyday charging.',
       'visual:electronics:phone-charger',
       c.id, 4.4, 76, 16, 10, 5, 250, false, false, null
from public.categories c
where c.slug = 'electronics'
  and not exists (select 1 from public.products p where p.title = 'Phone Charger');

insert into public.products (
  title, description, image_url, category_id, rating, rating_count,
  original_price_nim, deal_price_nim, cashback_percent, stock,
  is_featured, is_ending_soon, ends_at
)
select 'Earphones',
       'Wired in-ear earphones with in-line mic, lightweight and comfortable.',
       'visual:electronics:earphones',
       c.id, 4.2, 61, 15, 9, 5, 260, false, false, null
from public.categories c
where c.slug = 'electronics'
  and not exists (select 1 from public.products p where p.title = 'Earphones');
