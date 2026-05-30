'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

const INFO = [
  { icon: Phone,  label: 'Phone',    value: '+91 99999 99999',                   href: 'tel:+919999999999' },
  { icon: Mail,   label: 'Email',    value: 'info@jawaharprintingpress.com',       href: 'mailto:info@jawaharprintingpress.com' },
  { icon: MapPin, label: 'Address',  value: 'Near Old Civil Hospital, Rohtak, Haryana 124001', href: null },
  { icon: Clock,  label: 'Hours',    value: 'Mon–Sat: 9 AM – 7 PM IST',           href: null },
]

export default function ContactPage() {
  const { addToast } = useUIStore()
  const [sending, setSending] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (_data: FormData) => {
    setSending(true)
    // Replace with actual Resend API call
    await new Promise((r) => setTimeout(r, 1000))
    addToast({ type: 'success', title: 'Message sent!', message: 'We\'ll get back to you within 2 hours.' })
    reset()
    setSending(false)
  }

  return (
    <PageWrapper>
      <section className="border-b border-border bg-bg-secondary/40">
        <div className="container-page py-12">
          <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-2">Get in Touch</p>
            <h1 className="font-display font-bold text-text-primary">Contact Us</h1>
            <p className="text-text-secondary mt-2 max-w-lg">
              Have a question or need a custom quote? We respond within 2 hours on business days.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-5">
            {INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-md bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-brand-blue" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{label}</p>
                  {href
                    ? <a href={href} className="text-sm text-text-primary hover:text-brand-blue transition-colors">{value}</a>
                    : <p className="text-sm text-text-primary">{value}</p>
                  }
                </div>
              </div>
            ))}

            <div className="pt-4">
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi! I have a query.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full h-11 px-4 rounded-md bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors text-sm font-medium justify-center"
              >
                WhatsApp — Fastest Response
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 card p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Your Name" placeholder="Rahul Sharma" required error={errors.name?.message} {...register('name')} />
              <Input label="Mobile" placeholder="9876543210" type="tel" required error={errors.phone?.message} {...register('phone')} />
            </div>
            <Input label="Email" placeholder="rahul@example.com" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Subject" placeholder="e.g. Quote for 1000 brochures" required error={errors.subject?.message} {...register('subject')} />
            <Textarea label="Message" placeholder="Tell us what you need…" rows={5} required error={errors.message?.message} {...register('message')} />
            <Button type="submit" variant="primary" size="lg" loading={sending} disabled={!isValid} icon={<Send size={16} />} className="w-full sm:w-auto">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </PageWrapper>
  )
}
