'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, MessageCircle, Phone, Mail, Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OrderStatus } from '@/types/database'

const STATUS_COLOR: Record<OrderStatus, { color: string; bg: string }> = {
  pending_quote:    { color: '#D97706', bg: '#FEF3C7' },
  quote_sent:       { color: '#7C3AED', bg: '#EDE9FE' },
  advance_pending:  { color: '#EA580C', bg: '#FFF7ED' },
  confirmed:        { color: '#2D6FFF', bg: '#EFF6FF' },
  processing:       { color: '#7C3AED', bg: '#F5F3FF' },
  ready:            { color: '#0EA5E9', bg: '#F0F9FF' },
  out_for_delivery: { color: '#D97706', bg: '#FFFBEB' },
  delivered:        { color: '#059669', bg: '#ECFDF5' },
  cancelled:        { color: '#DC2626', bg: '#FEF2F2' },
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_quote: 'Pending Quote', quote_sent: 'Quote Sent', advance_pending: 'Advance Pending',
  confirmed: 'Confirmed', processing: 'Processing', ready: 'Ready', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
}

interface CustomerData {
  id: string; full_name: string | null; email: string | null; phone: string | null
  created_at: string; orders: {
    id: string; order_number: string; status: OrderStatus; total_amount: number | null
    advance_paid: boolean; balance_paid: boolean; created_at: string
  }[]
}

const MOCK: CustomerData = {
  id: '1', full_name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543214',
  created_at: new Date(Date.now() - 8.64e7 * 365).toISOString(),
  orders: [
    { id: 'o1', order_number: 'JPP-2024-247', status: 'processing',      total_amount: 4200,  advance_paid: true, balance_paid: false, created_at: new Date(Date.now()-3.6e6).toISOString() },
    { id: 'o2', order_number: 'JPP-2024-218', status: 'delivered',        total_amount: 12800, advance_paid: true, balance_paid: true,  created_at: new Date(Date.now()-8.64e7).toISOString() },
    { id: 'o3', order_number: 'JPP-2024-192', status: 'delivered',        total_amount: 6500,  advance_paid: true, balance_paid: true,  created_at: new Date(Date.now()-1.72e8).toISOString() },
    { id: 'o4', order_number: 'JPP-2024-165', status: 'delivered',        total_amount: 9900,  advance_paid: true, balance_paid: true,  created_at: new Date(Date.now()-2.58e8).toISOString() },
    { id: 'o5', order_number: 'JPP-2024-140', status: 'cancelled',        total_amount: 3200,  advance_paid: false, balance_paid: false, created_at: new Date(Date.now()-3.45e8).toISOString() },
  ],
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<CustomerData | null>(MOCK)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const supabase = createClient()
        const [{ data: profile }, { data: orders }] = await Promise.all([
          (supabase as any).from('profiles').select('*').eq('id', id).single(),
          (supabase as any).from('orders').select('id,order_number,status,total_amount,advance_paid,balance_paid,created_at').eq('customer_id', id).order('created_at', { ascending: false }),
        ])
        if (profile) setCustomer({ ...profile, orders: orders ?? [] })
      } catch { /* use mock */ }
    }
    load()
  }, [id])

  if (!customer) return <div className="p-6 text-text-secondary text-sm">Loading…</div>

  const totalSpent = customer.orders.filter(o => o.advance_paid).reduce((s, o) => s + (o.total_amount ?? 0), 0)
  const deliveredOrders = customer.orders.filter(o => o.status === 'delivered').length
  const initials = (customer.full_name ?? customer.email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="p-6 max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display font-bold text-2xl text-text-primary">Customer Profile</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-blue to-[#1a4fd8] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
              {initials}
            </div>
            <h2 className="font-display font-bold text-lg text-text-primary">{customer.full_name ?? '—'}</h2>
            <p className="text-sm text-text-secondary mt-0.5">{customer.email}</p>
            {customer.phone && (
              <p className="text-sm text-text-secondary font-mono">{customer.phone}</p>
            )}
            <p className="text-xs text-text-tertiary mt-2 flex items-center justify-center gap-1">
              <Calendar size={11} />
              Customer since {new Date(customer.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex gap-2 mt-4">
              {customer.phone && (
                <a href={`https://wa.me/91${customer.phone}?text=${encodeURIComponent(`Hi ${customer.full_name ?? ''}! This is Jawahar Printing Press.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle size={13} /> WhatsApp
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-blue-50 text-brand-blue border border-blue-100 text-xs font-semibold hover:bg-blue-100 transition-colors">
                  <Mail size={13} /> Email
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide">Lifetime Stats</h3>
            {[
              { label: 'Total Orders', value: customer.orders.length.toString(), icon: ShoppingBag, color: '#2D6FFF' },
              { label: 'Delivered', value: deliveredOrders.toString(), icon: ShoppingBag, color: '#10B981' },
              { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#F5A500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon size={13} style={{ color }} strokeWidth={1.8} />
                  </div>
                  <span className="text-sm text-text-secondary">{label}</span>
                </div>
                <span className="font-price font-bold text-sm text-text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order history */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Order History</h2>
            <span className="text-xs text-text-tertiary">{customer.orders.length} orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Order #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Paid</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Amount</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customer.orders.map((order, i) => {
                  const cfg = STATUS_COLOR[order.status] ?? { color: '#64748B', bg: '#F8FAFC' }
                  return (
                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-bold text-brand-blue hover:underline">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                          {STATUS_LABEL[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${order.advance_paid && order.balance_paid ? 'bg-emerald-50 text-emerald-600' : order.advance_paid ? 'bg-blue-50 text-brand-blue' : 'bg-bg-muted text-text-tertiary'}`}>
                          {order.advance_paid && order.balance_paid ? 'Full' : order.advance_paid ? 'Advance' : 'None'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-price font-semibold text-text-primary">
                        {order.total_amount ? `₹${order.total_amount.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-text-tertiary whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </motion.tr>
                  )
                })}
                {customer.orders.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-text-secondary text-sm">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
