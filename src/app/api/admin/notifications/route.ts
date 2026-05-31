import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ count: 0 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
    if ((profile as any)?.role !== 'admin') return NextResponse.json({ count: 0 })

    // Count orders that need attention (new / pending states) in last 24h
    const since = new Date(Date.now() - 86400000).toISOString()
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending_quote', 'advance_pending'])
      .gte('created_at', since) as any

    return NextResponse.json({ count: count ?? 0 })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
