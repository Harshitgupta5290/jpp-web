import dynamic from 'next/dynamic'
import PageWrapper from '@/components/layout/PageWrapper'

// Static sections — rendered server-side, no JS overhead
import TrustStrip from '@/components/home/TrustStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import PrintingServices from '@/components/home/PrintingServices'
import HowItWorks from '@/components/home/HowItWorks'
import FAQ from '@/components/home/FAQ'

// Dynamic (client-only) — lazy loaded, split into separate bundles
// These have animations/canvas/framer-motion — defer them to keep initial JS small
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), { ssr: false })
const ServicesShowcase = dynamic(() => import('@/components/home/ServicesShowcase'), { ssr: false })
const ClientLogos = dynamic(() => import('@/components/home/ClientLogos'), { ssr: false })
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), { ssr: false })
const PrintingProcess = dynamic(() => import('@/components/home/PrintingProcess'), { ssr: false })
const PriceCalculator = dynamic(() => import('@/components/home/PriceCalculator'), { ssr: false })
const PortfolioGallery = dynamic(() => import('@/components/home/PortfolioGallery'), { ssr: false })
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: false })

export default function HomePage() {
  return (
    <PageWrapper>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Services Showcase — card grid after hero */}
      <ServicesShowcase />

      {/* 3. Trust Strip — server-rendered, zero JS cost */}
      <TrustStrip />

      {/* 3. Product Categories */}
      <CategoryGrid />

      {/* 4. Client Logos — marquee */}
      <ClientLogos />

      {/* 5. Featured / Bestsellers */}
      <FeaturedProducts />

      {/* 6. Printing Process — premium dark section */}
      <PrintingProcess />

      {/* 7. Printing Services — server-rendered */}
      <PrintingServices />

      {/* 8. How It Works — server-rendered */}
      <HowItWorks />

      {/* 9. Price Calculator */}
      <PriceCalculator />

      {/* 10. Portfolio Gallery */}
      <PortfolioGallery />

      {/* 11. Testimonials */}
      <Testimonials />

      {/* 12. FAQ — server-rendered accordion */}
      <FAQ />
    </PageWrapper>
  )
}
