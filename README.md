# Nimiq Deals

A mobile-first shopping & deals Mini App built for the **Nimiq Mini Apps Competition — Cycle II**.
Discover discounted products, pay with NIM through **Nimiq Pay**, and earn cashback on every
confirmed order.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS
- **Database & Auth:** Supabase (Postgres + Row Level Security, Supabase Auth email/password)
- **Payments:** `@nimiq/mini-app-sdk` (the Nimiq Pay Mini Apps provider)
- **Deployment:** Vercel-ready

## ⚠️ Read this before touching payments: what the Nimiq Mini Apps API actually supports

Before implementing checkout, I verified the real, current Mini Apps integration surface
(nimiq.dev/mini-apps, plus how existing published Mini Apps like *Kolo* and *Tanda* actually use
it) instead of guessing at an API. The provider that Nimiq Pay injects into a Mini App exposes
**exactly**:

- `init()`
- `listAccounts()`
- `sign()`
- `sendBasicTransaction()`
- `sendBasicTransactionWithData()`
- six staking-related calls

That's it. **There is no documented method for sending USDT, BTC, or any other asset from a Mini
App.** Multi-asset swaps (NIM/BTC/USDC/USDT) exist in the full Nimiq Wallet application, not in
the constrained provider a Mini App receives — those are two different surfaces.

Because the brief explicitly said not to invent APIs or mock wallet transactions, this project:

- Implements **real NIM checkout** using `sendBasicTransactionWithData`, tagging each transaction
  with a memo (`nimiqdeals:order:<uuid>`) so any payment can be independently verified on-chain —
  the same pattern used by other real Mini Apps in this ecosystem.
- Models `USDT` as a valid currency in the database and types (so the product isn't rearchitected
  the day the provider adds support), but the **checkout UI keeps USDT disabled** with an
  explanation, rather than pretending a transaction went through.

If the Mini Apps SDK gains multi-asset support before you submit, the only file that needs new
logic is `src/lib/nimiq/miniAppSdk.ts` — the rest of the app already treats `currency` as a
first-class field end to end (cart → checkout → orders → payment_transactions).

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in your Supabase project URL/keys and a merchant NIM address
```

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor (creates tables, RLS policies, and
   triggers for auto-profile-creation and cashback accounting).
3. Seed demo data — pick whichever fits your workflow:
   - **From the SQL Editor:** paste and run `supabase/seed.sql`. Pure SQL, no local setup needed.
   - **From the CLI:**
     ```bash
     SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npm run seed
     ```
   Both seed the same 6 categories and 27 demo products.
4. `npm run dev` and open `http://localhost:3000`.

To test a real payment, open the deployed app's URL from inside **Nimiq Pay** (the Mini App
provider is only injected there — outside of it, checkout will show a clear "open this in Nimiq
Pay" message instead of silently failing).

## Project structure

```
src/
  app/
    page.tsx                Home — categories, featured/latest/ending-soon/cashback rails
    explore/                Search, filters (category, price, discount, cashback), sorting
    product/[id]/           Product detail + Add to Cart / Buy Now
    cart/                   Cart with quantity controls and price breakdown
    checkout/               Currency choice + real Nimiq Pay payment flow
    orders/                 Order history with status and tx reference
    rewards/                Cashback balance, total earned, history
    profile/                Account info, logout
    login/ signup/          Supabase Auth email/password
    api/orders/route.ts     Records orders/items/transactions/cashback after payment
    auth-actions.ts         Server actions: signUpAction, loginAction, logoutAction
  components/                Shared UI (ProductCard, PriceBlock, CashbackBadge, BottomNav, …)
  context/                   CartContext (localStorage), ToastContext
  lib/
    supabase/                 Browser + server Supabase clients
    nimiq/miniAppSdk.ts        Nimiq Pay wallet provider wrapper (see caveat above)
  types/                      Shared TypeScript domain types
supabase/schema.sql             Full Postgres schema + RLS
supabase/seed.sql               Pure-SQL demo data seed (paste into SQL Editor)
scripts/seed.ts                 Demo data seeding via Node/Supabase JS client (27 products / 6 categories)
```

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for the client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **only** used by `scripts/seed.ts`, never bundled client-side |
| `NEXT_PUBLIC_NIMIQ_NETWORK` | `testnet` or `mainnet` |
| `NEXT_PUBLIC_MERCHANT_NIM_ADDRESS` | The NIM address that receives payments for orders |

## Security notes

- Every user-scoped table (`orders`, `order_items`, `payment_transactions`, `rewards`,
  `favorites`, `profiles`) has RLS policies keyed to `auth.uid()` — a user can only ever read or
  write their own rows.
- The Supabase service role key is never imported into any client or server component that ships
  to the browser — it's only referenced in `scripts/seed.ts`, which runs locally/in CI.
- No private keys are ever handled by this app: NIM payments are signed inside the user's own
  Nimiq Pay wallet via `sendBasicTransactionWithData`; this codebase never sees a seed phrase or
  private key.
