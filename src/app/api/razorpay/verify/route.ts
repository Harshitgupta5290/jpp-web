import { NextResponse } from 'next/server'
import crypto from 'crypto'

interface VerifyPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  orderNumber: string
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const body = await request.json() as VerifyPayload
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
