'use client'

import { useState } from 'react'
import { TrendingUp, ShoppingBag, Users, Package, BarChart2, ArrowUp, ArrowDown } from 'lucide-react'

const MONTHLY = [
  { month: 'Nov', orders: 18, revenue: 68400 },
  { month: 'Dec', orders: 24, revenue: 92100 },
  { month: 'Jan', orders: 31, revenue: 118600 },
  { month: 'Feb', orders: 28, revenue: 107200 },
  { month: 'Mar', orders: 35, revenue: 134500 },
  { month: 'Apr', orders: 42, revenue: 161800 },
  { month: 'May', orders: 38, revenue: 145200 },
]

const TOP_PRODUCTS = [
  { name: 'Standard Business Cards', orders: 89, revenue: 45600, pct: 100 },
  { name: 'A4 Tri-Fold Brochure',    orders: 64, revenue: 38400, pct: 84 },
  { name: 'Outdoor Flex Banner',     orders: 51, revenue: 31200, pct: 68 },
  { name: 'Classic Wedding Invitation', orders: 38, revenue: 22800, pct: 50 },
  { name: 'Corporate Letterhead',    orders: 29, revenue: 14500, pct: 32 },
]

const maxRevenue = Math.max(...MONTHLY.map(m => m.revenue))

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('3m')

  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0)
  const totalOrders  = MONTHLY.reduce((s, m) => s + m.orders, 0)
  const avgOrderValue = Math.round(totalRevenue / totalOrders)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Analytics</h1>
          <p className="text-sm text-text-secondary mt-0.5">Revenue and order performance overview</p>
        </div>
        <div className="flex gap-1.5 bg-bg-secondary border border-border rounded-xl p-1">
          {(['7d','30d','3m','1y'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-white shadow text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue/1000).toFixed(0)}K`, change: '+18%', up: true, icon: TrendingUp, color: '#10B981' },
          { label: 'Total Orders',  value: totalOrders.toString(), change: '+12%', up: true, icon: ShoppingBag, color: '#2D6FFF' },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toLocaleString('en-IN')}`, change: '+5%', up: true, icon: BarChart2, color: '#8B5CF6' },
          { label: 'New Customers', value: '47', change: '-3%', up: false, icon: Users, color: '#F5A500' },
        ].map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} strokeWidth={1.8} />
              </div>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${up ? 'text-success' : 'text-error'}`}>
                {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {change}
              </span>
            </div>
            <p className="font-display font-bold text-2xl text-text-primary">{value}</p>
            <p className="text-xs text-text-secondary mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-text-primary">Revenue Over Time</h2>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-blue inline-block" />Revenue</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3 h-40">
          {MONTHLY.map(({ month, revenue }) => {
            const h = Math.round((revenue / maxRevenue) * 100)
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full relative flex items-end" style={{ height: '130px' }}>
                  <div
                    className="w-full rounded-t-lg bg-brand-blue/20 group-hover:bg-brand-blue transition-colors duration-200 relative cursor-default"
                    style={{ height: `${h}%` }}
                    title={`₹${revenue.toLocaleString('en-IN')}`}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-blue whitespace-nowrap">
                      ₹{(revenue/1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <span className="text-xs text-text-tertiary">{month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-text-primary flex items-center gap-2"><Package size={16} className="text-text-tertiary" />Top Products</h2>
        </div>
        <div className="space-y-4">
          {TOP_PRODUCTS.map(({ name, orders, revenue, pct }, i) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-tertiary w-4">#{i+1}</span>
                  <span className="text-sm font-medium text-text-primary">{name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-text-primary">₹{revenue.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-text-tertiary ml-2">{orders} orders</span>
                </div>
              </div>
              <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-brand-blue transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
