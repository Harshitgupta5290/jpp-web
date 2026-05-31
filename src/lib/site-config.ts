/**
 * Site configuration — reads from Supabase `site_settings` table when available,
 * falls back to env vars or hardcoded defaults.
 * Admin can update these from /admin/settings.
 */

export interface SiteConfig {
  phone: string
  whatsapp: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  businessHours: string
  gst: string
  razorpayKeyId: string
  announcementBar: {
    enabled: boolean
    messages: { text: string; highlight: string; suffix: string; cta: string; href: string }[]
  }
  socialLinks: { instagram: string; facebook: string; youtube: string }
}

export const DEFAULT_CONFIG: SiteConfig = {
  phone:        process.env.NEXT_PUBLIC_PHONE        ?? '+91 99999 99999',
  whatsapp:     process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999',
  email:        process.env.NEXT_PUBLIC_EMAIL        ?? 'info@jawaharprintingpress.com',
  address:      'Near Old Civil Hospital',
  city:         'Rohtak',
  state:        'Haryana',
  pincode:      '124001',
  businessHours:'Mon–Sat, 9 AM – 7 PM IST',
  gst:          '06AABCJ1234M1Z5',
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
  announcementBar: {
    enabled: true,
    messages: [
      { text: 'New customer offer: Use code ', highlight: 'FIRST10', suffix: ' for 10% off your first order', cta: 'Claim Now', href: '/order/custom' },
      { text: 'Free pan-India delivery on orders above ', highlight: '₹999', suffix: ' — same week turnaround guaranteed', cta: 'Browse Products', href: '/catalog' },
      { text: '⚡ Same-day dispatch for orders placed before ', highlight: '12 PM', suffix: ' — Mon to Sat', cta: 'Order Now', href: '/order/custom' },
    ],
  },
  socialLinks: { instagram: '#', facebook: '#', youtube: '#' },
}

/** Client-side: simple localStorage cache with 5-min TTL */
export function getClientConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const cached = localStorage.getItem('jpp_site_config')
    if (cached) {
      const { config, ts } = JSON.parse(cached)
      if (Date.now() - ts < 5 * 60 * 1000) return config
    }
  } catch { /* ignore */ }
  return DEFAULT_CONFIG
}

export function cacheClientConfig(config: SiteConfig) {
  try {
    localStorage.setItem('jpp_site_config', JSON.stringify({ config, ts: Date.now() }))
  } catch { /* ignore */ }
}
