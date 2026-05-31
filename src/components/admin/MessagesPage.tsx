'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Phone, Mail, Clock, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string; name: string; phone: string; email: string
  message: string; product?: string | null; created_at: string; replied: boolean
}

const MOCK: Message[] = [
  { id: '1', name: 'Suresh Kumar',   phone: '9876543220', email: 'suresh@example.com', message: 'I need 5000 business cards with gold foil. Can you give me a quote?', product: 'Business Cards',    created_at: new Date(Date.now()-3.6e6).toISOString(), replied: false },
  { id: '2', name: 'Lakshmi Prasad', phone: '9876543221', email: 'lakshmi@example.com', message: 'Looking for packaging boxes for saree business. 500 units minimum. Need sample first.', product: 'Packaging Boxes', created_at: new Date(Date.now()-7.2e6).toISOString(), replied: true },
  { id: '3', name: 'Ramesh Yadav',   phone: '9876543222', email: 'ramesh@example.com', message: 'We need 10,000 brochures for our real estate project. Can you accommodate bulk order?', product: 'Brochures',        created_at: new Date(Date.now()-8.64e7).toISOString(), replied: false },
  { id: '4', name: 'Gita Sharma',    phone: '9876543223', email: 'gita@example.com', message: 'Wedding invitation cards needed urgently for 200 guests. How quickly can you deliver?', product: 'Wedding Cards',   created_at: new Date(Date.now()-1.72e8).toISOString(), replied: true },
]

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(MOCK)
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied'>('all')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await (createClient() as any)
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (data?.length) setMessages(data)
    } catch { /* use mock */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleReplied = async (id: string) => {
    const msg = messages.find((m) => m.id === id)
    if (!msg) return
    const next = !msg.replied
    setMessages((m) => m.map((x) => x.id === id ? { ...x, replied: next } : x))
    try {
      await (createClient() as any).from('contact_messages').update({ replied: next }).eq('id', id)
    } catch { /* optimistic already applied */ }
  }

  const filtered = messages.filter((m) => filter === 'all' ? true : filter === 'pending' ? !m.replied : m.replied)
  const counts = { all: messages.length, pending: messages.filter(m => !m.replied).length, replied: messages.filter(m => m.replied).length }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Enquiries</h1>
          <p className="text-sm text-text-secondary mt-0.5">{counts.pending} unanswered · {counts.replied} replied</p>
        </div>
        <button onClick={load} disabled={loading} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'replied'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all capitalize ${filter === f ? 'bg-brand-blue text-white' : 'bg-white border border-border text-text-secondary hover:border-brand-blue/30'}`}>
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-bg-secondary text-text-tertiary'}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((msg, i) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`bg-white rounded-2xl border p-5 ${!msg.replied ? 'border-amber-200 bg-amber-50/30' : 'border-border'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-semibold text-text-primary">{msg.name}</p>
                  {msg.product && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-100 font-medium">{msg.product}</span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${msg.replied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {msg.replied ? '✓ Replied' : '⏳ Pending'}
                  </span>
                  <span className="text-xs text-text-tertiary flex items-center gap-1"><Clock size={11} />{timeAgo(msg.created_at)}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{msg.message}</p>
                <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Phone size={11} className="text-brand-blue" />{msg.phone}</span>
                  <span className="flex items-center gap-1"><Mail size={11} className="text-brand-blue" />{msg.email}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a href={`https://wa.me/91${msg.phone}?text=${encodeURIComponent(`Hi ${msg.name}! Thank you for enquiring about our printing services. `)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle size={12} /> WhatsApp
                </a>
                <a href={`mailto:${msg.email}`}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-brand-blue border border-blue-100 text-xs font-semibold hover:bg-blue-100 transition-colors">
                  <ExternalLink size={12} /> Email
                </a>
                <button onClick={() => toggleReplied(msg.id)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
                  <CheckCircle size={12} className={msg.replied ? 'text-success' : ''} />
                  {msg.replied ? 'Unreply' : 'Mark Replied'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-center py-12 text-text-secondary text-sm">No enquiries here.</p>}
      </div>
    </div>
  )
}
