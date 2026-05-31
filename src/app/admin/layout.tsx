import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin Dashboard — JPP', template: '%s | JPP Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Skip auth in local dev without Supabase credentials
  const hasCreds = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let profile: { full_name: string | null; email: string | null; role: string } | null = null

  if (hasCreds) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login?redirectTo=/admin/dashboard')
    }

    const { data } = await supabase
      .from('profiles')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single() as any

    if (!data || (data as any).role !== 'admin') {
      redirect('/?error=unauthorized')
    }

    profile = data as any
  }

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminTopBar user={profile} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
