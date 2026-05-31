import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { orderId, type } = await req.json() // type: 'advance' | 'balance'

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
    if ((profile as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: order } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email, phone)')
      .eq('id', orderId)
      .single() as any

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const amount = type === 'advance'
      ? ((order as any).advance_amount ?? Math.ceil((order as any).total_amount * 0.5))
      : ((order as any).balance_amount ?? Math.ceil((order as any).total_amount * 0.5))

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Return a mock link for dev/demo
      return NextResponse.json({
        success: true,
        url: `https://rzp.io/i/mock-${(order as any).order_number}`,
        amount,
        mock: true,
      })
    }

    const Razorpay = (await import('razorpay')).default
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

    const link = await (rzp as any).paymentLink.create({
      amount: amount * 100, // paise
      currency: 'INR',
      description: `${type === 'advance' ? 'Advance' : 'Balance'} payment for order ${(order as any).order_number}`,
      customer: {
        name: (order as any).profiles?.full_name ?? 'Customer',
        email: (order as any).profiles?.email ?? undefined,
        contact: (order as any).profiles?.phone ? `+91${(order as any).profiles.phone}` : undefined,
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      notes: { order_id: orderId, type },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/razorpay/verify`,
      callback_method: 'get',
    })

    // Record in payment_links table
    await (supabase as any).from('payment_links').insert({
      order_id: orderId,
      razorpay_payment_link_id: link.id,
      amount,
      type,
      status: 'pending',
      expires_at: link.expire_by ? new Date(link.expire_by * 1000).toISOString() : null,
    })

    return NextResponse.json({ success: true, url: link.short_url, amount })

  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 })
  }
}
