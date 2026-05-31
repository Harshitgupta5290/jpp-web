'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, CheckCircle, X, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data'
import type { Category } from '@/types/product'

interface PricingSlab { id?: string; min_qty: number; max_qty: number | null; price_per_unit: number }

function TagInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => { const v = input.trim(); if (v && !tags.includes(v)) { onChange([...tags, v]); setInput('') } }
  const remove = (t: string) => onChange(tags.filter((x) => x !== t))
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-white min-h-[44px] focus-within:border-brand-blue transition-colors">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-brand-blue">
            {t}
            <button type="button" onClick={() => remove(t)} className="text-brand-blue/60 hover:text-brand-blue"><X size={11} /></button>
          </span>
        ))}
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
          onBlur={add}
          placeholder={tags.length === 0 ? `Add ${label.toLowerCase()}…` : ''}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-text-tertiary" />
      </div>
    </div>
  )
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [minQty, setMinQty] = useState('100')
  const [isActive, setIsActive] = useState(true)
  const [hasPreview, setHasPreview] = useState(false)
  const [sizes, setSizes] = useState<string[]>([])
  const [paperTypes, setPaperTypes] = useState<string[]>([])
  const [finishes, setFinishes] = useState<string[]>([])
  const [sides, setSides] = useState<string[]>([])
  const [slabs, setSlabs] = useState<PricingSlab[]>([])
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [seoKeywords, setSeoKeywords] = useState<string[]>([])

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [{ data: cats }, { data: product }, { data: slabsData }] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('products').select('*').eq('id', id!).single(),
        supabase.from('pricing_slabs').select('*').eq('product_id', id!).order('min_qty'),
      ])

      if (cats && cats.length > 0) setCategories(cats as Category[])

      // Populate form from DB or mock
      const prod = product ?? MOCK_PRODUCTS.find((p) => p.id === id)
      if (prod) {
        setName(prod.name); setSlug(prod.slug)
        setDescription(prod.description ?? '')
        setCategoryId(prod.category_id ?? '')
        setBasePrice(prod.base_price?.toString() ?? '')
        setMinQty(prod.min_quantity?.toString() ?? '100')
        setIsActive(prod.is_active); setHasPreview(prod.has_live_preview)
        const specs = prod.specifications as Record<string, string[]> | null
        setSizes(specs?.sizes ?? []); setPaperTypes(specs?.paperTypes ?? [])
        setFinishes(specs?.finishes ?? []); setSides(specs?.sides ?? [])
        setMetaTitle((prod as any).meta_title ?? '')
        setMetaDescription((prod as any).meta_description ?? '')
        setSeoKeywords((prod as any).seo_keywords ?? [])
      }

      if (slabsData && slabsData.length > 0) {
        setSlabs((slabsData as any[]).map((s) => ({ id: s.id, min_qty: s.min_qty, max_qty: s.max_qty, price_per_unit: s.price_per_unit })))
      }

      setLoading(false)
    }
    if (id) load().catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase as any).from('products').update({
        name, slug, description: description || null,
        category_id: categoryId || null,
        base_price: basePrice ? parseFloat(basePrice) : null,
        min_quantity: parseInt(minQty) || 100,
        is_active: isActive, has_live_preview: hasPreview,
        specifications: { sizes, paperTypes, finishes, sides },
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        seo_keywords: seoKeywords.length > 0 ? seoKeywords : null,
      }).eq('id', id!)

      if (error) throw error

      // Re-insert pricing slabs
      await (supabase as any).from('pricing_slabs').delete().eq('product_id', id!)
      if (slabs.length > 0) {
        await (supabase as any).from('pricing_slabs').insert(slabs.map((s) => ({ min_qty: s.min_qty, max_qty: s.max_qty, price_per_unit: s.price_per_unit, product_id: id })))
      }

      showToast('Product updated!', 'success')
      setTimeout(() => router.push('/admin/products'), 1200)
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to update', 'error')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="p-6 text-text-secondary text-sm">Loading product…</div>

  return (
    <div className="p-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Edit Product</h1>
          <p className="text-sm text-text-secondary font-mono">{slug}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-text-primary border-b border-border pb-3">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Product Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Slug *</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} required
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm font-mono outline-none focus:border-brand-blue" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue resize-none" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue appearance-none">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Base Price (₹/pc)</label>
              <input type="number" value={basePrice} step="0.01" onChange={(e) => setBasePrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Min. Qty</label>
              <input type="number" value={minQty} min="1" onChange={(e) => setMinQty(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            {[['Active (visible in catalog)', isActive, setIsActive] as const, ['Has Live Preview', hasPreview, setHasPreview] as const].map(([label, val, set]) => (
              <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => set(!val)} className={`w-10 h-6 rounded-full transition-colors relative ${val ? 'bg-brand-blue' : 'bg-border'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-medium text-text-primary">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-text-primary border-b border-border pb-3">Specifications</h2>
          <TagInput label="Sizes" tags={sizes} onChange={setSizes} />
          <TagInput label="Paper Types" tags={paperTypes} onChange={setPaperTypes} />
          <TagInput label="Finishes" tags={finishes} onChange={setFinishes} />
          <TagInput label="Sides" tags={sides} onChange={setSides} />
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-semibold text-text-primary">Pricing Slabs</h2>
            <button type="button" onClick={() => setSlabs([...slabs, { min_qty: 1, max_qty: null, price_per_unit: 1 }])}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline">
              <Plus size={13} /> Add Slab
            </button>
          </div>
          {slabs.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-4">No pricing slabs. Add one above.</p>
          ) : (
            <div className="space-y-3">
              {slabs.map((slab, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                  <div>
                    {i === 0 && <label className="text-xs text-text-tertiary block mb-1">Min Qty</label>}
                    <input type="number" value={slab.min_qty} min={1}
                      onChange={(e) => setSlabs(slabs.map((s, j) => j === i ? { ...s, min_qty: parseInt(e.target.value) || 0 } : s))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
                  </div>
                  <div>
                    {i === 0 && <label className="text-xs text-text-tertiary block mb-1">Max Qty</label>}
                    <input type="number" value={slab.max_qty ?? ''} min={1}
                      onChange={(e) => setSlabs(slabs.map((s, j) => j === i ? { ...s, max_qty: e.target.value ? parseInt(e.target.value) : null } : s))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" placeholder="No limit" />
                  </div>
                  <div>
                    {i === 0 && <label className="text-xs text-text-tertiary block mb-1">₹/pc</label>}
                    <input type="number" value={slab.price_per_unit} step="0.01" min={0}
                      onChange={(e) => setSlabs(slabs.map((s, j) => j === i ? { ...s, price_per_unit: parseFloat(e.target.value) || 0 } : s))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
                  </div>
                  <button type="button" onClick={() => setSlabs(slabs.filter((_, j) => j !== i))}
                    className="w-8 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-text-primary border-b border-border pb-3">SEO</h2>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Meta Title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={`${name} | Jawahar Printing Press`}
              maxLength={70}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
            <p className="text-xs text-text-tertiary mt-1">{metaTitle.length}/70 chars</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Meta Description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
              rows={2} maxLength={160} placeholder="Brief description for search engines…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue resize-none" />
            <p className="text-xs text-text-tertiary mt-1">{metaDescription.length}/160 chars</p>
          </div>
          <TagInput label="SEO Keywords" tags={seoKeywords} onChange={setSeoKeywords} />
        </div>

        <div className="flex gap-3">
          <Link href="/admin/products" className="flex items-center gap-2 h-11 px-5 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 h-11 px-6 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors shadow-glow-sm disabled:opacity-60">
            <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
