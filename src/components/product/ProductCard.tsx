import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Layers } from 'lucide-react'
import Badge from '@/components/ui/Badge'
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
    bg: 'from-brand-blue/20 to-brand-blue/5',
    border: 'hover:border-brand-blue/30',
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
        className={`group block card card-hover p-5 h-full border border-border ${colors.border}`}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${colors.bg} border border-white/5 flex items-center justify-center mb-4`}>
          <Layers size={20} className={colors.icon} strokeWidth={1.8} />
        </div>

        {/* Name + badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-base text-text-primary leading-snug group-hover:text-white transition-colors">
            {product.name}
          </h3>
          {product.has_live_preview && (
            <Badge variant="blue" size="sm" className="shrink-0">Preview</Badge>
          )}
        </div>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Specs preview */}
        {sizesCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {specs?.sizes?.slice(0, 2).map((s) => (
              <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border">
                {s}
              </span>
            ))}
            {sizesCount > 2 && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border">
                +{sizesCount - 2} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
          <div>
            <span className="text-xs text-text-secondary">From </span>
            <span className="font-price font-semibold text-text-primary">
              {formatCurrency(product.base_price ?? 0)}/pc
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-brand-blue font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
            Order <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
