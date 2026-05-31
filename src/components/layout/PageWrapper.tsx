import Navbar from './Navbar'
import Footer from './Footer'
import FloatingWhatsApp from '@/components/home/FloatingWhatsApp'
import AnnouncementBar from '@/components/home/AnnouncementBar'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  hideFooter?: boolean
  showAnnouncement?: boolean
}

export default function PageWrapper({
  children,
  className = '',
  hideFooter = false,
  showAnnouncement = true,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      {showAnnouncement && <AnnouncementBar />}
      <Navbar />
      {/* pt-16 offsets the fixed 64px navbar */}
      <main className={`flex-1 pt-16 ${className}`}>{children}</main>
      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
    </div>
  )
}
