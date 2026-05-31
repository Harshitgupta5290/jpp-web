import type { Category, Product, PricingSlab } from '@/types/product'

// ─── Categories ───────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Business Cards', slug: 'business-cards', description: 'Premium matte, glossy, and spot-UV cards that make a lasting first impression.', icon: 'CreditCard', image_url: null, display_order: 1, is_active: true, created_at: '' },
  { id: 'cat-2', name: 'Brochures', slug: 'brochures', description: 'Tri-fold, bi-fold, and Z-fold brochures in any size and finish.', icon: 'BookOpen', image_url: null, display_order: 2, is_active: true, created_at: '' },
  { id: 'cat-3', name: 'Banners & Flex', slug: 'banners', description: 'Outdoor flex, vinyl, and canvas banners for every occasion.', icon: 'Megaphone', image_url: null, display_order: 3, is_active: true, created_at: '' },
  { id: 'cat-4', name: 'Packaging Boxes', slug: 'packaging', description: 'Custom printed boxes for every product — rigid, folding, and corrugated.', icon: 'Package', image_url: null, display_order: 4, is_active: true, created_at: '' },
  { id: 'cat-5', name: 'Letterheads & Stationery', slug: 'letterheads', description: 'Corporate stationery sets — letterheads, envelopes, notepads.', icon: 'FileText', image_url: null, display_order: 5, is_active: true, created_at: '' },
  { id: 'cat-6', name: 'Wedding Cards', slug: 'wedding-cards', description: 'Elegant invitation cards, inserts, and envelopes for every occasion.', icon: 'Heart', image_url: null, display_order: 6, is_active: true, created_at: '' },
  { id: 'cat-7', name: 'Photo Printing', slug: 'photo-printing', description: 'High-resolution photo prints on glossy, matte, and canvas.', icon: 'ImageIcon', image_url: null, display_order: 7, is_active: true, created_at: '' },
  { id: 'cat-8', name: 'Branded Merchandise', slug: 'merchandise', description: 'T-shirts, mugs, pens, and more with your logo.', icon: 'Shirt', image_url: null, display_order: 8, is_active: true, created_at: '' },
]

