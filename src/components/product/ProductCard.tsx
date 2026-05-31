import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Zap, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import { CATEGORY_COLORS } from '@/lib/mock-data'
import type { Product, Category } from '@/types/product'

interface ProductCardProps {
  product: Product
  category: Category
  index?: number
}

export default function ProductCard({ product, category, index = 0 }: ProductCardProps) {
  const colors = CATEGORY_COLORS[category.slug] ?? {
    icon: 'text-brand-blue',
    bg: 'from-blue-500 to-blue-700',
    border: 'hover:border-brand-blue/30',
    soft: 'bg-blue-50',
    softBorder: 'border-blue-100',
    color: '#2D6FFF',
    gradientStart: '#1d4ed8',
    gradientEnd: '#3b82f6',
    gradientLight: '#bfdbfe',
  }

  const specs = product.specifications as Record<string, string[]> | null
  const sizesCount = specs?.sizes?.length ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <Link
        href={`/catalog/${category.slug}/${product.slug}`}
        className={`group block bg-white rounded-2xl border border-border hover:border-brand-blue/20 hover:shadow-medium hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full`}
      >
        {/* Product visual */}
        <div className={`relative h-32 overflow-hidden ${colors.soft ?? 'bg-blue-50'}`}
          style={{ background: `linear-gradient(135deg, ${colors.gradientStart ?? '#1d4ed8'}, ${colors.gradientEnd ?? '#3b82f6'})` }}>
          <div className="absolute inset-0 bg-dots-dark opacity-20" />
          <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full opacity-20" style={{ background: colors.gradientLight ?? '#bfdbfe' }} />
          <div className="absolute top-3 left-3">
            <span className="text-[9px] text-white/70 font-mono uppercase tracking-wider">{category.name}</span>
          </div>
          {product.has_live_preview && (
            <div className="absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
              Preview
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-sm leading-tight">{product.name}</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Description */}
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Specs preview */}
          {sizesCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {specs?.sizes?.slice(0, 2).map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-bg-secondary border border-border text-text-secondary font-medium">
                  {s}
                </span>
              ))}
              {sizesCount > 2 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-bg-secondary border border-border text-text-secondary font-medium">
                  +{sizesCount - 2} more
                </span>
              )}
            </div>
          )}

          {/* Finishes preview */}
          {specs?.finishes && specs.finishes.length > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <CheckCircle size={11} className="text-success shrink-0" />
              <span className="text-[11px] text-text-tertiary">{specs.finishes.slice(0, 2).join(', ')}{specs.finishes.length > 2 ? ` +${specs.finishes.length - 2}` : ''}</span>
            </div>
          )}

          {/* Rating mock */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[11px] text-text-tertiary ml-1">5.0</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-xs text-text-tertiary">From </span>
              <span className="font-price font-bold text-base text-text-primary">
                {formatCurrency(product.base_price ?? 0)}/pc
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap size={9} className="text-success" />
                <span className="text-[10px] text-success font-medium">3–5 day delivery</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-200">
              <ArrowRight size={14} className="text-brand-blue group-hover:text-white transition-colors duration-200" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
