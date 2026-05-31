'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, RefreshCw, Eye, X, ChevronDown, Filter,
  ShoppingBag, CheckCircle, Truck, AlertCircle,
  Download, Square, CheckSquare, Save,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OrderStatus } from '@/types/database'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  pending_quote:    { label: 'Pending Quote',    color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  quote_sent:       { label: 'Quote Sent',        color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' },
  advance_pending:  { label: 'Advance Pending',   color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
  confirmed:        { label: 'Confirmed',          color: '#2D6FFF', bg: '#EFF6FF', border: '#BFDBFE' },
  processing:       { label: 'Processing',         color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  ready:            { label: 'Ready to Ship',      color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' },
  out_for_delivery: { label: 'Out for Delivery',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  delivered:        { label: 'Delivered',           color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  cancelled:        { label: 'Cancelled',           color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

const STATUS_GROUPS = {
  all:      { label: 'All Orders',   icon: ShoppingBag },
  pending:  { label: 'Needs Action', icon: AlertCircle },
  active:   { label: 'In Progress',  icon: Truck },
  done:     { label: 'Delivered',    icon: CheckCircle },
}

const PENDING_STATUSES: OrderStatus[] = ['pending_quote', 'quote_sent', 'advance_pending']
const ACTIVE_STATUSES:  OrderStatus[] = ['confirmed', 'processing', 'ready', 'out_for_delivery']

interface OrderRow {
  id: string
  order_number: string
  status: OrderStatus
  total_amount: number | null
  advance_paid: boolean
  balance_paid: boolean
  created_at: string
  customer_name: string | null
  customer_phone: string | null
}

const MOCK_ORDERS: OrderRow[] = [
  { id: '1', order_number: 'JPP-2024-247', status: 'processing',       total_amount: 4200,  advance_paid: true,  balance_paid: false, created_at: new Date(Date.now()-3.6e6).toISOString(),  customer_name: 'Rahul Sharma',  customer_phone: '9876543210' },
  { id: '2', order_number: 'JPP-2024-246', status: 'advance_pending',  total_amount: 12800, advance_paid: false, balance_paid: false, created_at: new Date(Date.now()-7.2e6).toISOString(),  customer_name: 'Priya Gupta',   customer_phone: '9876543211' },
  { id: '3', order_number: 'JPP-2024-245', status: 'confirmed',        total_amount: 6500,  advance_paid: true,  balance_paid: false, created_at: new Date(Date.now()-1.44e7).toISOString(), customer_name: 'Amit Yadav',    customer_phone: '9876543212' },
  { id: '4', order_number: 'JPP-2024-244', status: 'delivered',        total_amount: 9900,  advance_paid: true,  balance_paid: true,  created_at: new Date(Date.now()-8.64e7).toISOString(), customer_name: 'Sunita Devi',   customer_phone: '9876543213' },
  { id: '5', order_number: 'JPP-2024-243', status: 'out_for_delivery', total_amount: 3200,  advance_paid: true,  balance_paid: false, created_at: new Date(Date.now()-1.72e8).toISOString(),customer_name: 'Vikram Singh',  customer_phone: '9876543214' },
  { id: '6', order_number: 'JPP-2024-242', status: 'pending_quote',    total_amount: null,  advance_paid: false, balance_paid: false, created_at: new Date(Date.now()-1.8e8).toISOString(), customer_name: 'Meena Agarwal', customer_phone: '9876543215' },
  { id: '7', order_number: 'JPP-2024-241', status: 'ready',            total_amount: 7800,  advance_paid: true,  balance_paid: false, created_at: new Date(Date.now()-2.5e8).toISOString(), customer_name: 'Deepak Arora',  customer_phone: '9876543216' },
  { id: '8', order_number: 'JPP-2024-240', status: 'cancelled',        total_amount: 2100,  advance_paid: false, balance_paid: false, created_at: new Date(Date.now()-3.6e8).toISOString(), customer_name: 'Kavita Joshi',  customer_phone: '9876543217' },
]

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_CONFIG[status] ?? { label: status, color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' }
  return (
    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border"
      style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {c.label}
    </span>
  )
}

function formatCurrency(n: number | null) {
  if (n === null) return '—'
  return `₹${n.toLocaleString('en-IN')}`
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>(MOCK_ORDERS)
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState<keyof typeof STATUS_GROUPS>('all')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Bulk ops state
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | ''>('')
  const [bulkSaving, setBulkSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, advance_paid, balance_paid, created_at, profiles(full_name, phone)')
        .order('created_at', { ascending: false })
        .limit(100)

      if (data && data.length > 0) {
        setOrders(data.map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          status: o.status,
          total_amount: o.total_amount,
          advance_paid: o.advance_paid,
          balance_paid: o.balance_paid,
          created_at: o.created_at,
          customer_name: o.profiles?.full_name ?? null,
          customer_phone: o.profiles?.phone ?? null,
        })))
      }
    } catch { /* use mock */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.order_number.toLowerCase().includes(q) || (o.customer_name ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchGroup =
      group === 'all'     ? true :
      group === 'pending' ? PENDING_STATUSES.includes(o.status) :
      group === 'active'  ? ACTIVE_STATUSES.includes(o.status) :
      group === 'done'    ? o.status === 'delivered' : true
    return matchSearch && matchStatus && matchGroup
  })

  const groupCounts = {
    all:     orders.length,
    pending: orders.filter(o => PENDING_STATUSES.includes(o.status)).length,
    active:  orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length,
    done:    orders.filter(o => o.status === 'delivered').length,
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id))

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelected((s) => { const n = new Set(s); filtered.forEach((o) => n.delete(o.id)); return n })
    } else {
      setSelected((s) => { const n = new Set(s); filtered.forEach((o) => n.add(o.id)); return n })
    }
  }

  const toggleOne = (id: string) => {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) { n.delete(id) } else { n.add(id) }
      return n
    })
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selected.size === 0) return
    setBulkSaving(true)
    try {
      const supabase = createClient()
      const ids = Array.from(selected)
      const { error } = await (supabase as any)
        .from('orders')
        .update({ status: bulkStatus, updated_at: new Date().toISOString() })
        .in('id', ids)
      if (error) throw error
      setOrders((prev) => prev.map((o) => selected.has(o.id) ? { ...o, status: bulkStatus as OrderStatus } : o))
      setSelected(new Set())
      setBulkStatus('')
      showToast(`Updated ${ids.length} order${ids.length > 1 ? 's' : ''} to ${STATUS_CONFIG[bulkStatus as OrderStatus]?.label}`, 'success')
    } catch {
      showToast('Bulk update failed', 'error')
    } finally { setBulkSaving(false) }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/export-orders?${params}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jpp-orders-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      showToast('Export failed', 'error')
    } finally { setExporting(false) }
  }

  return (
    <div className="p-6 space-y-5">
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}>
          {toast.msg}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Orders</h1>
          <p className="text-sm text-text-secondary mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50">
            <Download size={14} className={exporting ? 'animate-spin' : ''} />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.entries(STATUS_GROUPS) as [keyof typeof STATUS_GROUPS, { label: string; icon: React.ElementType }][]).map(([key, { label, icon: Icon }]) => (
          <button key={key} onClick={() => { setGroup(key); setStatusFilter('all'); setSelected(new Set()) }}
            className={`flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all ${
              group === key
                ? 'bg-brand-blue text-white shadow-glow-sm'
                : 'bg-white border border-border text-text-secondary hover:border-brand-blue/30 hover:text-brand-blue'
            }`}>
            <Icon size={14} />
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${group === key ? 'bg-white/20 text-white' : 'bg-bg-secondary text-text-tertiary'}`}>
              {groupCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order # or customer…"
            className="w-full h-9 pl-9 pr-3 bg-white border border-border rounded-lg text-sm outline-none focus:border-brand-blue transition-all" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary"><X size={14} /></button>}
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | 'all'); setSelected(new Set()) }}
            className="h-9 pl-8 pr-8 bg-white border border-border rounded-lg text-sm text-text-secondary outline-none focus:border-brand-blue appearance-none cursor-pointer">
            <option value="all">All Statuses</option>
            {(Object.entries(STATUS_CONFIG) as [OrderStatus, { label: string }][]).map(([k, { label }]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-brand-blue">{selected.size} selected</span>
              <div className="flex-1" />
              <div className="relative">
                <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value as OrderStatus | '')}
                  className="h-8 pl-3 pr-8 bg-white border border-border rounded-lg text-sm text-text-secondary outline-none focus:border-brand-blue appearance-none cursor-pointer">
                  <option value="">Change status to…</option>
                  {(Object.entries(STATUS_CONFIG) as [OrderStatus, { label: string }][]).map(([k, { label }]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              </div>
              <button onClick={handleBulkStatusUpdate} disabled={!bulkStatus || bulkSaving}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:bg-[#1a5ce8] transition-colors disabled:opacity-50">
                <Save size={12} className={bulkSaving ? 'animate-spin' : ''} />
                Apply
              </button>
              <button onClick={() => setSelected(new Set())}
                className="h-8 px-3 rounded-lg border border-border text-xs font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleAll} className="flex items-center justify-center text-text-tertiary hover:text-brand-blue transition-colors">
                    {allFilteredSelected ? <CheckSquare size={15} className="text-brand-blue" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Order #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Payment</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Amount</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-text-secondary text-sm">No orders found.</td></tr>
              ) : filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`transition-colors ${selected.has(order.id) ? 'bg-blue-50/60' : 'hover:bg-bg-secondary/50'}`}
                >
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleOne(order.id)} className="flex items-center justify-center text-text-tertiary hover:text-brand-blue transition-colors">
                      {selected.has(order.id) ? <CheckSquare size={15} className="text-brand-blue" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs font-bold text-brand-blue hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-text-primary">{order.customer_name ?? '—'}</p>
                    {order.customer_phone && <p className="text-[11px] text-text-tertiary font-mono">{order.customer_phone}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${order.advance_paid ? 'bg-emerald-50 text-emerald-600' : 'bg-bg-muted text-text-tertiary'}`}>
                        ADV {order.advance_paid ? '✓' : '✗'}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${order.balance_paid ? 'bg-emerald-50 text-emerald-600' : 'bg-bg-muted text-text-tertiary'}`}>
                        BAL {order.balance_paid ? '✓' : '✗'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-price font-semibold text-text-primary">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-text-tertiary whitespace-nowrap">
                    {timeAgo(order.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${order.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors">
                      <Eye size={14} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50 flex items-center justify-between">
          <p className="text-xs text-text-secondary">Showing {filtered.length} of {orders.length} orders</p>
          {selected.size > 0 && (
            <p className="text-xs text-brand-blue font-semibold">{selected.size} selected</p>
          )}
        </div>
      </div>
    </div>
  )
}
