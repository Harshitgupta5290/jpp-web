'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

// Placeholder gradient images by category until real images are uploaded
const PLACEHOLDER_GRADIENTS = [
  'from-blue-900 via-blue-800 to-indigo-900',
  'from-indigo-900 via-purple-900 to-blue-900',
  'from-slate-800 via-blue-900 to-slate-900',
]

interface ProductGalleryProps {
  images: string[]
  productName: string
  categorySlug?: string
}

function PlaceholderImage({ gradient, label }: { gradient: string; label: string }) {
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <div className="text-center space-y-2 opacity-40">
        <div className="w-16 h-16 border-2 border-white/20 rounded-lg mx-auto flex items-center justify-center">
          <div className="w-8 h-8 border border-white/30 rounded" />
        </div>
        <p className="text-white/50 text-xs">{label}</p>
      </div>
    </div>
  )
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const totalImages = Math.max(images.length, 3)
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const prev = () => setActive((i) => (i - 1 + totalImages) % totalImages)
  const next = () => setActive((i) => (i + 1) % totalImages)

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-bg-card border border-border group">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {images[active] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[active]} alt={`${productName} view ${active + 1}`} className="w-full h-full object-cover" />
              ) : (
                <PlaceholderImage
                  gradient={PLACEHOLDER_GRADIENTS[active % PLACEHOLDER_GRADIENTS.length]!}
                  label={productName}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Zoom button */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute top-3 right-3 w-8 h-8 rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Zoom image"
          >
            <ZoomIn size={15} />
          </button>

          {/* Image count */}
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-border text-xs text-text-secondary">
            {active + 1} / {totalImages}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2">
          {Array.from({ length: totalImages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                relative flex-1 aspect-square rounded-md overflow-hidden border-2 transition-all
                ${active === i ? 'border-brand-blue' : 'border-border hover:border-brand-blue/40'}
              `}
              aria-label={`View image ${i + 1}`}
              aria-pressed={active === i}
            >
              {images[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[i]} alt="" className="w-full h-full object-cover" />
              ) : (
                <PlaceholderImage
                  gradient={PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]!}
                  label=""
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-2xl w-full aspect-square rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {images[active] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[active]} alt={productName} className="w-full h-full object-cover" />
              ) : (
                <PlaceholderImage
                  gradient={PLACEHOLDER_GRADIENTS[active % PLACEHOLDER_GRADIENTS.length]!}
                  label={productName}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
