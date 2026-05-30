export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'admin'

export type OrderStatus =
  | 'pending_quote'
  | 'quote_sent'
  | 'advance_pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type PaymentType = 'advance' | 'balance'
export type PaymentLinkStatus = 'pending' | 'paid' | 'expired'
export type BalancePaymentMethod = 'online' | 'cod'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          email: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          email?: string | null
          role?: UserRole
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          image_url: string | null
          display_order: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          display_order?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          display_order?: number | null
          is_active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          base_price: number | null
          min_quantity: number
          is_custom_pricing: boolean
          has_live_preview: boolean
          specifications: Json | null
          images: string[] | null
          is_active: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          base_price?: number | null
          min_quantity?: number
          is_custom_pricing?: boolean
          has_live_preview?: boolean
          specifications?: Json | null
          images?: string[] | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          base_price?: number | null
          min_quantity?: number
          is_custom_pricing?: boolean
          has_live_preview?: boolean
          specifications?: Json | null
          images?: string[] | null
          is_active?: boolean
          display_order?: number | null
        }
      }
      pricing_slabs: {
        Row: {
          id: string
          product_id: string | null
          min_qty: number
          max_qty: number | null
          price_per_unit: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          min_qty: number
          max_qty?: number | null
          price_per_unit: number
          created_at?: string
        }
        Update: {
          product_id?: string | null
          min_qty?: number
          max_qty?: number | null
          price_per_unit?: number
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          status: OrderStatus
          subtotal: number | null
          tax: number
          total_amount: number | null
          advance_amount: number | null
          balance_amount: number | null
          advance_paid: boolean
          advance_payment_id: string | null
          advance_payment_method: string | null
          advance_paid_at: string | null
          balance_paid: boolean
          balance_payment_id: string | null
          balance_payment_method: BalancePaymentMethod | null
          balance_paid_at: string | null
          delivery_address: Json | null
          estimated_delivery: string | null
          actual_delivery: string | null
          notes: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id?: string | null
          status?: OrderStatus
          subtotal?: number | null
          tax?: number
          total_amount?: number | null
          advance_amount?: number | null
          balance_amount?: number | null
          advance_paid?: boolean
          advance_payment_id?: string | null
          advance_payment_method?: string | null
          advance_paid_at?: string | null
          balance_paid?: boolean
          balance_payment_id?: string | null
          balance_payment_method?: BalancePaymentMethod | null
          balance_paid_at?: string | null
          delivery_address?: Json | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: OrderStatus
          subtotal?: number | null
          tax?: number
          total_amount?: number | null
          advance_amount?: number | null
          balance_amount?: number | null
          advance_paid?: boolean
          advance_payment_id?: string | null
          advance_payment_method?: string | null
          advance_paid_at?: string | null
          balance_paid?: boolean
          balance_payment_id?: string | null
          balance_payment_method?: BalancePaymentMethod | null
          balance_paid_at?: string | null
          delivery_address?: Json | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          notes?: string | null
          admin_notes?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string | null
          quantity: number | null
          specifications: Json | null
          unit_price: number | null
          total_price: number | null
          design_file_url: string | null
          design_brief: string | null
          needs_design: boolean
          preview_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number | null
          specifications?: Json | null
          unit_price?: number | null
          total_price?: number | null
          design_file_url?: string | null
          design_brief?: string | null
          needs_design?: boolean
          preview_data?: Json | null
          created_at?: string
        }
        Update: {
          product_id?: string | null
          product_name?: string | null
          quantity?: number | null
          specifications?: Json | null
          unit_price?: number | null
          total_price?: number | null
          design_file_url?: string | null
          design_brief?: string | null
          needs_design?: boolean
          preview_data?: Json | null
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string | null
          status: OrderStatus | null
          note: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          status?: OrderStatus | null
          note?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          status?: OrderStatus | null
          note?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string | null
          customer_id: string | null
          rating: number
          comment: string | null
          images: string[] | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          customer_id?: string | null
          rating: number
          comment?: string | null
          images?: string[] | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
          images?: string[] | null
          is_approved?: boolean
        }
      }
      payment_links: {
        Row: {
          id: string
          order_id: string | null
          razorpay_payment_link_id: string | null
          amount: number | null
          type: PaymentType | null
          status: PaymentLinkStatus
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          razorpay_payment_link_id?: string | null
          amount?: number | null
          type?: PaymentType | null
          status?: PaymentLinkStatus
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          razorpay_payment_link_id?: string | null
          amount?: number | null
          type?: PaymentType | null
          status?: PaymentLinkStatus
          expires_at?: string | null
        }
      }
    }
  }
}
