import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jawaharprintingpress.com'

const CATEGORIES = [
  'business-cards',
  'brochures',
  'banners',
  'packaging',
  'letterheads',
  'wedding-cards',
  'photo-printing',
  'merchandise',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/catalog`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/about`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/order/cart`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/order/checkout`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/order/custom`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/login`,                 lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/register`,              lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/catalog/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...categoryPages]
}
