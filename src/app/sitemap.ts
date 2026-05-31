import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jawaharprintingpress.com'

const FALLBACK_CATEGORIES = [
  'business-cards', 'brochures', 'banners', 'packaging',
  'letterheads', 'wedding-cards', 'photo-printing', 'merchandise',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/catalog`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/order/custom`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/order/cart`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/order/checkout`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/login`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/register`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  let categorySlugs: string[] = FALLBACK_CATEGORIES
  let productEntries: MetadataRoute.Sitemap = []

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = createClient()

      const [{ data: cats }, { data: prods }] = await Promise.all([
        (supabase as any).from('categories').select('slug, updated_at').eq('is_active', true).order('display_order'),
        (supabase as any).from('products').select('slug, updated_at, categories(slug)').eq('is_active', true).order('display_order'),
      ])

      if (cats?.length) {
        categorySlugs = (cats as any[]).map((c: any) => c.slug)
      }

      if (prods?.length) {
        productEntries = (prods as any[])
          .filter((p: any) => p.categories?.slug)
          .map((p: any) => ({
            url: `${SITE_URL}/catalog/${p.categories.slug}/${p.slug}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
      }
    }
  } catch { /* use fallbacks */ }

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/catalog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...categoryPages, ...productEntries]
}
