'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, Clock, Package,
  User, Phone, MapPin, MessageCircle, Save, AlertCircle, X, FileText, Download,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OrderStatus } from '@/types/database'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending_quote:    { label: 'Pending Quote',    color: '#D97706', bg: '#FEF3C7' },
  quote_sent:       { label: 'Quote Sent',        color: '#7C3AED', bg: '#EDE9FE' },
  advance_pending:  { label: 'Advance Pending',   color: '#EA580C', bg: '#FFF7ED' },
  confirmed:        { label: 'Confirmed',          color: '#2D6FFF', bg: '#EFF6FF' },
  processing:       { label: 'Processing',         color: '#7C3AED', bg: '#F5F3FF' },
  ready:            { label: 'Ready to Ship',      color: '#0EA5E9', bg: '#F0F9FF' },
  out_for_delivery: { label: 'Out for Delivery',   color: '#D97706', bg: '#FFFBEB' },
  delivered:        { label: 'Delivered',           color: '#059669', bg: '#ECFDF5' },
  cancelled:        { label: 'Cancelled',           color: '#DC2626', bg: '#FEF2F2' },
}

const STATUS_FLOW: OrderStatus[] = [
  'pending_quote','quote_sent','advance_pending','confirmed','processing','ready','out_for_delivery','delivered',
]

interface OrderDetail {
  id: string; order_number: string; status: OrderStatus
  total_amount: number | null; advance_amount: number | null; balance_amount: number | null
  advance_paid: boolean; balance_paid: boolean
  notes: string | null; admin_notes: string | null
  estimated_delivery: string | null; created_at: string; updated_at: string
  customer: { full_name: string | null; email: string | null; phone: string | null } | null
  items: { id: string; product_name: string | null; quantity: number | null; unit_price: number | null; total_price: number | null; specifications: Record<string, unknown> | null; design_file_url: string | null; needs_design: boolean }[]
  history: { id: string; status: OrderStatus | null; note: string | null; created_at: string }[]
  delivery_address: Record<string, string> | null
}

