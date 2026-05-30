'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Printer } from 'lucide-react'
import AuthPanel from '@/components/auth/AuthPanel'
import { useUIStore } from '@/store/uiStore'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

function AuthInput({
  label, icon, error, ...props
}: {
  label: string
  icon: React.ReactNode
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 tracking-[0.12em] uppercase mb-2">
        {label}
      </label>
      <div
        className="relative flex items-center rounded-xl transition-all duration-200"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="absolute left-4 text-white/30 pointer-events-none">{icon}</div>
        <input
          className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:ring-0"
          style={{ caretColor: '#2D6FFF' }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export default function ForgotPasswordPage() {
  const { addToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentTo, setSentTo] = useState('')

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    addToast({ type: 'info', title: 'Supabase not configured', message: 'Add credentials to .env.local to enable password reset.' })
    setSentTo(data.email)
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-[45%_55%]" style={{ background: '#0A0F1E' }}>
      <AuthPanel />

      {/* Form side */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)', boxShadow: '0 0 20px rgba(45,111,255,0.35)' }}>
              <Printer size={17} className="text-white" strokeWidth={2.2} />
            </div>
            <span className="font-display font-bold text-xl text-white">Jawahar Printing Press</span>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                {/* Heading */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px w-6" style={{ background: 'linear-gradient(90deg, #2D6FFF, transparent)' }} />
                    <span className="text-xs font-semibold text-brand-blue tracking-[0.2em] uppercase">Recovery</span>
                  </div>
                  <h1 className="font-display font-bold text-3xl text-white leading-tight">
                    Reset password.
                  </h1>
                  <p className="text-sm text-white/40 mt-2 leading-relaxed">
                    Enter the email linked to your JPP account and we&apos;ll send a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <AuthInput
                    label="Email Address"
                    icon={<Mail size={16} />}
                    type="email"
                    placeholder="you@example.com"
                    autoFocus
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="relative w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    style={{
                      background: 'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)',
                      boxShadow: isValid ? '0 0 28px rgba(45,111,255,0.4)' : 'none',
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} />
                    {loading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 transition-colors">
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Success icon */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    boxShadow: '0 0 32px rgba(16,185,129,0.15)',
                  }}
                >
                  <CheckCircle size={36} className="text-emerald-400" />
                </div>

                <h2 className="font-display font-bold text-2xl text-white mb-3">Check your inbox.</h2>
                <p className="text-sm text-white/40 leading-relaxed mb-2">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-white/70 mb-8 font-mono">{sentTo}</p>

                <div
                  className="rounded-xl p-4 mb-8 text-left"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-xs text-white/35 leading-relaxed">
                    Didn&apos;t receive it? Check your spam folder or wait a few minutes. The link expires in 60 minutes.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-brand-blue hover:text-blue-400 font-semibold transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom nav */}
          <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
            <Link href="/" className="text-xs text-white/25 hover:text-white/50 transition-colors">
              ← Back to site
            </Link>
            <div className="flex gap-3">
              <Link href="/terms" className="text-xs text-white/25 hover:text-white/50 transition-colors">Terms</Link>
              <Link href="/privacy" className="text-xs text-white/25 hover:text-white/50 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
