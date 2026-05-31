'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Package, Layers, ShoppingBag, Users,
  Star, Settings, Printer, ChevronLeft, ChevronRight,
  Tag, BarChart3, MessageSquare,
} from 'lucide-react'

const NAV = [
  {
    section: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics',   icon: BarChart3 },
    ],
  },
  {
    section: 'Catalog',
    items: [
      { href: '/admin/products',   label: 'Products',    icon: Package },
      { href: '/admin/categories', label: 'Categories',  icon: Layers },
      { href: '/admin/pricing',    label: 'Pricing',     icon: Tag },
    ],
  },
  {
    section: 'Sales',
    items: [
      { href: '/admin/orders',    label: 'Orders',     icon: ShoppingBag },
      { href: '/admin/customers', label: 'Customers',  icon: Users },
    ],
  },
  {
    section: 'Content',
    items: [
      { href: '/admin/reviews',  label: 'Reviews',  icon: Star },
      { href: '/admin/messages', label: 'Enquiries', icon: MessageSquare },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex flex-col h-screen shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
      style={{ background: '#0F172A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b shrink-0 ${collapsed ? 'justify-center px-2' : ''}`}
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shrink-0 shadow-glow-sm">
          <Printer size={16} className="text-white" strokeWidth={2.2} />
        </div>
        {!collapsed && (
          <div className="leading-none min-w-0">
            <span className="font-display font-bold text-white text-base block">JPP Admin</span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase">Press Dashboard</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-5">
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] px-4 mb-1.5">{section}</p>
            )}
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-3 mx-2 mb-0.5 rounded-lg transition-all duration-150 ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'} ${
                    active
                      ? 'bg-brand-blue text-white shadow-[0_0_12px_rgba(45,111,255,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                  {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`w-full flex items-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg py-2 transition-colors ${collapsed ? 'justify-center px-2' : 'gap-2 px-3'}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
