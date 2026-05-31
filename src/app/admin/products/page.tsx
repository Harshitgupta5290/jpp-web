'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2,
  RefreshCw, Eye, EyeOff, AlertCircle, X, ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types/product'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data'

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({ product, onCancel, onConfirm }: {
  product: Product; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl border border-border shadow-large p-6 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={22} className="text-error" />
        </div>
        <h3 className="font-display font-bold text-lg text-text-primary mb-1">Delete Product?</h3>
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to delete <strong>&ldquo;{product.name}&rdquo;</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-10 rounded-xl bg-error text-white text-sm font-semibold hover:bg-[#dc2626] transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Products Page ────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*').order('display_order', { ascending: true }),
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
      ])
      if (prods && prods.length > 0) setProducts(prods as Product[])
      if (cats && cats.length > 0) setCategories(cats as Category[])
    } catch { /* use mock data */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleActive = async (product: Product) => {
    const supabase = createClient()
    const { error } = await (supabase as any)
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (error) { showToast('Failed to update product', 'error'); return }
    setProducts((p) => p.map((pr) => pr.id === product.id ? { ...pr, is_active: !pr.is_active } : pr))
    showToast(`Product ${!product.is_active ? 'activated' : 'deactivated'}`)
  }

  const deleteProduct = async () => {
    if (!toDelete) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', toDelete.id)
    if (error) { showToast('Failed to delete product', 'error'); setToDelete(null); return }
    setProducts((p) => p.filter((pr) => pr.id !== toDelete.id))
    showToast('Product deleted')
    setToDelete(null)
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q)
    const matchCat = catFilter === 'all' || p.category_id === catFilter
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.is_active : !p.is_active)
    return matchSearch && matchCat && matchStatus
  })

  const getCat = (id: string | null) => categories.find((c) => c.id === id)

  return (
    <div className="p-6 space-y-5">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}
        >
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Products</h1>
          <p className="text-sm text-text-secondary mt-0.5">{products.length} total · {products.filter(p => p.is_active).length} active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors shadow-glow-sm">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-9 pr-3 bg-white border border-border rounded-lg text-sm outline-none focus:border-brand-blue transition-all"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"><X size={14} /></button>}
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="h-9 pl-3 pr-8 bg-white border border-border rounded-lg text-sm text-text-secondary outline-none focus:border-brand-blue appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 pl-3 pr-8 bg-white border border-border rounded-lg text-sm text-text-secondary outline-none focus:border-brand-blue appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Base Price</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Min Qty</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-text-secondary text-sm">No products found.</td></tr>
              ) : filtered.map((product, i) => {
                const cat = getCat(product.category_id)
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-bg-secondary/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-text-primary">{product.name}</p>
                      <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{product.description}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs px-2 py-1 rounded-md bg-bg-secondary border border-border text-text-secondary font-medium">
                        {cat?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-price font-semibold text-text-primary">
                      {product.base_price != null ? `₹${product.base_price}/pc` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right text-text-secondary">
                      {product.min_quantity}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${product.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : 'bg-bg-secondary text-text-tertiary border border-border hover:bg-bg-muted'}`}
                        title={product.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {product.is_active ? <><Eye size={11} /> Active</> : <><EyeOff size={11} /> Inactive</>}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors"
                          title="Edit product">
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setToDelete(product)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-red-50 transition-colors"
                          title="Delete product">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50 flex items-center justify-between">
          <p className="text-xs text-text-secondary">Showing {filtered.length} of {products.length} products</p>
          <Link href="/admin/products/new" className="flex items-center gap-1.5 text-xs text-brand-blue font-semibold hover:underline">
            <Plus size={12} /> Add product
          </Link>
        </div>
      </div>

      {/* Delete modal */}
      {toDelete && <DeleteModal product={toDelete} onCancel={() => setToDelete(null)} onConfirm={deleteProduct} />}
    </div>
  )
}
