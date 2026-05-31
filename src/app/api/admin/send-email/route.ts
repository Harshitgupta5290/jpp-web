import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send'
import { orderConfirmationEmail, orderDispatchedEmail, quoteEmail } from '@/lib/email/templates'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { type, orderId, ...extra } = body

    // Verify admin
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single() as any
    if ((profile as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch order + customer
    const { data: order } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email), order_items(product_name, quantity, unit_price, total_price)')
      .eq('id', orderId)
      .single() as any

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const customerEmail = (order as any).profiles?.email
    const customerName  = (order as any).profiles?.full_name ?? 'Valued Customer'

    if (!customerEmail) return NextResponse.json({ error: 'Customer has no email' }, { status: 400 })

    const items = ((order as any).order_items ?? []).map((i: any) => ({
      name: i.product_name ?? 'Product',
      qty: i.quantity ?? 0,
      unitPrice: i.unit_price ?? 0,
      total: i.total_price ?? 0,
    }))

    let html = ''
    let subject = ''

    if (type === 'confirmation') {
      html = orderConfirmationEmail({
        customerName,
        orderNumber: (order as any).order_number,
        items,
        total: (order as any).total_amount ?? 0,
        advance: (order as any).advance_amount ?? 0,
        balance: (order as any).balance_amount ?? 0,
        estimatedDelivery: (order as any).estimated_delivery ?? undefined,
      })
      subject = `Order Confirmed — ${(order as any).order_number} | Jawahar Printing Press`

    } else if (type === 'dispatched') {
      html = orderDispatchedEmail({
        customerName,
        orderNumber: (order as any).order_number,
        courierName: extra.courierName,
        trackingNumber: extra.trackingNumber,
        estimatedDelivery: (order as any).estimated_delivery ?? undefined,
      })
      subject = `Your order is dispatched — ${(order as any).order_number}`

    } else if (type === 'quote') {
      html = quoteEmail({
        customerName,
        orderNumber: (order as any).order_number,
        items,
        subtotal: (order as any).subtotal ?? 0,
        tax: (order as any).tax ?? 0,
        total: (order as any).total_amount ?? 0,
        validUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
        notes: extra.notes,
      })
      subject = `Your printing quote — ${(order as any).order_number} | Jawahar Printing Press`

    } else {
      return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
    }

    const result = await sendEmail({ to: customerEmail, subject, html })
    return NextResponse.json(result)

  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 })
  }
}
