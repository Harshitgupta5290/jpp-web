import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/product'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateItem: (id: string, updates: Partial<CartItem>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity, totalPrice: i.totalPrice + item.totalPrice }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }))
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),
    }),
    {
      name: 'jpp-cart',
      // Prevent SSR/client hydration mismatch — rehydrate manually after mount
      skipHydration: true,
    }
  )
)