// ─── Products ─────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  // Business Cards
  {
    id: 'prod-bc-1', category_id: 'cat-1', name: 'Standard Business Cards', slug: 'standard-business-cards',
    description: 'Classic 3.5×2" business cards printed on 350 GSM art board. Available in matte and glossy lamination. Perfect for professionals, freelancers, and businesses of all sizes.',
    base_price: 3.99, min_quantity: 100, is_custom_pricing: false, has_live_preview: true,
    specifications: { sizes: ['3.5×2"', '3.5×2.5"', 'Square 2.5×2.5"'], paperTypes: ['350 GSM Art Board', '400 GSM Premium'], finishes: ['Matte Lamination', 'Glossy Lamination', 'Spot UV'], sides: ['Single Side', 'Double Side'] },
    images: [], is_active: true, display_order: 1, created_at: '',
  },
  {
    id: 'prod-bc-2', category_id: 'cat-1', name: 'Premium Business Cards', slug: 'premium-business-cards',
    description: 'Ultra-premium business cards on 600 GSM soft-touch board with edge painting and foil options. Makes an unforgettable first impression.',
    base_price: 8.99, min_quantity: 50, is_custom_pricing: false, has_live_preview: true,
    specifications: { sizes: ['3.5×2"', 'Square 2.5×2.5"'], paperTypes: ['600 GSM Soft Touch', '600 GSM Cotton'], finishes: ['Matte Soft Touch', 'Gold Foil', 'Silver Foil', 'Edge Painting'], sides: ['Double Side'] },
    images: [], is_active: true, display_order: 2, created_at: '',
  },
  {
    id: 'prod-bc-3', category_id: 'cat-1', name: 'Transparent Business Cards', slug: 'transparent-business-cards',
    description: 'Eye-catching transparent PVC business cards. Modern and professional — stand out from the crowd.',
    base_price: 12.99, min_quantity: 50, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['3.5×2"'], paperTypes: ['PVC Transparent', 'Frosted PVC'], finishes: ['Gloss', 'Frosted'], sides: ['Single Side', 'Double Side'] },
    images: [], is_active: true, display_order: 3, created_at: '',
  },
  // Brochures
  {
    id: 'prod-br-1', category_id: 'cat-2', name: 'A4 Tri-Fold Brochure', slug: 'a4-tri-fold-brochure',
    description: 'The most popular brochure format for marketing, menus, and product catalogs. Printed on 130 GSM art paper with full-color double-sided printing.',
    base_price: 8.0, min_quantity: 100, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['A4 (Folds to A5)', 'A3 (Folds to A4)'], paperTypes: ['130 GSM Art Paper', '170 GSM Art Paper'], finishes: ['Matte Lamination', 'Glossy Lamination', 'No Lamination'], sides: ['Double Side'] },
    images: [], is_active: true, display_order: 1, created_at: '',
  },
  {
    id: 'prod-br-2', category_id: 'cat-2', name: 'A5 Bi-Fold Brochure', slug: 'a5-bi-fold-brochure',
    description: 'Compact and easy-to-distribute A5 bi-fold brochures. Great for flyers, event programs, and small catalogs.',
    base_price: 5.5, min_quantity: 100, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['A5 (Folds to A6)', 'DL (Folds to 1/3 A4)'], paperTypes: ['130 GSM Art Paper', '170 GSM Art Paper'], finishes: ['Matte Lamination', 'Glossy Lamination'], sides: ['Double Side'] },
    images: [], is_active: true, display_order: 2, created_at: '',
  },
  // Banners
  {
    id: 'prod-bn-1', category_id: 'cat-3', name: 'Outdoor Flex Banner', slug: 'outdoor-flex-banner',
    description: 'Heavy-duty 270 GSM backlit/frontlit flex banners for outdoor advertising. UV-resistant inks, reinforced edges, and grommets included.',
    base_price: 35.0, min_quantity: 1, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['2×4 ft', '3×6 ft', '4×8 ft', '5×10 ft', 'Custom Size'], paperTypes: ['270 GSM Frontlit Flex', '510 GSM Blockout Flex'], finishes: ['Matte', 'Glossy'], sides: ['Single Side', 'Double Side'] },
    images: [], is_active: true, display_order: 1, created_at: '',
  },
  {
    id: 'prod-bn-2', category_id: 'cat-3', name: 'Roll-Up Banner Stand', slug: 'roll-up-banner-stand',
    description: 'Professional roll-up banner stands for exhibitions, trade shows, and retail. Includes premium aluminum stand and carry bag.',
    base_price: 899.0, min_quantity: 1, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['85×200 cm', '100×200 cm'], paperTypes: ['PVC Flex', 'Satin Fabric'], finishes: ['Glossy', 'Matte'], sides: ['Single Side'] },
    images: [], is_active: true, display_order: 2, created_at: '',
  },
  // Letterheads
  {
    id: 'prod-lh-1', category_id: 'cat-5', name: 'Corporate Letterhead', slug: 'corporate-letterhead',
    description: 'Professional A4 letterheads on 90 GSM premium bond paper. Consistent branding for all your business correspondence.',
    base_price: 4.5, min_quantity: 100, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['A4'], paperTypes: ['90 GSM Bond', '100 GSM Premium Bond'], finishes: ['No Lamination'], sides: ['Single Side'] },
    images: [], is_active: true, display_order: 1, created_at: '',
  },
  // Wedding Cards
  {
    id: 'prod-wc-1', category_id: 'cat-6', name: 'Classic Wedding Invitation', slug: 'classic-wedding-invitation',
    description: 'Elegant wedding invitation cards on 350 GSM premium art board. Available with gold/silver foil, embossing, and laser cutting.',
    base_price: 25.0, min_quantity: 50, is_custom_pricing: false, has_live_preview: false,
    specifications: { sizes: ['A5 (5.5×8.5")', 'A6 (4.1×5.8")', 'Square 5×5"'], paperTypes: ['350 GSM Art Board', '400 GSM Textured'], finishes: ['Matte Lamination', 'Gold Foil', 'Silver Foil', 'Embossed'], sides: ['Double Side'] },
    images: [], is_active: true, display_order: 1, created_at: '',
  },
]

