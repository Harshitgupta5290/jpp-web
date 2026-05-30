import Navbar from './Navbar'
import Footer from './Footer'
import FloatingWhatsApp from '@/components/home/FloatingWhatsApp'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  hideFooter?: boolean
}

export default function PageWrapper({
  children,
  className = '',
  hideFooter = false,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      {/* pt-16 offsets the fixed 64px navbar */}
      <main className={`flex-1 pt-16 ${className}`}>{children}</main>
      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
    </div>
  )
}
