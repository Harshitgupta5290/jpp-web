'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X, RefreshCw, GripVertical, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

interface Category {
  id: string; name: string; slug: string; description: string | null
  icon: string | null; is_active: boolean; display_order: number | null; created_at: string
}

const ICON_OPTIONS = ['CreditCard','BookOpen','Megaphone','Package','FileText','Heart','ImageIcon','Shirt','Box','Gift','Tag','Star','Award','Globe','Briefcase']
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function CategoryForm({ initial, onSave, onCancel, saving }: {
  initial?: Category | null; onSave: (d: Partial<Category>) => void; onCancel: () => void; saving: boolean
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(!!initial)
  const [description, setDescription] = useState(initial?.description ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? 'Package')
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [order, setOrder] = useState(initial?.display_order?.toString() ?? '')

  useEffect(() => { if (!slugEdited && name) setSlug(slugify(name)) }, [name, slugEdited])

  return (
    <div className="bg-white rounded-2xl border border-brand-blue/20 shadow-medium p-5 space-y-4">
      <h3 className="font-semibold text-text-primary">{initial ? 'Edit Category' : 'New Category'}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Business Cards"
            className="w-full h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Slug *</label>
          <input value={slug} onChange={(e) => { setSlugEdited(true); setSlug(e.target.value) }} placeholder="business-cards"
            className="w-full h-9 px-3 rounded-lg border border-border text-sm font-mono outline-none focus:border-brand-blue" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-text-secondary mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-brand-blue resize-none" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Icon</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue appearance-none">
            {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Display Order</label>
          <input type="number" value={order} min={0} onChange={(e) => setOrder(e.target.value)} placeholder="1"
            className="w-full h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue" />
        </div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <div onClick={() => setIsActive((v) => !v)}
          className={`w-9 h-5 rounded-full transition-colors relative ${isActive ? 'bg-brand-blue' : 'bg-border'}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm font-medium text-text-primary">Active (visible on website)</span>
      </label>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-secondary transition-colors">
          <X size={14} /> Cancel
        </button>
        <button disabled={saving || !name.trim() || !slug.trim()}
          onClick={() => onSave({ name, slug, description: description || null, icon, is_active: isActive, display_order: order ? parseInt(order) : null })}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors disabled:opacity-50">
          <Save size={14} className={saving ? 'animate-spin' : ''} />
          {saving ? 'Saving…' : (initial ? 'Update' : 'Create')}
        </button>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Category | null | 'new'>(null)
  const [toDelete, setToDelete] = useState<Category | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').order('display_order', { ascending: true }) as any
      setCategories(data?.length ? data : MOCK_CATEGORIES as any)
    } catch { setCategories(MOCK_CATEGORIES as any) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (formData: Partial<Category>) => {
    setSaving(true)
    try {
      const supabase = createClient()
      if (editing === 'new') {
        const { data, error } = await (supabase as any).from('categories').insert(formData).select().single()
        if (error) throw error
        setCategories((c) => [...c, data])
        showToast('Category created!', 'success')
      } else if (editing) {
        const { error } = await (supabase as any).from('categories').update(formData).eq('id', editing.id)
        if (error) throw error
        setCategories((c) => c.map((cat) => cat.id === (editing as Category).id ? { ...cat, ...formData } : cat))
        showToast('Category updated!', 'success')
      }
      setEditing(null)
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to save', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await (createClient() as any).from('categories').delete().eq('id', toDelete.id)
      setCategories((c) => c.filter((cat) => cat.id !== toDelete.id))
      showToast('Category deleted', 'success')
    } catch (err: any) { showToast(err?.message ?? 'Failed to delete', 'error') }
    finally { setToDelete(null) }
  }

  const toggleActive = async (cat: Category) => {
    try {
      await (createClient() as any).from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
      setCategories((c) => c.map((x) => x.id === cat.id ? { ...x, is_active: !x.is_active } : x))
    } catch { showToast('Failed to toggle', 'error') }
  }

  return (
    <div className="p-6 max-w-4xl space-y-5">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {toast.msg}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Categories</h1>
          <p className="text-sm text-text-secondary mt-0.5">{categories.length} categories · {categories.filter(c => c.is_active).length} active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setEditing('new')}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors shadow-glow-sm">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <CategoryForm initial={editing === 'new' ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="w-10 px-4 py-3" />
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Slug</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Order</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-text-secondary text-sm">No categories yet.</td></tr>
            ) : categories.map((cat, i) => (
              <motion.tr key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-bg-secondary/50 transition-colors">
                <td className="px-4 py-3"><GripVertical size={14} className="text-text-tertiary cursor-grab" /></td>
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-text-primary">{cat.name}</p>
                  {cat.description && <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{cat.description}</p>}
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded">{cat.slug}</span>
                </td>
                <td className="px-4 py-3.5 text-center text-text-secondary">{cat.display_order ?? '—'}</td>
                <td className="px-4 py-3.5 text-center">
                  <button onClick={() => toggleActive(cat)}
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${cat.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-bg-muted text-text-tertiary border-border'}`}>
                    {cat.is_active ? <span className="flex items-center gap-1"><Eye size={10} />Active</span> : <span className="flex items-center gap-1"><EyeOff size={10} />Inactive</span>}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => setToDelete(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50">
          <p className="text-xs text-text-secondary">{categories.length} categories total</p>
        </div>
      </div>

      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl border border-border shadow-large p-6 max-w-sm w-full">
            <h3 className="font-bold text-text-primary mb-2">Delete &ldquo;{toDelete.name}&rdquo;?</h3>
            <p className="text-sm text-text-secondary mb-5">Products in this category will become uncategorized. Cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-10 rounded-xl bg-error text-white text-sm font-semibold hover:bg-[#dc2626] transition-colors">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
