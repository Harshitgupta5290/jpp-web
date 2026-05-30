import type { Database } from './database'

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type PricingSlab = Database['public']['Tables']['pricing_slabs']['Row']

export interface ProductWithCategory extends Product {
  category: Category | null
}

export interface ProductWithSlabs extends Product {
  pricing_slabs: PricingSlab[]
}

export interface ProductSpecifications {
  sizes: string[]
  paperTypes: string[]
  finishes: string[]
  sides: string[]
  [key: string]: string[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  specifications: Record<string, string>
  unitPrice: number
  totalPrice: number
  designFileUrl?: string
  designBrief?: string
  needsDesign: boolean
  previewData?: Record<string, string>
}

export interface PriceCalculationResult {
  unitPrice: number
  totalPrice: number
  slab: PricingSlab | null
  savingsPercent: number | null
}