// ─── Pricing Slabs ────────────────────────────────────────────────────────────

export const MOCK_SLABS: Record<string, PricingSlab[]> = {
  'prod-bc-1': [
    { id: 's1', product_id: 'prod-bc-1', min_qty: 100, max_qty: 499, price_per_unit: 3.99, created_at: '' },
    { id: 's2', product_id: 'prod-bc-1', min_qty: 500, max_qty: 999, price_per_unit: 2.99, created_at: '' },
    { id: 's3', product_id: 'prod-bc-1', min_qty: 1000, max_qty: 4999, price_per_unit: 1.99, created_at: '' },
    { id: 's4', product_id: 'prod-bc-1', min_qty: 5000, max_qty: null, price_per_unit: 1.49, created_at: '' },
  ],
  'prod-bc-2': [
    { id: 's5', product_id: 'prod-bc-2', min_qty: 50, max_qty: 249, price_per_unit: 8.99, created_at: '' },
    { id: 's6', product_id: 'prod-bc-2', min_qty: 250, max_qty: 999, price_per_unit: 6.99, created_at: '' },
    { id: 's7', product_id: 'prod-bc-2', min_qty: 1000, max_qty: null, price_per_unit: 5.49, created_at: '' },
  ],
  'prod-bc-3': [
    { id: 's8', product_id: 'prod-bc-3', min_qty: 50, max_qty: 249, price_per_unit: 12.99, created_at: '' },
    { id: 's9', product_id: 'prod-bc-3', min_qty: 250, max_qty: null, price_per_unit: 9.99, created_at: '' },
  ],
  'prod-br-1': [
    { id: 's10', product_id: 'prod-br-1', min_qty: 100, max_qty: 499, price_per_unit: 8.0, created_at: '' },
    { id: 's11', product_id: 'prod-br-1', min_qty: 500, max_qty: 999, price_per_unit: 5.5, created_at: '' },
    { id: 's12', product_id: 'prod-br-1', min_qty: 1000, max_qty: null, price_per_unit: 3.99, created_at: '' },
  ],
  'prod-br-2': [
    { id: 's13', product_id: 'prod-br-2', min_qty: 100, max_qty: 499, price_per_unit: 5.5, created_at: '' },
    { id: 's14', product_id: 'prod-br-2', min_qty: 500, max_qty: null, price_per_unit: 3.5, created_at: '' },
  ],
  'prod-bn-1': [
    { id: 's15', product_id: 'prod-bn-1', min_qty: 1, max_qty: 4, price_per_unit: 350.0, created_at: '' },
    { id: 's16', product_id: 'prod-bn-1', min_qty: 5, max_qty: 19, price_per_unit: 280.0, created_at: '' },
    { id: 's17', product_id: 'prod-bn-1', min_qty: 20, max_qty: null, price_per_unit: 220.0, created_at: '' },
  ],
  'prod-bn-2': [
    { id: 's18', product_id: 'prod-bn-2', min_qty: 1, max_qty: 4, price_per_unit: 899.0, created_at: '' },
    { id: 's19', product_id: 'prod-bn-2', min_qty: 5, max_qty: null, price_per_unit: 799.0, created_at: '' },
  ],
  'prod-lh-1': [
    { id: 's20', product_id: 'prod-lh-1', min_qty: 100, max_qty: 499, price_per_unit: 4.5, created_at: '' },
    { id: 's21', product_id: 'prod-lh-1', min_qty: 500, max_qty: 999, price_per_unit: 3.0, created_at: '' },
    { id: 's22', product_id: 'prod-lh-1', min_qty: 1000, max_qty: null, price_per_unit: 2.25, created_at: '' },
  ],
  'prod-wc-1': [
    { id: 's23', product_id: 'prod-wc-1', min_qty: 50, max_qty: 149, price_per_unit: 25.0, created_at: '' },
    { id: 's24', product_id: 'prod-wc-1', min_qty: 150, max_qty: 499, price_per_unit: 20.0, created_at: '' },
    { id: 's25', product_id: 'prod-wc-1', min_qty: 500, max_qty: null, price_per_unit: 16.0, created_at: '' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return MOCK_CATEGORIES.find((c) => c.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = getCategoryBySlug(categorySlug)
  if (!cat) return []
  return MOCK_PRODUCTS.filter((p) => p.category_id === cat.id && p.is_active)
}

export function getProductBySlug(productSlug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === productSlug && p.is_active)
}

export function getSlabs(productId: string): PricingSlab[] {
  return MOCK_SLABS[productId] ?? []
}

export function getProductWithCategory(productSlug: string) {
  const product = getProductBySlug(productSlug)
  if (!product) return null
  const category = MOCK_CATEGORIES.find((c) => c.id === product.category_id) ?? null
  const slabs = getSlabs(product.id)
  return { product, category, slabs }
}

// Category accent colors keyed by slug — light theme
export const CATEGORY_COLORS: Record<string, {
  icon: string; bg: string; border: string;
  soft: string; softBorder: string; color: string;
  gradientStart: string; gradientEnd: string; gradientLight: string;
}> = {
  'business-cards': { icon: 'text-blue-600',   bg: 'from-blue-500 to-blue-700',    border: 'hover:border-blue-300',   soft: 'bg-blue-50',   softBorder: 'border-blue-100',   color: '#2D6FFF', gradientStart: '#1d4ed8', gradientEnd: '#3b82f6', gradientLight: '#bfdbfe' },
  'brochures':      { icon: 'text-purple-600',  bg: 'from-purple-500 to-purple-700',border: 'hover:border-purple-300', soft: 'bg-purple-50', softBorder: 'border-purple-100', color: '#9333EA', gradientStart: '#7c3aed', gradientEnd: '#a855f7', gradientLight: '#e9d5ff' },
  'banners':        { icon: 'text-orange-600',  bg: 'from-orange-500 to-orange-700',border: 'hover:border-orange-300', soft: 'bg-orange-50', softBorder: 'border-orange-100', color: '#EA580C', gradientStart: '#c2410c', gradientEnd: '#f97316', gradientLight: '#fed7aa' },
  'packaging':      { icon: 'text-green-600',   bg: 'from-green-500 to-green-700',  border: 'hover:border-green-300',  soft: 'bg-green-50',  softBorder: 'border-green-100',  color: '#16A34A', gradientStart: '#15803d', gradientEnd: '#22c55e', gradientLight: '#bbf7d0' },
  'letterheads':    { icon: 'text-cyan-600',    bg: 'from-cyan-500 to-cyan-700',    border: 'hover:border-cyan-300',   soft: 'bg-cyan-50',   softBorder: 'border-cyan-100',   color: '#0891B2', gradientStart: '#0e7490', gradientEnd: '#06b6d4', gradientLight: '#a5f3fc' },
  'wedding-cards':  { icon: 'text-pink-600',    bg: 'from-pink-500 to-pink-700',    border: 'hover:border-pink-300',   soft: 'bg-pink-50',   softBorder: 'border-pink-100',   color: '#DB2777', gradientStart: '#be185d', gradientEnd: '#ec4899', gradientLight: '#fbcfe8' },
  'photo-printing': { icon: 'text-yellow-600',  bg: 'from-yellow-500 to-yellow-700',border: 'hover:border-yellow-300', soft: 'bg-yellow-50', softBorder: 'border-yellow-100', color: '#CA8A04', gradientStart: '#a16207', gradientEnd: '#eab308', gradientLight: '#fef9c3' },
  'merchandise':    { icon: 'text-indigo-600',  bg: 'from-indigo-500 to-indigo-700',border: 'hover:border-indigo-300', soft: 'bg-indigo-50', softBorder: 'border-indigo-100', color: '#4F46E5', gradientStart: '#4338ca', gradientEnd: '#6366f1', gradientLight: '#c7d2fe' },
}
