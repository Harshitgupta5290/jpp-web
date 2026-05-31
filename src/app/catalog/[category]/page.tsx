'use client'

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import ProductCard from '@/components/product/ProductCard'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'
import type { Category, Product } from '@/types/product'

interface CategoryPageProps {
  params: { category: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Start with mock data for SSR/fast initial render
  const mockCat = getCategoryBySlug(params.category)
  const mockProds = getProductsByCategory(params.category)

  const [category, setCategory] = useState<Category | null>(mockCat ?? null)
  const [products, setProducts] = useState<Product[]>(mockProds)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return
    const load = async () => {
      try {
        const supabase = createClient()
        const { data: cat } = await supabase.from('categories').select('*').eq('slug', params.category).single() as any
        if (cat) {
          setCategory(cat as Category)
          const { data: prods } = await supabase.from('products').select('*').eq('category_id', cat.id).eq('is_active', true).order('display_order', { ascending: true }) as any
          if (prods?.length) setProducts(prods as Product[])
        }
      } catch { /* use mock */ }
    }
    load()
  }, [params.category])

  if (!category) notFound()

  const filtered = search.trim()
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description ?? '').toLowerCase().includes(search.toLowerCase()))
    : products

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-white border-b border-border">
        <div className="container-page py-10">
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/catalog" className="hover:text-text-primary transition-colors">Catalog</Link>
            <ChevronRight size={12} />
            <span className="text-text-primary font-medium">{category.name}</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">{category.name}</span>
            <h1 className="font-display font-bold text-text-primary mt-0.5">{category.name}</h1>
            {category.description && <p className="text-text-secondary mt-2 max-w-xl">{category.description}</p>}
            <p className="text-xs text-text-tertiary mt-3">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-bg-secondary min-h-screen">
        <div className="container-page py-8">
          {/* Search */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${category.name}…`}
                className="w-full h-10 pl-9 pr-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-brand-blue transition-all" />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <SlidersHorizontal size={14} />
              <span>{filtered.length} products</span>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} category={category} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-text-secondary">No products found{search ? ` for "${search}"` : ''}.</p>
              {search && <button onClick={() => setSearch('')} className="mt-2 text-sm text-brand-blue hover:underline">Clear search</button>}
              {!search && (
                <Link href="/order/custom" className="mt-3 inline-block text-sm text-brand-blue hover:underline">
                  Request a custom order →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}
