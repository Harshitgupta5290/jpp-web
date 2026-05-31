import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0]!)
  const lines = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(',')),
  ]
  return lines.join('\n')
}

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
    if ((profile as any)?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const from   = url.searchParams.get('from')
    const to     = url.searchParams.get('to')

    let query = supabase
      .from('orders')
      .select('order_number, status, total_amount, advance_paid, balance_paid, created_at, updated_at, estimated_delivery, notes, profiles(full_name, email, phone)')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status) as any
    if (from)   query = query.gte('created_at', from) as any
    if (to)     query = query.lte('created_at', to) as any

    const { data: orders } = await query as any

    const rows = ((orders ?? []) as any[]).map((o: any) => ({
      'Order Number':    o.order_number,
      'Status':          o.status,
      'Customer Name':   o.profiles?.full_name ?? '',
      'Customer Email':  o.profiles?.email ?? '',
      'Customer Phone':  o.profiles?.phone ?? '',
      'Total Amount':    o.total_amount ?? '',
      'Advance Paid':    o.advance_paid ? 'Yes' : 'No',
      'Balance Paid':    o.balance_paid ? 'Yes' : 'No',
      'Created At':      o.created_at ? new Date(o.created_at).toLocaleString('en-IN') : '',
      'Updated At':      o.updated_at ? new Date(o.updated_at).toLocaleString('en-IN') : '',
      'Est. Delivery':   o.estimated_delivery ? new Date(o.estimated_delivery).toLocaleDateString('en-IN') : '',
      'Customer Note':   o.notes ?? '',
    }))

    const csv = toCSV(rows)
    const filename = `jpp-orders-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (err: any) {
    return new NextResponse(err?.message ?? 'Internal error', { status: 500 })
  }
}
