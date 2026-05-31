'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, MessageCircle, X, User, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CustomerRow {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  created_at: string
  order_count: number
  total_spent: number
  last_order: string | null
}

const MOCK_CUSTOMERS: CustomerRow[] = [
  { id: '1', full_name: 'Rahul Sharma',  email: 'rahul@example.com',  phone: '9876543210', created_at: new Date(Date.now()-8.64e7*30).toISOString(), order_count: 12, total_spent: 48200,  last_order: new Date(Date.now()-3.6e6).toISOString() },
  { id: '2', full_name: 'Priya Gupta',   email: 'priya@example.com',  phone: '9876543211', created_at: new Date(Date.now()-8.64e7*60).toISOString(), order_count: 8,  total_spent: 32800,  last_order: new Date(Date.now()-7.2e6).toISOString() },
  { id: '3', full_name: 'Amit Yadav',    email: 'amit@example.com',   phone: '9876543212', created_at: new Date(Date.now()-8.64e7*45).toISOString(), order_count: 5,  total_spent: 18900,  last_order: new Date(Date.now()-1.44e7).toISOString() },
  { id: '4', full_name: 'Sunita Devi',   email: 'sunita@example.com', phone: '9876543213', created_at: new Date(Date.now()-8.64e7*90).toISOString(), order_count: 3,  total_spent: 9200,   last_order: new Date(Date.now()-8.64e7).toISOString() },
  { id: '5', full_name: 'Vikram Singh',  email: 'vikram@example.com', phone: '9876543214', created_at: new Date(Date.now()-8.64e7*120).toISOString(),order_count: 22, total_spent: 112400, last_order: new Date(Date.now()-1.72e8).toISOString() },
  { id: '6', full_name: 'Meena Agarwal', email: 'meena@example.com',  phone: '9876543215', created_at: new Date(Date.now()-8.64e7*15).toISOString(), order_count: 1,  total_spent: 4800,   last_order: new Date(Date.now()-1.8e8).toISOString() },
]

function timeAgo(d: string | null) {
  if (!d) return '—'
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>(MOCK_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: profiles } = await (supabase as any)
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })

      if (profiles && (profiles as any[]).length > 0) {
        const ids = (profiles as any[]).map((p: any) => p.id)
        const { data: orders } = await (supabase as any)
          .from('orders')
          .select('customer_id, total_amount, created_at, advance_paid')
          .in('customer_id', ids)

        const statsMap: Record<string, { count: number; spent: number; last: string | null }> = {}
        for (const o of (orders as any[]) ?? []) {
          if (!o.customer_id) continue
          if (!statsMap[o.customer_id]) statsMap[o.customer_id] = { count: 0, spent: 0, last: null }
          statsMap[o.customer_id]!.count++
          if (o.advance_paid) statsMap[o.customer_id]!.spent += o.total_amount ?? 0
          if (!statsMap[o.customer_id]!.last || o.created_at > statsMap[o.customer_id]!.last!) {
            statsMap[o.customer_id]!.last = o.created_at
          }
        }

        setCustomers((profiles as any[]).map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          phone: p.phone,
          created_at: p.created_at,
          order_count: statsMap[p.id]?.count ?? 0,
          total_spent: statsMap[p.id]?.spent ?? 0,
          last_order: statsMap[p.id]?.last ?? null,
        })))
      }
    } catch { /* use mock */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return !q ||
      (c.full_name ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
  })

  const topCustomers = [...customers].sort((a, b) => b.total_spent - a.total_spent).slice(0, 3)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Customers</h1>
          <p className="text-sm text-text-secondary mt-0.5">{customers.length} registered customers</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50 self-start">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Top customers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCustomers.map(({ id, full_name, email, order_count, total_spent }, i) => (
          <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-[#1a4fd8] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {(full_name ?? email ?? 'U')[0]?.toUpperCase()}
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center">
                #{i + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text-primary text-sm truncate">{full_name ?? '—'}</p>
              <p className="text-xs text-text-secondary">{order_count} orders · ₹{total_spent.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full h-9 pl-9 pr-3 bg-white border border-border rounded-lg text-sm outline-none focus:border-brand-blue transition-all" />
        {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary"><X size={14} /></button>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Contact</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Orders</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total Spent</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Last Order</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-text-secondary text-sm">No customers found.</td></tr>
              ) : filtered.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-[#1a4fd8] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(c.full_name ?? c.email ?? 'U')[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{c.full_name ?? '—'}</p>
                        <p className="text-xs text-text-tertiary">{c.email ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-mono text-text-secondary">{c.phone ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-100">
                      <ShoppingBag size={10} /> {c.order_count}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-price font-semibold text-text-primary">
                    {c.total_spent > 0 ? `₹${c.total_spent.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-text-tertiary">{timeAgo(c.last_order)}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-text-tertiary">
                    {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3.5">
                    {c.phone && (
                      <a href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Hi ${c.full_name ?? ''}! This is Jawahar Printing Press.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                        title="WhatsApp customer">
                        <MessageCircle size={14} />
                      </a>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50">
          <p className="text-xs text-text-secondary">Showing {filtered.length} of {customers.length} customers</p>
        </div>
      </div>
    </div>
  )
}
