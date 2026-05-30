import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface UIState {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  toasts: Toast[]
  setMobileMenuOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  toasts: [],

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  setCartOpen: (open) => set({ isCartOpen: open }),

  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    const duration = toast.duration ?? 4000
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
