'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, User, ChevronDown, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AdminTopBarProps {
  user: { full_name: string | null; email: string | null; role: string } | null
}

const BREADCRUMBS: Record<string, string> = {
  '/admin/dashboard':  'Dashboard',
  '/admin/products':   'Products',
  '/admin/categories': 'Categories',
  '/admin/pricing':    'Pricing Slabs',
  '/admin/orders':     'Orders',
  '/admin/customers':  'Customers',
  '/admin/reviews':    'Reviews',
  '/admin/messages':   'Enquiries',
  '/admin/settings':   'Settings',
  '/admin/analytics':  'Analytics',
}

export default function AdminTopBar({ user }: AdminTopBarProps) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const pageTitle = BREADCRUMBS[pathname] ??
    (pathname.startsWith('/admin/orders/') ? 'Order Detail' :
     pathname.startsWith('/admin/products/') ? 'Product' : 'Admin')

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'A'

  return (
    <header className="h-14 shrink-0 bg-white border-b border-border flex items-center justify-between px-6">
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/admin/dashboard" className="hover:text-text-primary transition-colors">Admin</Link>
        {pageTitle !== 'Dashboard' && (
          <>
            <span className="text-text-tertiary">/</span>
            <span className="font-semibold text-text-primary">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* View site */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-brand-blue border border-border hover:border-brand-blue/30 px-3 py-1.5 rounded-lg transition-all"
        >
          <ExternalLink size={12} /> View Site
        </Link>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-blue to-[#1a4fd8] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-text-primary leading-none">{user?.full_name ?? 'Admin'}</p>
              <p className="text-[10px] text-text-tertiary mt-0.5 leading-none">{user?.email ?? ''}</p>
            </div>
            <ChevronDown size={14} className={`text-text-tertiary transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-border rounded-xl shadow-large z-20 py-1 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-xs font-semibold text-text-primary">{user?.full_name ?? 'Admin'}</p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">{user?.email ?? ''}</p>
                </div>
                <Link href="/admin/settings" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
                  <User size={14} /> Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
