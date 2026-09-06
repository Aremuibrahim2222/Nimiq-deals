-- Nimiq Deals — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  cashback_balance_nim numeric(18, 6) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null default '🛍️'
);

alter table public.categories enable row level security;
create policy "categories: public read" on public.categories for select using (true);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null,
  category_id uuid references public.categories (id) on delete set null,
  rating numeric(2, 1) not null default 4.5,
  rating_count integer not null default 0,
  original_price_nim numeric(18, 2) not null,
  deal_price_nim numeric(18, 2) not null,
  cashback_percent numeric(4, 1) not null default 0,
  stock integer not null default 0,
  is_featured boolean not null default false,
  is_ending_soon boolean not null default false,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "products: public read" on public.products for select using (true);

-- ---------------------------------------------------------------------------
-- Favorites
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.favorites enable row level security;
create policy "favorites: own rows" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  total_nim numeric(18, 2) not null,
  currency text not null default 'NIM' check (currency in ('NIM', 'USDT')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  tx_reference text,
  cashback_earned numeric(18, 6) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "orders: own rows" on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Order items
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_title text not null,
  unit_price_nim numeric(18, 2) not null,
  quantity integer not null default 1
);

alter table public.order_items enable row level security;
create policy "order_items: via own order" on public.order_items
  for all using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Payment transactions (raw record of the on-chain / provider interaction)
-- ---------------------------------------------------------------------------
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  currency text not null check (currency in ('NIM', 'USDT')),
  amount numeric(18, 6) not null,
  sender_address text,
  recipient_address text,
  tx_hash text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.payment_transactions enable row level security;
create policy "payment_transactions: own rows" on public.payment_transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Rewards / cashback ledger
-- ---------------------------------------------------------------------------
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  amount_nim numeric(18, 6) not null,
  created_at timestamptz not null default now()
);

alter table public.rewards enable row level security;
create policy "rewards: own rows" on public.rewards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bumps the profile's cashback balance whenever a reward row is inserted.
create or replace function public.apply_reward()
returns trigger as $$
begin
  update public.profiles
  set cashback_balance_nim = cashback_balance_nim + new.amount_nim
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_reward_inserted on public.rewards;
create trigger on_reward_inserted
  after insert on public.rewards
  for each row execute procedure public.apply_reward();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_featured on public.products (is_featured);
create index if not exists idx_orders_user on public.orders (user_id, created_at desc);
create index if not exists idx_rewards_user on public.rewards (user_id, created_at desc);
