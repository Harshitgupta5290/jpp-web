'use client'

import { Star, CheckCircle, Quote } from 'lucide-react'

const TESTIMONIALS = [
  { id: 1, name: 'Rahul Sharma',  business: 'Sharma Enterprises, Rohtak', avatar: 'RS', rating: 5, time: 'Yesterday',    message: 'Got 5000 business cards printed. Quality is outstanding — matte finish is very premium. Delivered in 3 days. JPP is the best printing press in Rohtak, no doubt. Will order again!', verified: true, gradient: 'from-blue-500 to-blue-700' },
  { id: 2, name: 'Priya Gupta',   business: 'Gupta Fashion House',        avatar: 'PG', rating: 5, time: 'Monday',       message: 'Ordered brochures for our new collection launch. Design team helped us get the colors just right. Print quality is exactly like the digital proof. Very happy!', verified: true, gradient: 'from-pink-500 to-pink-700' },
  { id: 3, name: 'Amit Yadav',    business: 'AY Constructions',           avatar: 'AY', rating: 5, time: 'Last week',    message: 'We needed 200 wedding invitation cards urgently. JPP delivered in 48 hours! The gold foiling came out beautifully. All guests were impressed. Highly recommend.', verified: true, gradient: 'from-orange-500 to-orange-700' },
  { id: 4, name: 'Sunita Devi',   business: 'Lakshmi Kirana Store',       avatar: 'SD', rating: 5, time: '2 weeks ago',  message: 'First time ordering from JPP for my shop banners. Process was very easy on the website. Uploaded my design, paid advance, and received same week. Excellent service!', verified: true, gradient: 'from-green-500 to-green-700' },
  { id: 5, name: 'Vikram Singh',  business: 'VS Pharma Distributors',     avatar: 'VS', rating: 5, time: 'Last month',   message: 'Regular customer for 3 years now. JPP prints all our prescription pads, letterheads, and packaging. Consistent quality every time. The online ordering makes things so much easier!', verified: true, gradient: 'from-purple-500 to-purple-700' },
  { id: 6, name: 'Meena Agarwal', business: 'Agarwal Sweets',             avatar: 'MA', rating: 5, time: '3 weeks ago',  message: 'Ordered festive packaging boxes for Diwali. 1000 boxes delivered with perfect color accuracy. Our customers loved the packaging. Already placed next order for 2000 boxes!', verified: true, gradient: 'from-yellow-500 to-yellow-700' },
  { id: 7, name: 'Deepak Arora',  business: 'Arora Real Estate',          avatar: 'DA', rating: 5, time: '5 days ago',   message: 'Got our property brochures printed in bulk. The paper quality and color reproduction is superb. Clients are impressed every time we hand them our brochure. Will stick with JPP.', verified: true, gradient: 'from-cyan-500 to-cyan-700' },
  { id: 8, name: 'Kavita Joshi',  business: 'Joshi Boutique',             avatar: 'KJ', rating: 5, time: '10 days ago',  message: 'Customized shopping bags and tissue paper with our logo. Looks extremely premium. Customers keep complimenting the packaging. JPP made our brand look amazing!', verified: true, gradient: 'from-rose-500 to-rose-700' },
]

function WhatsAppSVG() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366" aria-label="WhatsApp verified">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  return (
    <div className="relative flex-shrink-0 w-[320px] bg-white rounded-2xl border border-border hover:border-brand-blue/20 hover:shadow-medium p-5 flex flex-col gap-3 select-none transition-all duration-300">
      <Quote size={18} className="text-brand-blue/20 absolute top-4 right-4" />

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {t.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-text-primary truncate">{t.name}</span>
            {t.verified && <CheckCircle size={12} className="text-[#25D366] shrink-0" />}
          </div>
          <p className="text-xs text-text-secondary truncate">{t.business}</p>
        </div>
        <WhatsAppSVG />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
          ))}
        </div>
        <span className="text-[11px] text-text-tertiary">{t.time}</span>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{t.message}</p>
    </div>
  )
}

const ROW1 = [...TESTIMONIALS, ...TESTIMONIALS]
const ROW2 = [...[...TESTIMONIALS].reverse(), ...[...TESTIMONIALS].reverse()]

export default function Testimonials() {
  return (
    <section className="py-20 overflow-hidden bg-bg-secondary border-y border-border">
      <div className="container-page mb-12">
        <div className="text-center">
          <span className="section-label">Customer Reviews</span>
          <h2 className="font-display font-bold text-text-primary">
            Don&apos;t take our word for it.
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={22} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-price font-bold text-2xl text-text-primary">5.0</span>
            <span className="text-text-secondary text-sm">(847 reviews on WhatsApp)</span>
          </div>
        </div>
      </div>

      <div className="group space-y-4">
        {/* Row 1 */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F8FAFC, transparent)' }} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F8FAFC, transparent)' }} aria-hidden="true" />
          <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
            {ROW1.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F8FAFC, transparent)' }} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F8FAFC, transparent)' }} aria-hidden="true" />
          <div className="flex gap-4 animate-marquee-reverse group-hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
            {ROW2.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
