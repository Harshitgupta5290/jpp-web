'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Award, Users, MapPin, Clock, Star, ArrowRight } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'

const MILESTONES = [
  { year: '1972', event: 'Founded by Shri Jawahar Lal in Rohtak, Haryana with a single letterpress machine.' },
  { year: '1985', event: 'Expanded to offset printing — became the go-to press for government contracts and corporate clients.' },
  { year: '1998', event: 'Introduced colour printing and became Rohtak\'s first full-colour commercial press.' },
  { year: '2008', event: 'Modernised with digital printing machinery, cutting turnaround from weeks to days.' },
  { year: '2018', event: 'Launched pan-India shipping, serving customers across all 28 states.' },
  { year: '2024', event: 'Launched online ordering platform — making premium printing accessible 24/7.' },
]

const VALUES = [
  { icon: Award,   title: 'Quality First',       description: 'Every order goes through a 3-point quality check before dispatch. If you\'re not satisfied, we reprint for free.' },
  { icon: Clock,   title: 'Speed Without Compromise', description: 'Same-day dispatch for orders placed before 12 PM. We never sacrifice quality for speed.' },
  { icon: Users,   title: 'Customer Obsessed',   description: 'WhatsApp support from a real human, not a bot. We respond within 30 minutes during business hours.' },
  { icon: MapPin,  title: 'Proudly Indian',       description: 'Made in Rohtak. Shipped across India. Supporting local artisans and using eco-friendly inks wherever possible.' },
]

const STATS = [
  { value: '52+', label: 'Years in Business' },
  { value: '10,000+', label: 'Orders Delivered' },
  { value: '500+', label: 'Business Clients' },
  { value: '28', label: 'States Served' },
]

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="border-b border-border bg-bg-secondary/40">
        <div className="container-page py-16">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">
              Est. 1972 · Rohtak, Haryana
            </p>
            <h1 className="font-display font-bold text-text-primary">
              52 years of print.<br />
              <span className="text-gradient-blue">One family&apos;s passion.</span>
            </h1>
            <p className="text-text-secondary mt-5 text-lg leading-relaxed max-w-2xl">
              Jawahar Printing Press was founded in 1972 by Shri Jawahar Lal with a single letterpress
              machine and a conviction that quality printing should be accessible to every business.
              Today, we&apos;re Haryana&apos;s most trusted print partner — serving thousands of businesses
              across India with the same dedication our founder instilled over five decades ago.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/catalog">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Browse Products
                </Button>
              </Link>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi! I want to know more about JPP.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">Chat with Us</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container-page py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="text-center"
              >
                <p className="font-display font-bold text-3xl text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">Our Story</p>
              <h2 className="font-display font-bold text-text-primary mb-5">
                From a single press<br />to a printing empire.
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  In 1972, Rohtak had very few quality printing options. Businesses had to travel to
                  Delhi for anything beyond basic black-and-white printing. Shri Jawahar Lal saw an
                  opportunity — and more importantly, a genuine need.
                </p>
                <p>
                  He invested his life savings into a single letterpress machine, set up shop near
                  Old Civil Hospital, and began printing visiting cards and letterheads for local
                  traders. Word spread quickly: Jawahar Printing Press delivered quality you could
                  feel and honesty you could trust.
                </p>
                <p>
                  Today, the third generation of the family runs the business with the same values —
                  but with state-of-the-art digital and offset printing equipment, same-day dispatch,
                  and an online ordering platform that puts the press in your pocket.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-6">Timeline</p>
              {MILESTONES.map(({ year, event }, i) => (
                <motion.div
                  key={year}
                  initial={{ y: 16 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  className="flex gap-4 pb-6 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-brand-blue" />
                    </div>
                    {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pb-1">
                    <p className="font-price font-bold text-brand-blue text-sm">{year}</p>
                    <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-bg-secondary/40">
        <div className="container-page">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">Our Values</p>
            <h2 className="font-display font-bold text-text-primary">
              What we stand for.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="card p-6 flex gap-4"
              >
                <div className="w-10 h-10 rounded-md bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-blue" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-text-primary mb-1">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating strip */}
      <section className="border-y border-border">
        <div className="container-page py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={22} className="text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <div>
              <p className="font-price font-bold text-2xl text-text-primary">5.0</p>
              <p className="text-xs text-text-secondary">847 reviews · WhatsApp</p>
            </div>
          </div>
          <Link href="/catalog">
            <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              Start Your Order
            </Button>
          </Link>
        </div>
      </section>
    </PageWrapper>
  )
}
