'use client'

import { useState, useCallback } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ShoppingCart, Zap, Phone, HelpCircle, Clock, Truck, Shield } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import ProductGallery from '@/components/product/ProductGallery'
import SpecSelector from '@/components/product/SpecSelector'
import QuantityPriceCalculator from '@/components/product/QuantityPriceCalculator'
import FileUpload from '@/components/product/FileUpload'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { getProductWithCategory } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils/formatters'
import type { PriceCalculationResult } from '@/types/product'

interface ProductPageProps {
  params: { category: string; product: string }
}

const GUARANTEES = [
  { icon: Clock, label: 'Fast turnaround', sub: '24–72 hour dispatch' },
  { icon: Truck, label: 'Free delivery', sub: 'On all orders' },
  { icon: Shield, label: 'Quality guarantee', sub: 'Free reprint if faulty' },
  { icon: Phone, label: 'Design support', sub: 'WhatsApp assistance' },
]

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { addItem } = useCartStore()
  const { addToast } = useUIStore()

  const data = getProductWithCategory(params.product)
  if (!data || data.category?.slug !== params.category) notFound()

  const { product, category, slabs } = data
  const specs = product.specifications as Record<string, string[]> | null

  // Spec selections
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    if (specs) {
      for (const [key, options] of Object.entries(specs)) {
        if (options.length > 0) initial[key] = options[0] ?? ''
      }
    }
    return initial
  })

  const [priceResult, setPriceResult] = useState<PriceCalculationResult>({
    unitPrice: product.base_price ?? 0,
    totalPrice: (product.base_price ?? 0) * product.min_quantity,
    slab: null,
    savingsPercent: null,
  })
  const [quantity, setQuantity] = useState(product.min_quantity)
  const [designFile, setDesignFile] = useState<File | null>(null)
  const [needsDesign, setNeedsDesign] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const handlePriceChange = useCallback((result: PriceCalculationResult, qty: number) => {
    setPriceResult(result)
    setQuantity(qty)
  }, [])

  const handleAddToCart = async () => {
    setAddingToCart(true)
    await new Promise((r) => setTimeout(r, 400))

    addItem({
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      specifications: selectedSpecs,
      unitPrice: priceResult.unitPrice,
      totalPrice: priceResult.totalPrice,
      designFileUrl: designFile ? URL.createObjectURL(designFile) : undefined,
      needsDesign,
    })

    addToast({ type: 'success', title: 'Added to cart', message: `${product.name} × ${quantity.toLocaleString()}` })
    setAddingToCart(false)
  }

  const handleOrderNow = async () => {
    await handleAddToCart()
    router.push('/order/cart')
  }

  const specEntries = specs ? Object.entries(specs) : []

  return (
    <PageWrapper>
      <div className="container-page py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/catalog" className="hover:text-text-primary transition-colors">Catalog</Link>
          <ChevronRight size={12} />
          {category && (
            <>
              <Link href={`/catalog/${category.slug}`} className="hover:text-text-primary transition-colors">
                {category.name}
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14">
          {/* ── Left: Gallery ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <ProductGallery
              images={product.images ?? []}
              productName={product.name}
              categorySlug={category?.slug}
            />
          </motion.div>

          {/* ── Right: Config ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Product name & price */}
            <div>
              {category && (
                <Link
                  href={`/catalog/${category.slug}`}
                  className="text-xs text-brand-blue font-medium uppercase tracking-wider hover:underline"
                >
                  {category.name}
                </Link>
              )}
              <h1 className="font-display font-bold text-text-primary mt-1 text-3xl">{product.name}</h1>
              <p className="text-text-secondary mt-3 leading-relaxed">{product.description}</p>
              <p className="mt-3 text-sm text-text-secondary">
                Starting from{' '}
                <span className="font-price font-bold text-text-primary text-lg">
                  {formatCurrency(product.base_price ?? 0)}/pc
                </span>
              </p>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Spec selectors */}
            {specEntries.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-sm font-semibold text-text-primary">Customize Your Order</h2>
                {specEntries.map(([key, options]) => (
                  <SpecSelector
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    options={options}
                    value={selectedSpecs[key] ?? options[0] ?? ''}
                    onChange={(val) => setSelectedSpecs((prev) => ({ ...prev, [key]: val }))}
                  />
                ))}
              </div>
            )}

            {/* Quantity + Price */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-text-primary">Quantity & Pricing</h2>
              <QuantityPriceCalculator
                slabs={slabs}
                basePrice={product.base_price}
                minQuantity={product.min_quantity}
                onPriceChange={handlePriceChange}
              />
            </div>

            {/* Design file upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-primary">Design File</h2>
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I need design help for ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-blue hover:underline flex items-center gap-1"
                >
                  <HelpCircle size={12} /> Need design help?
                </a>
              </div>

              {!needsDesign ? (
                <>
                  <FileUpload onFileChange={setDesignFile} label="" />
                  <button
                    onClick={() => setNeedsDesign(true)}
                    className="text-xs text-text-secondary hover:text-brand-blue transition-colors"
                  >
                    I don&apos;t have a design — request design assistance instead
                  </button>
                </>
              ) : (
                <div className="p-4 rounded-md bg-brand-blue/5 border border-brand-blue/20">
                  <p className="text-sm text-text-primary font-medium">Design assistance requested ✓</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Our team will reach out on WhatsApp to discuss your requirements after order confirmation.
                  </p>
                  <button
                    onClick={() => setNeedsDesign(false)}
                    className="text-xs text-brand-blue hover:underline mt-2 block"
                  >
                    Upload my own design instead
                  </button>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={addingToCart}
                icon={<ShoppingCart size={18} />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="gold"
                size="lg"
                fullWidth
                icon={<Zap size={18} />}
                onClick={handleOrderNow}
              >
                Order Now
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {GUARANTEES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-brand-blue" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-primary leading-tight">{label}</p>
                    <p className="text-[11px] text-text-secondary">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
