'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Plus, Trash2, Save, AlertCircle, CheckCircle, X,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import type { Category } from '@/types/product'

interface PricingSlab { min_qty: number; max_qty: number | null; price_per_unit: number }

function TagInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) { onChange([...tags, v]); setInput('') }
  }
  const remove = (t: string) => onChange(tags.filter((x) => x !== t))
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-white min-h-[44px] focus-within:border-brand-blue transition-colors">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-brand-blue">
            {t}
            <button type="button" onClick={() => remove(t)} className="text-brand-blue/60 hover:text-brand-blue">
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
          onBlur={add}
          placeholder={tags.length === 0 ? `Add ${label.toLowerCase()}… (press Enter)` : ''}
          className="flex-1 min-w-[150px] text-sm outline-none bg-transparent placeholder:text-text-tertiary"
        />
      </div>
    </div>
  )
}

function SlabRow({
  slab, index, onChange, onRemove, isLast,
}: {
  slab: PricingSlab; index: number
  onChange: (s: PricingSlab) => void; onRemove: () => void; isLast: boolean
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
      <div>
        <label className="text-xs text-text-tertiary block mb-1">Min Qty</label>
        <input type="number" value={slab.min_qty} min={1}
          onChange={(e) => onChange({ ...slab, min_qty: parseInt(e.target.value) || 0 })}
          className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
      </div>
      <div>
        <label className="text-xs text-text-tertiary block mb-1">Max Qty {isLast && <span className="text-text-tertiary">(blank = unlimited)</span>}</label>
        <input type="number" value={slab.max_qty ?? ''} min={1}
          onChange={(e) => onChange({ ...slab, max_qty: e.target.value ? parseInt(e.target.value) : null })}
          className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue"
          placeholder="No limit" />
      </div>
      <div>
        <label className="text-xs text-text-tertiary block mb-1">₹ per pc</label>
        <input type="number" value={slab.price_per_unit} step={0.01} min={0}
          onChange={(e) => onChange({ ...slab, price_per_unit: parseFloat(e.target.value) || 0 })}
          className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
      </div>
      <div className="pt-5">
        <button type="button" onClick={onRemove} disabled={index === 0}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-red-50 disabled:opacity-30 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
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
  const [slabs, setSlabs] = useState<PricingSlab[]>([
    { min_qty: 100, max_qty: 499, price_per_unit: 5 },
    { min_qty: 500, max_qty: 999, price_per_unit: 4 },
    { min_qty: 1000, max_qty: null, price_per_unit: 3 },
  ])
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [seoKeywords, setSeoKeywords] = useState<string[]>([])

  useEffect(() => {
    createClient().from('categories').select('*').order('display_order').then(({ data }) => {
      if (data && data.length > 0) setCategories(data as Category[])
    })
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugEdited && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }, [name, slugEdited])

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) { showToast('Name and slug are required', 'error'); return }

    setSaving(true)
    try {
      const supabase = createClient()

      const { data: product, error: prodError } = await (supabase as any)
        .from('products')
        .insert({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          category_id: categoryId || null,
          base_price: basePrice ? parseFloat(basePrice) : null,
          min_quantity: parseInt(minQty) || 100,
          is_active: isActive,
          has_live_preview: hasPreview,
          specifications: { sizes, paperTypes, finishes, sides },
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          seo_keywords: seoKeywords.length > 0 ? seoKeywords : null,
        })
        .select('id')
        .single()

      if (prodError) throw prodError

      // Insert pricing slabs
      if (slabs.length > 0 && product) {
        await (supabase as any).from('pricing_slabs').insert(
          slabs.map((s) => ({ ...s, product_id: (product as any).id }))
        )
      }

      showToast('Product created successfully!', 'success')
      setTimeout(() => router.push('/admin/products'), 1200)
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to create product', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}
        >
          {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Add New Product</h1>
          <p className="text-sm text-text-secondary">Fill in the details to add a product to your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-text-primary border-b border-border pb-3">Basic Information</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Product Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="e.g. Premium Business Cards"
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Slug *</label>
              <input value={slug}
                onChange={(e) => { setSlugEdited(true); setSlug(e.target.value) }}
                required placeholder="premium-business-cards"
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm font-mono outline-none focus:border-brand-blue transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="Short product description shown in catalog…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue transition-all resize-none" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue appearance-none cursor-pointer">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Base Price (₹/pc)</label>
              <input type="number" value={basePrice} step="0.01" min="0"
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="3.99"
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Min. Quantity</label>
              <input type="number" value={minQty} min="1"
                onChange={(e) => setMinQty(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-brand-blue" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setIsActive((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors relative ${isActive ? 'bg-brand-blue' : 'bg-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-text-primary">Active (visible in catalog)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setHasPreview((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors relative ${hasPreview ? 'bg-brand-blue' : 'bg-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${hasPreview ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-text-primary">Has Live Preview</span>
            </label>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-text-primary border-b border-border pb-3">Specifications</h2>
          <TagInput label="Sizes" tags={sizes} onChange={setSizes} />
          <TagInput label="Paper Types" tags={paperTypes} onChange={setPaperTypes} />
          <TagInput label="Finishes" tags={finishes} onChange={setFinishes} />
          <TagInput label="Sides" tags={sides} onChange={setSides} />
        </div>

        {/* Pricing Slabs */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-semibold text-text-primary">Bulk Pricing Slabs</h2>
            <button type="button"
              onClick={() => setSlabs([...slabs, { min_qty: (slabs[slabs.length - 1]?.max_qty ?? 999) + 1, max_qty: null, price_per_unit: 1 }])}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline">
              <Plus size={13} /> Add Slab
            </button>
          </div>
          <div className="space-y-3">
            {slabs.map((slab, i) => (
              <SlabRow
                key={i} slab={slab} index={i} isLast={i === slabs.length - 1}
                onChange={(s) => setSlabs(slabs.map((sl, j) => j === i ? s : sl))}
                onRemove={() => setSlabs(slabs.filter((_, j) => j !== i))}
              />
            ))}
          </div>
          <p className="text-xs text-text-tertiary">Slabs are applied automatically based on quantity ordered. Leave Max Qty blank on the last slab for unlimited.</p>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-text-primary border-b border-border pb-3">SEO</h2>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Meta Title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={`${name || 'Product'} | Jawahar Printing Press`}
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

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/admin/products" className="flex items-center gap-2 h-11 px-5 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 h-11 px-6 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors shadow-glow-sm disabled:opacity-60">
            <Save size={15} className={saving ? 'animate-spin' : ''} />
            {saving ? 'Saving…' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
