'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Printer } from 'lucide-react'
import AuthPanel from '@/components/auth/AuthPanel'
import { useUIStore } from '@/store/uiStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

function AuthInput({
  label, icon, error, rightElement, ...props
}: {
  label: string
  icon: React.ReactNode
  error?: string
  rightElement?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 tracking-[0.12em] uppercase mb-2">
        {label}
      </label>
      <div
        className="relative flex items-center rounded-xl transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="absolute left-4 text-white/30 pointer-events-none">
          {icon}
        </div>
        <input
          className="w-full h-12 bg-transparent pl-11 pr-11 text-sm text-white placeholder:text-white/25 outline-none focus:ring-0"
          style={{ caretColor: '#2D6FFF' }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export default function LoginPage() {
  const { addToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    addToast({ type: 'info', title: 'Supabase not configured', message: 'Add your credentials to .env.local to enable login.' })
    setLoading(false)
    console.log(data)
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-[45%_55%]" style={{ background: '#0A0F1E' }}>
      <AuthPanel />

      {/* Form side */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)', boxShadow: '0 0 20px rgba(45,111,255,0.35)' }}>
              <Printer size={17} className="text-white" strokeWidth={2.2} />
            </div>
            <span className="font-display font-bold text-xl text-white">Jawahar Printing Press</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6" style={{ background: 'linear-gradient(90deg, #2D6FFF, transparent)' }} />
              <span className="text-xs font-semibold text-brand-blue tracking-[0.2em] uppercase">Sign In</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white leading-tight">
              Welcome back.
            </h1>
            <p className="text-sm text-white/40 mt-2">
              Track your orders and manage your print account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              label="Email Address"
              icon={<Mail size={16} />}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <AuthInput
              label="Password"
              icon={<Lock size={16} />}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="p-1 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-white/40 hover:text-brand-blue transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="relative w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              style={{
                background: 'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)',
                boxShadow: isValid ? '0 0 28px rgba(45,111,255,0.4)' : 'none',
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} />
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs text-white/20">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p className="text-center text-sm text-white/40">
            New to JPP?{' '}
            <Link href="/register" className="text-brand-blue hover:text-blue-400 font-semibold transition-colors">
              Create a free account
            </Link>
          </p>

          {/* Bottom nav */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
            <Link href="/" className="text-xs text-white/25 hover:text-white/50 transition-colors">
              ← Back to site
            </Link>
            <div className="flex gap-3">
              <Link href="/terms" className="text-xs text-white/25 hover:text-white/50 transition-colors">Terms</Link>
              <Link href="/privacy" className="text-xs text-white/25 hover:text-white/50 transition-colors">Privacy</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
