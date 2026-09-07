import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface OrderItemInput {
  productId: string
  title: string
  unitPriceNim: number
  quantity: number
}

interface CreateOrderBody {
  orderReference: string
  currency: 'NIM' | 'USDT'
  totalNim: number
  cashbackEarned: number
  txHash: string | null
  status: 'confirmed' | 'failed'
  items: OrderItemInput[]
}

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = (await request.json()) as CreateOrderBody

  if (!body.items?.length) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 })
  }

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_nim: body.totalNim,
      currency: body.currency,
      status: body.status,
      tx_reference: body.txHash,
      cashback_earned: body.status === 'confirmed' ? body.cashbackEarned : 0,
    })
    .select()
    .single()

  if (orderErr || !order) {
    return NextResponse.json({ error: orderErr?.message ?? 'Could not create order' }, { status: 500 })
  }

  const { error: itemsErr } = await supabase.from('order_items').insert(
    body.items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_title: i.title,
      unit_price_nim: i.unitPriceNim,
      quantity: i.quantity,
    }))
  )
  if (itemsErr) {
    return NextResponse.json({ error: itemsErr.message }, { status: 500 })
  }

  const { error: txErr } = await supabase.from('payment_transactions').insert({
    order_id: order.id,
    user_id: user.id,
    currency: body.currency,
    amount: body.totalNim,
    recipient_address: process.env.NEXT_PUBLIC_MERCHANT_NIM_ADDRESS ?? null,
    tx_hash: body.txHash,
    status: body.status,
  })
  if (txErr) {
    return NextResponse.json({ error: txErr.message }, { status: 500 })
  }

  if (body.status === 'confirmed' && body.cashbackEarned > 0) {
    const { error: rewardErr } = await supabase.from('rewards').insert({
      user_id: user.id,
      order_id: order.id,
      amount_nim: body.cashbackEarned,
    })
    if (rewardErr) {
      return NextResponse.json({ error: rewardErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ order })
}
