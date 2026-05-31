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
      {/*
        Single sticky header — AnnouncementBar + Navbar stacked in one block.
        sticky keeps them at top-0 during scroll without removing them from
        document flow, so <main> needs zero manual padding offset.
        When the bar is dismissed its height collapses and the nav slides up.
      */}
      <div className="sticky top-0 left-0 right-0 z-50 w-full">
        {showAnnouncement && <AnnouncementBar />}
        <Navbar />
      </div>

      <main className={`flex-1 ${className}`}>{children}</main>

      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
    </div>
  )
}
