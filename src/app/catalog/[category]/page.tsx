'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import ProductCard from '@/components/product/ProductCard'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/mock-data'

interface CategoryPageProps {
  params: { category: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category)
  if (!category) notFound()

  const products = getProductsByCategory(params.category)

  return (
    <PageWrapper>
      {/* Header */}
      <section className="border-b border-border bg-bg-secondary/40">
        <div className="container-page py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/catalog" className="hover:text-text-primary transition-colors">Catalog</Link>
            <ChevronRight size={12} />
            <span className="text-text-primary">{category.name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-text-primary">{category.name}</h1>
            {category.description && (
              <p className="text-text-secondary mt-2 max-w-xl">{category.description}</p>
            )}
            <p className="text-xs text-text-secondary mt-3">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="container-page py-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} category={category} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-secondary">No products in this category yet.</p>
            <Link href="/order/custom" className="mt-3 inline-block text-sm text-brand-blue hover:underline">
              Request a custom order →
            </Link>
          </div>
        )}
      </section>
    </PageWrapper>
  )
}
