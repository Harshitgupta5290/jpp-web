'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Check, RefreshCw, Trash2, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string; rating: number; comment: string | null
  is_approved: boolean; created_at: string
  profiles?: { full_name: string | null; email: string | null } | null
}

const MOCK: Review[] = [
  { id: '1', rating: 5, comment: 'Excellent print quality! Business cards came out perfect. Fast delivery and great packaging.', is_approved: true,  created_at: new Date(Date.now()-3.6e6).toISOString(), profiles: { full_name: 'Rahul Sharma',  email: 'rahul@example.com' } },
  { id: '2', rating: 4, comment: 'Great turnaround time. Brochure quality was very good. Will order again.', is_approved: false, created_at: new Date(Date.now()-7.2e6).toISOString(), profiles: { full_name: 'Priya Gupta',   email: 'priya@example.com' } },
  { id: '3', rating: 5, comment: 'Wedding cards were absolutely beautiful. All guests were impressed by the gold foil work!', is_approved: true,  created_at: new Date(Date.now()-8.64e7).toISOString(), profiles: { full_name: 'Amit Yadav',    email: 'amit@example.com' } },
  { id: '4', rating: 3, comment: 'Decent quality but delivery was slightly delayed. Customer service was helpful though.', is_approved: false, created_at: new Date(Date.now()-1.72e8).toISOString(), profiles: { full_name: 'Meena Agarwal', email: 'meena@example.com' } },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await (createClient() as any).from('reviews').select('*, profiles(full_name, email)').order('created_at', { ascending: false })
      if (data?.length) setReviews(data)
    } catch { /* use mock */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleApprove = async (review: Review) => {
    try {
      await (createClient() as any).from('reviews').update({ is_approved: !review.is_approved }).eq('id', review.id)
      setReviews((r) => r.map((rv) => rv.id === review.id ? { ...rv, is_approved: !rv.is_approved } : rv))
    } catch { /* ignore */ }
  }

  const deleteReview = async (id: string) => {
    try {
      await (createClient() as any).from('reviews').delete().eq('id', id)
      setReviews((r) => r.filter((rv) => rv.id !== id))
    } catch { /* ignore */ }
  }

  const counts = { all: reviews.length, pending: reviews.filter(r => !r.is_approved).length, approved: reviews.filter(r => r.is_approved).length }
  const filtered = reviews.filter((r) => filter === 'all' ? true : filter === 'pending' ? !r.is_approved : r.is_approved)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Reviews</h1>
          <p className="text-sm text-text-secondary mt-0.5">{counts.pending} pending approval · {counts.approved} published</p>
        </div>
        <button onClick={load} disabled={loading} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-secondary transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all capitalize ${filter === f ? 'bg-brand-blue text-white shadow-glow-sm' : 'bg-white border border-border text-text-secondary hover:border-brand-blue/30'}`}>
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-bg-secondary text-text-tertiary'}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-[#1a4fd8] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(review.profiles?.full_name ?? 'U')[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{review.profiles?.full_name ?? '—'}</p>
                    <p className="text-xs text-text-tertiary">{new Date(review.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} className={j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-border'} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${review.is_approved ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {review.is_approved ? '✓ Published' : '⏳ Pending'}
                  </span>
                </div>
                {review.comment && <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleApprove(review)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${review.is_approved ? 'text-amber-500 hover:bg-amber-50' : 'text-success hover:bg-emerald-50'}`}
                  title={review.is_approved ? 'Unpublish' : 'Approve'}>
                  {review.is_approved ? <EyeOff size={14} /> : <Check size={14} />}
                </button>
                <button onClick={() => deleteReview(review.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-center py-12 text-text-secondary text-sm">No reviews here.</p>}
      </div>
    </div>
  )
}
