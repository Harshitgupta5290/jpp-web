import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import ToastContainer from '@/components/ui/Toast'
import Preloader from '@/components/layout/Preloader'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jawaharprintingpress.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Jawahar Printing Press Rohtak — Premium Printing Since 1972',
    template: '%s | Jawahar Printing Press, Rohtak',
  },
  description:
    "Jawahar Printing Press, Rohtak — Haryana's most trusted printing partner since 1972. Business cards, brochures, banners, wedding cards, packaging & more. Bulk pricing, same-day dispatch, pan-India delivery. Order online, get instant quote.",
  keywords: [
    'printing press Rohtak',
    'printing press Haryana',
    'Jawahar Printing Press',
    'JPP printing Rohtak',
    'business card printing Rohtak',
    'brochure printing Haryana',
    'banner printing Rohtak',
    'wedding card printing Rohtak',
    'packaging printing India',
    'bulk printing India',
    'offset printing Rohtak',
    'digital printing Haryana',
    'same day printing Rohtak',
    'online printing India',
    'cheap printing Rohtak',
    'visiting card printing Haryana',
  ],
  authors: [{ name: 'Jawahar Printing Press', url: SITE_URL }],
  creator: 'Jawahar Printing Press',
  publisher: 'Jawahar Printing Press',
  category: 'Printing Services',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Jawahar Printing Press',
    title: 'Jawahar Printing Press Rohtak — Premium Printing Since 1972',
    description:
      "Haryana's most trusted printing partner since 1972. Business cards, brochures, banners, wedding cards, packaging & more. Bulk pricing, pan-India delivery.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Jawahar Printing Press — Print with Precision, Deliver with Speed',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Jawahar Printing Press Rohtak — Premium Printing Since 1972',
    description: "Haryana's most trusted print partner since 1972. Order online, track live.",
    images: [`${SITE_URL}/og-image.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: { canonical: SITE_URL },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION ?? '' },
}

export const viewport: Viewport = {
  themeColor: '#2D6FFF',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'PrintMediaOrganization'],
      '@id': `${SITE_URL}/#business`,
      name: 'Jawahar Printing Press',
      alternateName: 'JPP Rohtak',
      description: 'Premium printing services since 1972. Business cards, brochures, banners, packaging and more with bulk pricing and pan-India delivery.',
      url: SITE_URL,
      telephone: '+91-9999999999',
      email: 'info@jawaharprintingpress.com',
      foundingDate: '1972',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Old Civil Hospital',
        addressLocality: 'Rohtak',
        addressRegion: 'Haryana',
        postalCode: '124001',
        addressCountry: 'IN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 28.8955, longitude: 76.5799 },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
      ],
      priceRange: '₹₹',
      paymentAccepted: ['Cash', 'Credit Card', 'UPI', 'Net Banking'],
      currenciesAccepted: 'INR',
      areaServed: { '@type': 'Country', name: 'India' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Printing Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Card Printing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brochure Printing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Banner & Flex Printing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Packaging Box Printing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Card Printing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Letterhead & Stationery' } },
        ],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '847',
        bestRating: '5',
        worstRating: '1',
      },
      sameAs: [SITE_URL],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Jawahar Printing Press',
      publisher: { '@id': `${SITE_URL}/#business` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalog?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
        <link rel="preload" as="font" crossOrigin="anonymous"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Rohtak, Haryana, India" />
        <meta name="geo.position" content="28.8955;76.5799" />
        <meta name="ICBM" content="28.8955, 76.5799" />
        <meta httpEquiv="content-language" content="en-IN" />
        <link rel="alternate" hrefLang="en-IN" href={SITE_URL} />
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-body antialiased bg-bg-primary text-text-primary`}>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Preloader />
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
