'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import ProductCard from '@/components/product/ProductCard'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock-data'
import type { Category } from '@/types/product'

const ALL_SLUG = '__all__'

function CategoryTab({
  category,
  active,
  onClick,
}: {
  category: Category | { id: string; name: string; slug: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150
        ${active
          ? 'text-text-primary bg-bg-card border border-brand-blue/40'
          : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
        }
      `}
    >
      {category.name}
      {active && (
        <motion.span
          layoutId="cat-tab-indicator"
          className="absolute inset-0 rounded-md border border-brand-blue/30 bg-brand-blue/5"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  )
}

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_SLUG)
  const [search, setSearch] = useState('')

  const categories = [{ id: ALL_SLUG, name: 'All Products', slug: ALL_SLUG }, ...MOCK_CATEGORIES]

  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS.filter((p) => p.is_active)

    if (activeCategory !== ALL_SLUG) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === activeCategory)
      if (cat) products = products.filter((p) => p.category_id === cat.id)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
      )
    }

    return products
  }, [activeCategory, search])

  const getCategoryForProduct = (categoryId: string | null) =>
    MOCK_CATEGORIES.find((c) => c.id === categoryId) ?? MOCK_CATEGORIES[0]!

  return (
    <PageWrapper>
      {/* Page header */}
      <section className="border-b border-border bg-bg-secondary/40">
        <div className="container-page py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-2">
              Product Catalog
            </p>
            <h1 className="font-display font-bold text-text-primary">
              All Printing Products
            </h1>
            <p className="text-text-secondary mt-2 max-w-lg">
              Browse our full range of printing solutions. Bulk pricing on all products — the more you order, the more you save.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-8">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <SlidersHorizontal size={15} />
            <span>{filteredProducts.length} products</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
          {categories.map((cat) => (
            <CategoryTab
              key={cat.slug}
              category={cat}
              active={activeCategory === cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
            />
          ))}
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                category={getCategoryForProduct(product.category_id)}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-secondary">No products found for &quot;{search}&quot;</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(ALL_SLUG) }}
              className="mt-3 text-sm text-brand-blue hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </PageWrapper>
  )
}
