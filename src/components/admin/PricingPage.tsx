'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Plus, Trash2, Save, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

interface Slab { id: string; product_id: string; min_qty: number; max_qty: number | null; price_per_unit: number }
interface Product { id: string; name: string; slug: string; category_id: string | null }

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS as any)
  const [slabs, setSlabs] = useState<Record<string, Slab[]>>({})
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const [{ data: prods }, { data: allSlabs }] = await Promise.all([
        supabase.from('products').select('id,name,slug,category_id').order('name') as any,
        supabase.from('pricing_slabs').select('*').order('min_qty') as any,
      ])
      if (prods?.length) setProducts(prods)
      if (allSlabs?.length) {
        const map: Record<string, Slab[]> = {}
        for (const s of allSlabs) {
          if (!map[s.product_id]) map[s.product_id] = []
          map[s.product_id]!.push(s)
        }
        setSlabs(map)
      }
    } catch { /* use mock */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const productSlabs = selected ? (slabs[selected] ?? []) : []
  const selectedProduct = products.find(p => p.id === selected)

  const updateSlab = (idx: number, field: keyof Slab, value: unknown) => {
    setSlabs((s) => ({
      ...s,
      [selected]: (s[selected] ?? []).map((sl, i) => i === idx ? { ...sl, [field]: value } : sl),
    }))
  }

  const addSlab = () => {
    const current = slabs[selected] ?? []
    const lastMax = current[current.length - 1]?.max_qty
    setSlabs((s) => ({
      ...s,
      [selected]: [...current, { id: `new-${Date.now()}`, product_id: selected, min_qty: (lastMax ?? 999) + 1, max_qty: null, price_per_unit: 0 }],
    }))
  }

  const removeSlab = (idx: number) => {
    setSlabs((s) => ({ ...s, [selected]: (s[selected] ?? []).filter((_, i) => i !== idx) }))
  }

  const savePricing = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const supabase = createClient()
      await (supabase as any).from('pricing_slabs').delete().eq('product_id', selected)
      const toInsert = productSlabs.map(({ min_qty, max_qty, price_per_unit }) => ({ product_id: selected, min_qty, max_qty, price_per_unit }))
      if (toInsert.length > 0) await (supabase as any).from('pricing_slabs').insert(toInsert)
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Pricing Slabs</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage bulk volume pricing per product.</p>
        </div>
        <button onClick={load} disabled={loading} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Product selector */}
      <div className="relative">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}
          className="w-full h-11 pl-4 pr-10 rounded-xl border border-border bg-white text-sm font-medium outline-none focus:border-brand-blue appearance-none">
          <option value="">Select a product to edit pricing…</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
      </div>

      {selected && selectedProduct && (
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">{selectedProduct.name} — Pricing Slabs</h2>
            <div className="flex gap-2">
              <button onClick={addSlab} className="flex items-center gap-1.5 text-xs text-brand-blue font-semibold hover:underline">
                <Plus size={12} /> Add slab
              </button>
            </div>
          </div>

          {/* Slabs table */}
          {productSlabs.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-8">No pricing slabs. Add one above.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-1">
                {['Min Qty', 'Max Qty', '₹/pc', ''].map((h) => (
                  <span key={h} className="text-xs font-bold text-text-secondary uppercase tracking-wide">{h}</span>
                ))}
              </div>
              {productSlabs.map((slab, i) => (
                <motion.div key={slab.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
                  <input type="number" value={slab.min_qty} min={0}
                    onChange={(e) => updateSlab(i, 'min_qty', parseInt(e.target.value) || 0)}
                    className="h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue" />
                  <input type="number" value={slab.max_qty ?? ''} min={0}
                    onChange={(e) => updateSlab(i, 'max_qty', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="No limit"
                    className="h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue" />
                  <input type="number" value={slab.price_per_unit} step={0.01} min={0}
                    onChange={(e) => updateSlab(i, 'price_per_unit', parseFloat(e.target.value) || 0)}
                    className="h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue font-price" />
                  <button onClick={() => removeSlab(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button onClick={savePricing} disabled={saving}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors disabled:opacity-60">
              <Save size={14} /> {saving ? 'Saving…' : 'Save Pricing'}
            </button>
            {saved && <span className="text-sm text-success font-medium">✓ Saved!</span>}
          </div>
        </div>
      )}
    </div>
  )
}
