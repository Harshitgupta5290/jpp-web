import type { Database, OrderStatus } from './database'

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderStatusHistory = Database['public']['Tables']['order_status_history']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type PaymentLink = Database['public']['Tables']['payment_links']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
  profiles: Profile | null
}

export interface OrderWithHistory extends OrderWithItems {
  order_status_history: OrderStatusHistory[]
}

export interface DeliveryAddress {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export interface OrderStatusStep {
  status: OrderStatus
  label: string
  description: string
  icon: string
  timestamp?: string
  isCompleted: boolean
  isCurrent: boolean
}

export interface RazorpayOrderPayload {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
