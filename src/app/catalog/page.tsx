'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, X, TrendingUp, Star, Clock } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import ProductCard from '@/components/product/ProductCard'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock-data'
import type { Category } from '@/types/product'

const ALL_SLUG = '__all__'

const SORT_OPTIONS = [
  { value: 'popular',   label: 'Most Popular',   icon: TrendingUp },
  { value: 'rating',    label: 'Highest Rated',  icon: Star },
  { value: 'price-asc', label: 'Price: Low–High',icon: ChevronDown },
  { value: 'price-desc',label: 'Price: High–Low', icon: ChevronDown },
  { value: 'newest',    label: 'Newest First',   icon: Clock },
]

function CategoryPill({ category, active, onClick }: {
  category: Category | { id: string; name: string; slug: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
        active
          ? 'bg-brand-blue text-white shadow-glow-sm'
          : 'bg-white text-text-secondary hover:text-text-primary border border-border hover:border-brand-blue/30 hover:bg-blue-50'
      }`}
    >
      {category.name}
    </button>
  )
}

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_SLUG)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortOpen, setSortOpen] = useState(false)

  const categories = [{ id: ALL_SLUG, name: 'All Products', slug: ALL_SLUG }, ...MOCK_CATEGORIES]

  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS.filter((p) => p.is_active)

    if (activeCategory !== ALL_SLUG) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === activeCategory)
      if (cat) products = products.filter((p) => p.category_id === cat.id)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      products = products.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q))
    }

    // Sort
    switch (sort) {
      case 'price-asc':  products = [...products].sort((a, b) => (a.base_price ?? 0) - (b.base_price ?? 0)); break
      case 'price-desc': products = [...products].sort((a, b) => (b.base_price ?? 0) - (a.base_price ?? 0)); break
      case 'newest':     products = [...products].sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0)); break
      default: break
    }

    return products
  }, [activeCategory, search, sort])

  const getCategoryForProduct = (categoryId: string | null) =>
    MOCK_CATEGORIES.find((c) => c.id === categoryId) ?? MOCK_CATEGORIES[0]!

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'

  return (
    <PageWrapper>
      {/* Page Header */}
      <section className="bg-white border-b border-border">
        <div className="container-page py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">Product Catalog</span>
            <h1 className="font-display font-bold text-text-primary mt-1">All Printing Products</h1>
            <p className="text-text-secondary mt-2 max-w-lg">
              Browse our full range of printing solutions. Bulk pricing on all products — the more you order, the more you save.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-bg-secondary min-h-screen">
        <div className="container-page py-8">
          {/* Search + Sort + View bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(45,111,255,0.1)] transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 h-11 px-4 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:border-brand-blue/30 transition-all whitespace-nowrap"
              >
                <SlidersHorizontal size={15} />
                {activeSortLabel}
                <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-border rounded-xl shadow-large z-10 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((o) => (
                    <button key={o.value} onClick={() => { setSort(o.value); setSortOpen(false) }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${sort === o.value ? 'bg-blue-50 text-brand-blue font-semibold' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-border rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')} className={`flex items-center justify-center w-11 h-11 transition-colors ${view === 'grid' ? 'bg-brand-blue text-white' : 'text-text-secondary hover:bg-bg-secondary'}`} aria-label="Grid view">
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setView('list')} className={`flex items-center justify-center w-11 h-11 transition-colors ${view === 'list' ? 'bg-brand-blue text-white' : 'text-text-secondary hover:bg-bg-secondary'}`} aria-label="List view">
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6">
            {categories.map((cat) => (
              <CategoryPill
                key={cat.slug}
                category={cat}
                active={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
              />
            ))}
          </div>

          {/* Results count + active filters */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">{filteredProducts.length}</span> products
              {activeCategory !== ALL_SLUG && (
                <span className="ml-1">in <span className="font-medium text-brand-blue">{MOCK_CATEGORIES.find(c => c.slug === activeCategory)?.name}</span></span>
              )}
            </p>
            {(search || activeCategory !== ALL_SLUG) && (
              <button onClick={() => { setSearch(''); setActiveCategory(ALL_SLUG) }}
                className="flex items-center gap-1 text-xs text-error hover:underline font-medium">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {/* Products grid / list */}
          {filteredProducts.length > 0 ? (
            <div className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
            }>
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
            <div className="py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-bg-muted flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-text-tertiary" />
              </div>
              <p className="font-semibold text-text-primary mb-1">No products found</p>
              <p className="text-sm text-text-secondary mb-4">No results for &ldquo;{search}&rdquo;</p>
              <button onClick={() => { setSearch(''); setActiveCategory(ALL_SLUG) }}
                className="text-sm text-brand-blue font-semibold hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}