const MOCK_ORDER: OrderDetail = {
  id: '1', order_number: 'JPP-2024-247', status: 'processing',
  total_amount: 4200, advance_amount: 2100, balance_amount: 2100,
  advance_paid: true, balance_paid: false,
  notes: 'Please ensure matte finish on all cards', admin_notes: null,
  estimated_delivery: new Date(Date.now() + 3 * 86400000).toISOString(),
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date(Date.now() - 1800000).toISOString(),
  customer: { full_name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210' },
  items: [
    { id: 'i1', product_name: 'Premium Business Cards', quantity: 500, unit_price: 8, total_price: 4000, specifications: { size: '3.5×2"', paper: '400 GSM', finish: 'Matte Lamination', sides: 'Double Side' }, design_file_url: null, needs_design: false },
    { id: 'i2', product_name: 'Delivery Charge', quantity: 1, unit_price: 200, total_price: 200, specifications: null, design_file_url: null, needs_design: false },
  ],
  history: [
    { id: 'h1', status: 'pending_quote', note: 'Order placed by customer', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'h2', status: 'confirmed', note: 'Quote accepted and advance payment received', created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: 'h3', status: 'processing', note: 'Sent to press — ETA 3 days', created_at: new Date(Date.now() - 1800000).toISOString() },
  ],
  delivery_address: { name: 'Rahul Sharma', phone: '9876543210', addressLine1: '123 Main Street', city: 'Rohtak', state: 'Haryana', pincode: '124001' },
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<OrderDetail | null>(MOCK_ORDER)
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('')
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchOrder = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, total_amount, advance_amount, balance_amount,
          advance_paid, balance_paid, notes, admin_notes, estimated_delivery,
          created_at, updated_at, delivery_address,
          profiles(full_name, email, phone),
          order_items(id, product_name, quantity, unit_price, total_price, specifications, design_file_url, needs_design),
          order_status_history(id, status, note, created_at)
        `)
        .eq('id', id)
        .single()

      if (data) {
        setOrder({
          ...(data as any),
          customer: (data as any).profiles,
          items: (data as any).order_items ?? [],
          history: ((data as any).order_status_history ?? []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
          delivery_address: (data as any).delivery_address as Record<string, string> | null,
        })
        setAdminNote((data as any).admin_notes ?? '')
      }
    }
    fetchOrder().catch(() => {})
  }, [id])

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase as any).from('orders').update({ status: newStatus, admin_notes: adminNote || null, updated_at: new Date().toISOString() }).eq('id', order.id)
      if (error) throw error

      await (supabase as any).from('order_status_history').insert({
        order_id: order.id, status: newStatus,
        note: adminNote || `Status updated to ${STATUS_CONFIG[newStatus]?.label}`,
      })

      setOrder({ ...order, status: newStatus, admin_notes: adminNote })
      setNewStatus('')
      showToast('Order status updated!', 'success')
    } catch {
      showToast('Failed to update status', 'error')
    } finally { setSaving(false) }
  }

  const handleSaveNote = async () => {
    if (!order) return
    setSaving(true)
    try {
      const supabase = createClient()
      await (supabase as any).from('orders').update({ admin_notes: adminNote }).eq('id', order.id)
      setOrder({ ...order, admin_notes: adminNote })
      showToast('Note saved', 'success')
    } catch { showToast('Failed to save note', 'error') }
    finally { setSaving(false) }
  }

  if (!order) return <div className="p-6 text-text-secondary text-sm">Loading order…</div>

  const cfg = STATUS_CONFIG[order.status]

  return (
    <div className="p-6 max-w-5xl space-y-5">
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}>
          {toast.msg} <button onClick={() => setToast(null)}><X size={14} /></button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl text-text-primary font-mono">{order.order_number}</h1>
              <span className="text-sm px-2.5 py-1 rounded-full font-semibold" style={{ color: cfg?.color, background: cfg?.bg }}>
                {cfg?.label}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Created {new Date(order.created_at).toLocaleString('en-IN')} ·
              Updated {new Date(order.updated_at).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        {order.customer?.phone && (
          <a href={`https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(`Hi ${order.customer.full_name ?? ''}, update on your order ${order.order_number}:`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-sm font-semibold hover:bg-[#25D366]/20 transition-colors">
            <MessageCircle size={14} /> WhatsApp Customer
          </a>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — main info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Status timeline */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock size={16} className="text-text-tertiary" /> Status Timeline
            </h2>
            <div className="flex gap-1 mb-5 overflow-x-auto pb-2">
              {STATUS_FLOW.map((s, i) => {
                const done = STATUS_FLOW.indexOf(order.status) >= i
                const current = order.status === s
                const c = STATUS_CONFIG[s]
                return (
                  <div key={s} className="flex items-center gap-1 shrink-0">
                    <div className={`text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap transition-all ${done ? (current ? 'text-white shadow-sm' : 'text-white opacity-80') : 'bg-bg-muted text-text-tertiary'}`}
                      style={done ? { background: c?.color } : {}}>
                      {c?.label}
                    </div>
                    {i < STATUS_FLOW.length - 1 && <div className={`w-3 h-px ${done ? 'bg-border-strong' : 'bg-border'}`} />}
                  </div>
                )
              })}
            </div>

            {/* History */}
            <div className="space-y-3">
              {order.history.map((h) => (
                <div key={h.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-bg-secondary border border-border flex items-center justify-center shrink-0">
                    <CheckCircle size={13} className="text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{h.status ? (STATUS_CONFIG[h.status]?.label ?? h.status) : '—'}</p>
                    {h.note && <p className="text-xs text-text-secondary">{h.note}</p>}
                    <p className="text-[11px] text-text-tertiary mt-0.5">{new Date(h.created_at).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-text-primary flex items-center gap-2">
                <Package size={16} className="text-text-tertiary" /> Order Items
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-text-secondary">Product</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-text-secondary">Qty</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary">Unit Price</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-text-secondary">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-secondary/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{item.product_name}</p>
                      {item.specifications && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.specifications).map(([k, v]) => (
                            <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-muted border border-border text-text-tertiary">
                              {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.design_file_url ? (
                        <a href={item.design_file_url} target="_blank" rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-brand-blue hover:underline">
                          <Download size={11} /> Design file
                        </a>
                      ) : item.needs_design ? (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-600">
                          <FileText size={11} /> Design assistance requested
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-center text-text-secondary">{item.quantity?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-price text-text-secondary">₹{item.unit_price}</td>
                    <td className="px-5 py-3 text-right font-price font-semibold text-text-primary">₹{item.total_price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border">
                <tr><td colSpan={3} className="px-5 py-2.5 text-sm font-bold text-text-primary text-right">Total</td>
                    <td className="px-5 py-2.5 text-right font-price font-bold text-brand-blue">₹{order.total_amount?.toLocaleString()}</td></tr>
                <tr><td colSpan={3} className="px-5 py-1.5 text-xs text-text-secondary text-right">Advance (50%)</td>
                    <td className="px-5 py-1.5 text-right font-price text-xs text-success">{order.advance_paid ? '✓ ' : ''}₹{order.advance_amount?.toLocaleString()}</td></tr>
                <tr><td colSpan={3} className="px-5 py-1.5 pb-3 text-xs text-text-secondary text-right">Balance</td>
                    <td className="px-5 py-1.5 pb-3 text-right font-price text-xs">{order.balance_paid ? '✓ Paid' : `₹${order.balance_amount?.toLocaleString()}`}</td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User size={16} className="text-text-tertiary" /> Customer
            </h2>
            <div className="space-y-2.5">
              <p className="font-semibold text-text-primary">{order.customer?.full_name ?? '—'}</p>
              {order.customer?.email && <p className="text-sm text-text-secondary">{order.customer.email}</p>}
              {order.customer?.phone && (
                <a href={`tel:${order.customer.phone}`} className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline">
                  <Phone size={13} /> {order.customer.phone}
                </a>
              )}
            </div>
          </div>

          {/* Delivery address */}
          {order.delivery_address && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-text-tertiary" /> Delivery Address
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {order.delivery_address.addressLine1}
                {order.delivery_address.addressLine2 && `, ${order.delivery_address.addressLine2}`}
                <br />{order.delivery_address.city}, {order.delivery_address.state} – {order.delivery_address.pincode}
              </p>
            </div>
          )}

          {/* Update status */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
            <h2 className="font-semibold text-text-primary">Update Status</h2>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus | '')}
              className="w-full h-10 px-3 rounded-lg border border-border bg-bg-secondary text-sm outline-none focus:border-brand-blue appearance-none">
              <option value="">Select new status…</option>
              {(Object.entries(STATUS_CONFIG) as [OrderStatus, { label: string }][]).map(([k, { label }]) => (
                <option key={k} value={k} disabled={k === order.status}>{label}{k === order.status ? ' (current)' : ''}</option>
              ))}
            </select>
            <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
              rows={2} placeholder="Add a note for this status change…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg-secondary text-sm outline-none focus:border-brand-blue resize-none" />
            <button onClick={handleUpdateStatus} disabled={!newStatus || saving}
              className="w-full h-10 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors shadow-glow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={14} className={saving ? 'animate-spin' : ''} />
              {saving ? 'Saving…' : 'Update Status'}
            </button>
          </div>

          {/* Customer note */}
          {order.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                <AlertCircle size={12} /> Customer Note
              </p>
              <p className="text-sm text-amber-800">{order.notes}</p>
            </div>
          )}

          {/* Admin notes */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
            <h2 className="font-semibold text-text-primary text-sm">Admin Notes</h2>
            <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
              rows={3} placeholder="Internal notes (not visible to customer)…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg-secondary text-sm outline-none focus:border-brand-blue resize-none" />
            <button onClick={handleSaveNote} disabled={saving}
              className="h-9 px-4 rounded-lg border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
              Save Note
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-2">
            <h2 className="font-semibold text-text-primary text-sm mb-3">Quick Actions</h2>

            {/* Send email actions */}
            <button
              onClick={async () => {
                setSaving(true)
                try {
                  const r = await fetch('/api/admin/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'confirmation', orderId: order.id }) })
                  const d = await r.json()
                  showToast(d.success ? 'Confirmation email sent!' : (d.error ?? 'Failed'), d.success ? 'success' : 'error')
                } catch { showToast('Failed to send email', 'error') } finally { setSaving(false) }
              }}
              disabled={saving}
              className="w-full flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-secondary transition-colors text-left">
              📧 Send Order Confirmation Email
            </button>

            <button
              onClick={async () => {
                setSaving(true)
                try {
                  const r = await fetch('/api/admin/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'dispatched', orderId: order.id }) })
                  const d = await r.json()
                  showToast(d.success ? 'Dispatch email sent!' : (d.error ?? 'Failed'), d.success ? 'success' : 'error')
                } catch { showToast('Failed to send email', 'error') } finally { setSaving(false) }
              }}
              disabled={saving}
              className="w-full flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-secondary transition-colors text-left">
              🚚 Send Dispatch Notification Email
            </button>

            <button
              onClick={async () => {
                setSaving(true)
                try {
                  const r = await fetch('/api/admin/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'quote', orderId: order.id }) })
                  const d = await r.json()
                  showToast(d.success ? 'Quote email sent!' : (d.error ?? 'Failed'), d.success ? 'success' : 'error')
                } catch { showToast('Failed to send email', 'error') } finally { setSaving(false) }
              }}
              disabled={saving}
              className="w-full flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-secondary transition-colors text-left">
              📄 Send Quote to Customer
            </button>

            {/* Payment link */}
            {!order.advance_paid && (
              <button
                onClick={async () => {
                  setSaving(true)
                  try {
                    const r = await fetch('/api/admin/payment-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, type: 'advance' }) })
                    const d = await r.json()
                    if (d.success) { showToast('Payment link created!', 'success'); window.open(d.url, '_blank') }
                    else showToast(d.error ?? 'Failed', 'error')
                  } catch { showToast('Failed', 'error') } finally { setSaving(false) }
                }}
                disabled={saving}
                className="w-full flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-sm font-semibold hover:bg-brand-blue/20 transition-colors">
                💳 Generate Advance Payment Link
              </button>
            )}
            {order.advance_paid && !order.balance_paid && (
              <button
                onClick={async () => {
                  setSaving(true)
                  try {
                    const r = await fetch('/api/admin/payment-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, type: 'balance' }) })
                    const d = await r.json()
                    if (d.success) { showToast('Balance payment link created!', 'success'); window.open(d.url, '_blank') }
                    else showToast(d.error ?? 'Failed', 'error')
                  } catch { showToast('Failed', 'error') } finally { setSaving(false) }
                }}
                disabled={saving}
                className="w-full flex items-center gap-2 h-9 px-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-sm font-semibold hover:bg-amber-100 transition-colors">
                💰 Generate Balance Payment Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
