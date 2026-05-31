'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle,
  ArrowRight, AlertCircle, Truck, BarChart2, RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OrderStatus } from '@/types/database'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalOrders: number
  pendingOrders: number
  revenue: number
  customers: number
  activeProducts: number
  ordersToday: number
}

interface RecentOrder {
  id: string
  order_number: string
  status: OrderStatus
  total_amount: number | null
  created_at: string
  customer_name: string | null
  customer_email: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending_quote:    { label: 'Pending Quote',   color: '#F59E0B', bg: '#FEF3C7' },
  quote_sent:       { label: 'Quote Sent',       color: '#6366F1', bg: '#EEF2FF' },
  advance_pending:  { label: 'Advance Pending',  color: '#F97316', bg: '#FFF7ED' },
  confirmed:        { label: 'Confirmed',         color: '#2D6FFF', bg: '#EFF6FF' },
  processing:       { label: 'Processing',        color: '#8B5CF6', bg: '#F5F3FF' },
  ready:            { label: 'Ready',             color: '#0EA5E9', bg: '#F0F9FF' },
  out_for_delivery: { label: 'Out for Delivery',  color: '#F5A500', bg: '#FFFBEB' },
  delivered:        { label: 'Delivered',         color: '#10B981', bg: '#ECFDF5' },
  cancelled:        { label: 'Cancelled',         color: '#EF4444', bg: '#FEF2F2' },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#64748B', bg: '#F8FAFC' }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  )
}

