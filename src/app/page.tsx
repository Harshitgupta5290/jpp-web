import PageWrapper from '@/components/layout/PageWrapper'
import HeroSection from '@/components/home/HeroSection'
import TrustStrip from '@/components/home/TrustStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import HowItWorks from '@/components/home/HowItWorks'
import PriceCalculator from '@/components/home/PriceCalculator'
import Testimonials from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <PageWrapper>
      <HeroSection />
      <TrustStrip />
      <CategoryGrid />
      <HowItWorks />
      <PriceCalculator />
      <Testimonials />
    </PageWrapper>
  )
}
