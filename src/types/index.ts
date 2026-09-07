export type Currency = 'NIM' | 'USDT'

export interface Category {
  id: string
  slug: string
  name: string
  icon: string
}

export interface Product {
  id: string
  title: string
  description: string
  image_url: string
  category_id: string
  category?: Category
  rating: number
  rating_count: number
  original_price_nim: number
  deal_price_nim: number
  cashback_percent: number
  stock: number
  is_featured: boolean
  is_ending_soon: boolean
  ends_at: string | null
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'failed'

export interface Order {
  id: string
  user_id: string
  total_nim: number
  currency: Currency
  status: OrderStatus
  tx_reference: string | null
  cashback_earned: number
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_title: string
  unit_price_nim: number
  quantity: number
}

export interface RewardEntry {
  id: string
  user_id: string
  order_id: string | null
  amount_nim: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  cashback_balance_nim: number
  created_at: string
}
