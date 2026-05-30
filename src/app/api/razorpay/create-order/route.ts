import { NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils/order-number'

export async function POST(request: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay not configured' }, { status: 503 })
  }

  const body = await request.json() as { amount: number; currency: string }
  const { amount, currency = 'INR' } = body

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: generateOrderNumber(),
    }),
  })

  if (!rzpRes.ok) {
    const err = await rzpRes.json() as { error?: { description?: string } }
    return NextResponse.json(
      { error: err.error?.description ?? 'Failed to create Razorpay order' },
      { status: 502 }
    )
  }

  const rzpOrder = await rzpRes.json() as { id: string }
  const dbOrderNumber = generateOrderNumber()

  return NextResponse.json({ orderId: rzpOrder.id, dbOrderNumber })
}
