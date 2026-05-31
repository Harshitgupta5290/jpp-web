'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'What is the minimum order quantity?',
    a: "Most products start from 100 pieces. Some products like banners and roll-ups have no minimum — you can order even 1 piece. Business cards start from 100 pcs, brochures from 100 pcs, and packaging from 50 units. For smaller quantities, use our digital printing service.",
  },
  {
    q: 'How do I send my design/artwork?',
    a: 'Upload your file (PDF, AI, PSD, PNG, JPG) directly on the product page or send it via WhatsApp. We accept print-ready files at 300 DPI with 3mm bleed. If you don\'t have print-ready artwork, our in-house design team will help you prepare it for free.',
  },
  {
    q: 'What are your payment terms?',
    a: "We collect 50% advance to confirm your order and begin production. The remaining 50% is due before dispatch (or on delivery for local Rohtak orders). We accept all UPI apps, credit/debit cards, net banking, and cash via Razorpay.",
  },
  {
    q: 'How long does printing and delivery take?',
    a: "Standard products take 3–5 business days from artwork approval. Express orders placed before 12 PM are dispatched same day. Pan-India courier delivery adds 1–3 business days depending on location. We'll share a tracking link as soon as your order ships.",
  },
  {
    q: 'Do you deliver across India?',
    a: "Yes! We deliver to all 28 states and 8 union territories via our logistics partners. Delivery charges are calculated at checkout based on weight and location. Orders above ₹999 get free standard delivery within Haryana.",
  },
  {
    q: 'What if the print quality is not as expected?',
    a: "We stand behind every print with our quality guarantee. If your order has a printing defect — colour mismatch, cutting error, or damage in transit — we'll reprint it for free or issue a full refund. Just share photos within 48 hours of receipt.",
  },
  {
    q: 'Can you help with design if I don\'t have artwork ready?',
    a: "Absolutely. Our in-house design team provides basic layout assistance free of charge. For complex designs (packaging, brochures, brand identity), we charge a nominal design fee starting at ₹499. Simply describe your requirements over WhatsApp.",
  },
  {
    q: 'Do you offer bulk discounts for large orders?',
    a: 'Yes — our pricing uses automatic bulk slabs. The more you order, the lower the per-unit cost. For orders above ₹50,000 or corporate printing contracts, contact us for additional negotiated pricing.',
  },
]

function FAQItem({ faq, index }: { faq: typeof FAQS[number]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-bg-secondary transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-text-primary leading-snug">{faq.q}</span>
        <ChevronDown
          size={18}
          className={`text-text-secondary shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 bg-bg-secondary border-t border-border">
              <p className="text-sm text-text-secondary leading-relaxed pt-4">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const WHATSAPP_URL = `https://wa.me/919999999999?text=${encodeURIComponent('Hi! I have a question about printing.')}`

export default function FAQ() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <span className="section-label">FAQ</span>
            <h2 className="font-display font-bold text-text-primary">
              Frequently asked{' '}
              <span className="text-gradient-blue">questions.</span>
            </h2>
            <p className="text-text-secondary mt-3">
              Everything you need to know about ordering from JPP.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-10 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
              <MessageCircle size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary">Still have a question?</p>
              <p className="text-sm text-text-secondary mt-0.5">Our team is available Mon–Sat, 9 AM–7 PM on WhatsApp.</p>
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1eb354] transition-colors shrink-0">
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