function formatCurrency(n: number | null) {
  if (n === null) return '—'
  return `₹${n.toLocaleString('en-IN')}`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Mock data fallback ────────────────────────────────────────────────────────

const MOCK_STATS: Stats = {
  totalOrders: 247, pendingOrders: 12, revenue: 184500,
  customers: 189, activeProducts: 24, ordersToday: 8,
}

const MOCK_RECENT: RecentOrder[] = [
  { id: '1', order_number: 'JPP-2024-247', status: 'processing',       total_amount: 4200,  created_at: new Date(Date.now() - 3600000).toISOString(),  customer_name: 'Rahul Sharma',  customer_email: 'rahul@example.com' },
  { id: '2', order_number: 'JPP-2024-246', status: 'advance_pending',  total_amount: 12800, created_at: new Date(Date.now() - 7200000).toISOString(),  customer_name: 'Priya Gupta',   customer_email: 'priya@example.com' },
  { id: '3', order_number: 'JPP-2024-245', status: 'confirmed',        total_amount: 6500,  created_at: new Date(Date.now() - 14400000).toISOString(), customer_name: 'Amit Yadav',    customer_email: 'amit@example.com' },
  { id: '4', order_number: 'JPP-2024-244', status: 'delivered',        total_amount: 9900,  created_at: new Date(Date.now() - 86400000).toISOString(), customer_name: 'Sunita Devi',   customer_email: 'sunita@example.com' },
  { id: '5', order_number: 'JPP-2024-243', status: 'out_for_delivery', total_amount: 3200,  created_at: new Date(Date.now() - 172800000).toISOString(),customer_name: 'Vikram Singh',  customer_email: 'vikram@example.com' },
]

const ORDER_STATUS_BREAKDOWN = [
  { status: 'pending_quote' as OrderStatus,   count: 4, revenue: 0 },
  { status: 'advance_pending' as OrderStatus, count: 8, revenue: 24000 },
  { status: 'processing' as OrderStatus,      count: 15, revenue: 68000 },
  { status: 'out_for_delivery' as OrderStatus,count: 6, revenue: 22000 },
  { status: 'delivered' as OrderStatus,       count: 214, revenue: 890000 },
]

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color, delay = 0,
}: {
  label: string; value: string; sub?: string
  icon: React.ElementType; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4 hover:shadow-medium transition-shadow"
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={20} style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <p className="font-display font-bold text-2xl text-text-primary mt-0.5">{value}</p>
        {sub && <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS)
  const [recent, setRecent] = useState<RecentOrder[]>(MOCK_RECENT)
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      const [
        { count: totalOrders },
        { count: pendingOrders },
        { data: revenueData },
        { count: customers },
        { count: activeProducts },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true })
          .in('status', ['pending_quote', 'advance_pending', 'confirmed', 'processing']),
        supabase.from('orders').select('total_amount').eq('advance_paid', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ])

      const revenue = (revenueData as any[])?.reduce((sum: number, o: any) => sum + (o.total_amount ?? 0), 0) ?? 0

      const today = new Date().toISOString().split('T')[0]!
      const { count: ordersToday } = await supabase
        .from('orders').select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      if (totalOrders !== null) {
        setStats({
          totalOrders: totalOrders ?? 0,
          pendingOrders: pendingOrders ?? 0,
          revenue,
          customers: customers ?? 0,
          activeProducts: activeProducts ?? 0,
          ordersToday: ordersToday ?? 0,
        })
      }

      // Recent orders
      const { data: recentRaw } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(10)

      if (recentRaw && recentRaw.length > 0) {
        setRecent(recentRaw.map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          status: o.status,
          total_amount: o.total_amount,
          created_at: o.created_at,
          customer_name: o.profiles?.full_name ?? null,
          customer_email: o.profiles?.email ?? null,
        })))
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Orders"    value={stats.totalOrders.toString()}    sub="All time"              icon={ShoppingBag} color="#2D6FFF" delay={0} />
        <StatCard label="Pending Action"  value={stats.pendingOrders.toString()}   sub="Need your attention"  icon={AlertCircle} color="#F59E0B" delay={0.05} />
        <StatCard label="Total Revenue"   value={`₹${(stats.revenue/1000).toFixed(0)}K`}  sub="Advance collected" icon={TrendingUp} color="#10B981" delay={0.1} />
        <StatCard label="Customers"       value={stats.customers.toString()}        sub="Registered users"    icon={Users}       color="#8B5CF6" delay={0.15} />
        <StatCard label="Active Products" value={stats.activeProducts.toString()}   sub="In catalog"          icon={Package}     color="#0EA5E9" delay={0.2} />
        <StatCard label="Orders Today"    value={stats.ordersToday.toString()}      sub="Since midnight"      icon={Clock}       color="#EC4899" delay={0.25} />
      </div>

      {/* Main content: orders + breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent orders table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-text-primary">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-brand-blue font-semibold hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Order</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Customer</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Amount</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs font-semibold text-brand-blue hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-medium text-text-primary truncate max-w-[120px]">{order.customer_name ?? '—'}</p>
                      <p className="text-[11px] text-text-tertiary truncate">{order.customer_email ?? ''}</p>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 text-right font-price font-semibold text-text-primary text-xs">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-text-tertiary">
                      {timeAgo(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Order status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-text-primary">Order Breakdown</h2>
            <BarChart2 size={16} className="text-text-tertiary" />
          </div>
          <div className="space-y-3">
            {ORDER_STATUS_BREAKDOWN.map(({ status, count }) => {
              const cfg = STATUS_CONFIG[status]
              const pct = Math.round((count / stats.totalOrders) * 100) || 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-secondary">{cfg?.label}</span>
                    <span className="text-xs font-bold text-text-primary">{count}</span>
                  </div>
                  <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: cfg?.color }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick actions */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">Quick Actions</p>
            {[
              { href: '/admin/products/new',   label: 'Add New Product',    icon: Package,     color: '#2D6FFF' },
              { href: '/admin/orders',          label: 'Manage Orders',      icon: ShoppingBag, color: '#10B981' },
              { href: '/admin/customers',       label: 'View Customers',     icon: Users,       color: '#8B5CF6' },
            ].map(({ href, label, icon: Icon, color }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-secondary transition-colors group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}15` }}>
                  <Icon size={14} style={{ color }} strokeWidth={1.8} />
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary font-medium transition-colors">{label}</span>
                <ArrowRight size={13} className="ml-auto text-text-tertiary opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Urgent orders alert */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 p-4 rounded-2xl border border-amber-200 bg-amber-50"
        >
          <AlertCircle size={18} className="text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {stats.pendingOrders} orders need your attention
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Orders are waiting for quote approval, payment confirmation, or dispatch.
            </p>
          </div>
          <Link href="/admin/orders?filter=pending"
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shrink-0">
            <Truck size={13} /> View Orders
          </Link>
        </motion.div>
      )}
    </div>
  )
}
