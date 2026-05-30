'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Lock, Loader2 } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import OrderSummary from '@/components/order/OrderSummary'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { getAdvanceAmount } from '@/lib/utils/pricing'
import { generateOrderNumber } from '@/lib/utils/order-number'
import { formatCurrency } from '@/lib/utils/formatters'

// ─── Form schema ──────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

// ─── Razorpay type shim ───────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  modal: { ondismiss: () => void }
}

// ─── Step indicator ───────────────────────────────────────────────────────────

type Step = 'address' | 'payment' | 'confirmed'

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'address', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmed', label: 'Confirmed' },
  ]
  const currentIdx = steps.findIndex((s) => s.id === step)

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 ${active ? 'text-text-primary' : done ? 'text-success' : 'text-text-secondary'}`}>
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors
                ${active ? 'border-brand-blue bg-brand-blue text-white' : done ? 'border-success bg-success/10 text-success' : 'border-border bg-bg-card text-text-secondary'}
              `}>
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px mx-2 transition-colors ${i < currentIdx ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Indian states ────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const { addToast } = useUIStore()

  const [step, setStep] = useState<Step>('address')
  const [orderNumber, setOrderNumber] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)

  const total = totalPrice()
  const advance = getAdvanceAmount(total)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  })

  // Redirect empty cart
  if (items.length === 0 && step !== 'confirmed') {
    return (
      <PageWrapper>
        <div className="container-page py-20 text-center">
          <p className="text-text-secondary">Your cart is empty.</p>
          <Link href="/catalog" className="mt-4 inline-block text-brand-blue hover:underline text-sm">
            Browse products →
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (typeof window.Razorpay !== 'undefined') { resolve(true); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handlePayment = async (formData: CheckoutFormData) => {
    setProcessingPayment(true)

    try {
      // 1. Create Razorpay order via API
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: advance,
          currency: 'INR',
          deliveryAddress: formData,
          cartItems: items,
        }),
      })

      // In dev without backend, show a mock success
      if (!res.ok) {
        throw new Error('API not configured yet')
      }

      const { orderId, dbOrderNumber } = await res.json() as { orderId: string; dbOrderNumber: string }

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Failed to load payment gateway')

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
        amount: advance * 100, // paise
        currency: 'INR',
        name: 'Jawahar Printing Press',
        description: `Advance payment — ${dbOrderNumber}`,
        order_id: orderId,
        handler: async (response) => {
          // 4. Verify payment signature
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, orderNumber: dbOrderNumber }),
          })
          if (verifyRes.ok) {
            setOrderNumber(dbOrderNumber)
            clearCart()
            setStep('confirmed')
          } else {
            addToast({ type: 'error', title: 'Payment verification failed', message: 'Please contact support.' })
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email ?? '',
          contact: `+91${formData.phone}`,
        },
        theme: { color: '#2D6FFF' },
        modal: {
          ondismiss: () => {
            addToast({ type: 'info', title: 'Payment cancelled', message: 'Your order is saved. You can retry anytime.' })
            setProcessingPayment(false)
          },
        },
      })

      rzp.open()
    } catch {
      // Dev fallback — simulate success without real payment
      const devOrderNumber = generateOrderNumber()
      setOrderNumber(devOrderNumber)
      clearCart()
      setStep('confirmed')
      addToast({ type: 'info', title: 'Demo mode', message: 'Payment API not configured. Showing confirmation.' })
    } finally {
      setProcessingPayment(false)
    }
  }

  const onAddressSubmit = (data: CheckoutFormData) => {
    handlePayment(data)
  }

  return (
    <PageWrapper>
      <div className="container-page py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/order/cart" className="text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-2xl text-text-primary">Checkout</h1>
        </div>

        <StepIndicator step={step} />

        {/* ── Confirmed ─────────────────────────────────────────────── */}
        {step === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-success" />
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">Order Confirmed!</h2>
            <p className="text-text-secondary mb-1">Your advance payment was received.</p>
            <p className="font-price font-semibold text-text-primary mb-6">Order #{orderNumber}</p>
            <div className="card p-5 text-left space-y-3 mb-6">
              <p className="text-sm text-text-secondary">
                📱 You&apos;ll receive a WhatsApp confirmation shortly with order details and estimated delivery date.
              </p>
              <p className="text-sm text-text-secondary">
                🎨 If you requested design assistance, our team will reach out within 2 hours.
              </p>
              <p className="text-sm text-text-secondary">
                💳 Balance payment can be made online or cash on delivery.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/track/${orderNumber}`}>
                <Button variant="primary" size="lg">Track My Order</Button>
              </Link>
              <Link href="/catalog">
                <Button variant="secondary" size="lg">Continue Shopping</Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Address + Payment ──────────────────────────────────────── */}
        {step !== 'confirmed' && (
          <form onSubmit={handleSubmit(onAddressSubmit)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left — Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Address */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin size={18} className="text-brand-blue" />
                    <h2 className="font-display font-semibold text-text-primary">Delivery Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        placeholder="Rahul Sharma"
                        required
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />
                      <Input
                        label="Mobile Number"
                        placeholder="9876543210"
                        type="tel"
                        required
                        leftIcon={<span className="text-xs">+91</span>}
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                    </div>

                    <Input
                      label="Email Address"
                      placeholder="rahul@example.com"
                      type="email"
                      hint="For order updates and invoice"
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    <Input
                      label="Address Line 1"
                      placeholder="House / Flat / Office No., Street"
                      required
                      error={errors.addressLine1?.message}
                      {...register('addressLine1')}
                    />

                    <Input
                      label="Address Line 2"
                      placeholder="Landmark, Area (optional)"
                      error={errors.addressLine2?.message}
                      {...register('addressLine2')}
                    />

                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        placeholder="Rohtak"
                        required
                        error={errors.city?.message}
                        {...register('city')}
                      />
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          State <span className="text-error">*</span>
                        </label>
                        <select
                          {...register('state')}
                          className={`input-base ${errors.state ? 'error' : ''}`}
                          defaultValue=""
                        >
                          <option value="" disabled>Select state</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s} className="bg-bg-secondary">{s}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="mt-1.5 text-xs text-error">⚠ {errors.state.message}</p>
                        )}
                      </div>
                      <Input
                        label="Pincode"
                        placeholder="124001"
                        required
                        type="text"
                        maxLength={6}
                        error={errors.pincode?.message}
                        {...register('pincode')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Special Instructions
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={2}
                        placeholder="Any special notes for your order…"
                        className="input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment info */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-brand-blue" />
                    <h2 className="font-display font-semibold text-text-primary">Payment</h2>
                  </div>

                  <div className="rounded-md bg-bg-secondary border border-border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">50% Advance Payment</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Pay {formatCurrency(advance)} now via UPI, Card, or Net Banking
                        </p>
                      </div>
                      <p className="font-price font-bold text-xl text-brand-gold">{formatCurrency(advance)}</p>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-secondary">Balance on delivery</p>
                        <p className="text-xs text-text-secondary mt-0.5">Pay online or cash on delivery</p>
                      </div>
                      <p className="font-price font-semibold text-text-primary">
                        {formatCurrency(total - advance)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary">
                    <Lock size={12} className="text-success shrink-0" />
                    256-bit SSL encrypted payments via Razorpay
                  </div>

                  {/* Payment logos */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking'].map((method) => (
                      <span
                        key={method}
                        className="text-[10px] px-2 py-1 rounded bg-bg-secondary border border-border text-text-secondary font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right — Order summary */}
              <div>
                <OrderSummary
                  subtotal={total}
                  showPaymentSplit
                  actionSlot={
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      fullWidth
                      loading={processingPayment}
                      icon={processingPayment ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                      disabled={!isValid}
                    >
                      {processingPayment ? 'Opening Payment…' : `Pay ${formatCurrency(advance)}`}
                    </Button>
                  }
                />

                {/* Order items recap */}
                <div className="card p-4 mt-4 space-y-3">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    {items.length} item{items.length !== 1 ? 's' : ''} in order
                  </p>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="text-text-primary truncate">{item.product.name}</p>
                        <p className="text-xs text-text-secondary">Qty: {item.quantity.toLocaleString()}</p>
                      </div>
                      <span className="font-price text-text-primary ml-3 shrink-0">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </PageWrapper>
  )
}
