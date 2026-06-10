# Jawahar Printing Press — Codebase Documentation

> **Auto-maintained:** Whenever you modify source files, update the relevant section of this file.  
> Last updated: 2026-05-31

---

## 1. Project Overview

Full-stack e-commerce + admin platform for **Jawahar Printing Press** (est. 1972, Rohtak, Haryana) — India's best printing business website goal. Customers browse products, configure specs, calculate bulk pricing, place orders and track them. Admins manage everything from a protected dashboard.

---

## 2. Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 14.2.35 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| Animation | Framer Motion | ^12 |
| Database | Supabase (Postgres + Auth + Storage) | @supabase/ssr ^0.10.3 |
| Payments | Razorpay | ^2.9.6 |
| Email | Resend | ^6 |
| State | Zustand (persist middleware) | ^5 |
| Icons | Lucide React | ^1.17 |
| Forms | React Hook Form + Zod | ^7 / ^4 |
| Deploy | Vercel | — |

**Node:** Must use Node 20 via nvm — `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20`. System Node is v12.

---

## 3. Dev Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build + type-check + lint
npm run start    # Serve production build
npm run lint     # ESLint only
```

---

## 4. Design System

### Theme — Light (current)

Defined in `tailwind.config.ts` and used via Tailwind utility classes throughout.

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#FFFFFF` | Page backgrounds |
| `bg-secondary` | `#F8FAFC` | Section alt backgrounds |
| `bg-dark` | `#0F172A` | Footer, PrintingProcess section |
| `brand-blue` | `#2D6FFF` | Primary CTA, links, nav |
| `brand-gold` | `#F5A500` | Secondary CTA ("Order Now"), accents |
| `text-primary` | `#0F172A` | Body text |
| `text-secondary` | `#64748B` | Subtitles, captions |
| `text-tertiary` | `#94A3B8` | Placeholders, hints |
| `border` | `#E2E8F0` | All borders |
| `success` | `#10B981` | Delivered, approved |
| `error` | `#EF4444` | Errors, cancelled |

### Typography

| Class | Font | Use |
|---|---|---|
| `font-display` | Clash Display (fontshare CDN) | Headings, product names |
| `font-body` | Inter (Google) | All body text |
| `font-price` | JetBrains Mono (Google) | Prices, order numbers, codes |

### Utility Classes (custom in globals.css)

```css
.container-page      /* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */
.section-label       /* small uppercase blue label above headings */
.divider             /* border-b border-border */
.glass               /* frosted glass card */
.shadow-card         /* soft elevation */
.shadow-glow-sm      /* blue glow on brand buttons */
```

---

## 5. Environment Variables

### Required for full functionality

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-side admin ops only

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=   # client-side checkout

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM=                   # e.g. "JPP <noreply@jawaharprintingpress.com>"

# Site
NEXT_PUBLIC_SITE_URL=https://jawaharprintingpress.com
NEXT_PUBLIC_PHONE=+91 99999 99999
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_EMAIL=info@jawaharprintingpress.com
```

> **Graceful degradation:** All Supabase-dependent pages fall back to mock data when env vars are absent. Razorpay routes return mock payment links. Resend skips silently.

---

## 6. Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — fonts, metadata, structured data
│   ├── globals.css             # Global styles + CSS variables
│   ├── icon.svg                # Favicon — Lucide Printer on blue gradient (matches Navbar logo)
│   ├── sitemap.ts              # Dynamic sitemap — async, fetches from Supabase with fallback
│   ├── robots.ts               # Robots.txt
│   │
│   ├── (public pages)
│   │   ├── page.tsx            # Home — 17 sections (see section 13)
│   │   ├── catalog/page.tsx    # Product listing
│   │   ├── catalog/[category]/page.tsx         # Category listing
│   │   ├── catalog/[category]/[product]/page.tsx  # Product detail
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── clients/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── order/cart/page.tsx
│   │   ├── order/checkout/page.tsx
│   │   ├── order/custom/page.tsx
│   │   ├── track/[orderId]/page.tsx
│   │   └── gsm-calculator/page.tsx  # Free Paper GSM Calculator tool — client component, no auth
│   │
│   ├── admin/                  # Protected admin area (role=admin only)
│   │   ├── layout.tsx          # Admin shell — Sidebar + TopBar
│   │   ├── page.tsx            # Redirect → /admin/dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/new/page.tsx
│   │   ├── products/[id]/edit/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── customers/page.tsx
│   │   ├── customers/[id]/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── settings/page.tsx
│   │   └── analytics/page.tsx
│   │
│   └── api/                    # Route Handlers (server-side)
│       ├── admin/
│       │   ├── export-orders/route.ts   # GET  → CSV export
│       │   ├── notifications/route.ts   # GET  → pending order count
│       │   ├── payment-link/route.ts    # POST → Razorpay payment link
│       │   └── send-email/route.ts      # POST → Resend email
│       └── razorpay/
│           ├── create-order/route.ts    # POST → create Razorpay order
│           └── verify/route.ts          # GET/POST → verify payment signature
│
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx      # Left nav with all admin links
│   │   ├── AdminTopBar.tsx       # Header with breadcrumb, notifications, user menu
│   │   ├── AnalyticsPage.tsx     # Revenue/order KPI charts (mock data, period toggle)
│   │   ├── CategoriesPage.tsx    # Full CRUD — Supabase, drag order, active toggle
│   │   ├── MessagesPage.tsx      # contact_messages table — filter, replied toggle
│   │   ├── PricingPage.tsx       # Bulk pricing slab management
│   │   ├── ReviewsPage.tsx       # Approve/reject reviews — Supabase
│   │   └── SettingsPage.tsx      # site_settings table — contact info, announcements
│   ├── home/
│   │   ├── AnnouncementBar.tsx   # Rotating 3 offers, dismissible, blue gradient
│   │   ├── CategoryGrid.tsx      # 8 category cards with gradient icons
│   │   ├── ClientLogos.tsx       # Dual marquee of client logos
│   │   ├── FAQ.tsx               # Accordion
│   │   ├── FeaturedProducts.tsx  # 4 bestsellers with pricing
│   │   ├── FloatingWhatsApp.tsx  # 3 FABs: Email (gold), Phone (blue), WhatsApp (green)
│   │   ├── HeroSection.tsx       # Split hero with CSS product mockups
│   │   ├── HowItWorks.tsx        # 4-step ordering process
│   │   ├── PortfolioGallery.tsx  # Masonry CSS mockup gallery
│   │   ├── PriceCalculator.tsx   # Live bulk pricing calculator
│   │   ├── PrintingProcess.tsx   # Dark section — 6-step offset workflow
│   │   ├── PrintingServices.tsx  # 6 service cards
│   │   ├── ServicesShowcase.tsx  # Illustration-style card grid — 4 product services + 3 tool cards (4+3 grid), placed right after Hero
│   │   ├── Testimonials.tsx      # Dual-row review marquee
│   │   └── TrustStrip.tsx        # 6 USPs
│   ├── layout/
│   │   ├── Footer.tsx            # Dark (#0A0F1E), payment badges, Google Maps embed
│   │   ├── Navbar.tsx            # White, mega-menu Products, search, phone, cart
│   │   ├── PageWrapper.tsx       # Wraps Navbar + Footer around page content
│   │   └── Preloader.tsx         # Initial page load animation
│   ├── product/
│   │   ├── FileUpload.tsx        # Design file drag-and-drop upload
│   │   ├── ProductCard.tsx       # Card used in catalog grid
│   │   ├── ProductGallery.tsx    # Image/mockup gallery on product detail
│   │   ├── QuantityPriceCalculator.tsx  # Slab-based bulk pricing UI
│   │   └── SpecSelector.tsx      # Chip-style specification selector
│   ├── order/
│   │   ├── CartItem.tsx
│   │   └── OrderSummary.tsx
│   ├── auth/
│   │   └── AuthPanel.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx            # variant: primary | secondary | gold | ghost | outline
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx             # Global toast container (reads from uiStore)
│
├── hooks/
│   ├── useHasMounted.ts          # SSR hydration guard
│   └── useScrolled.ts            # Navbar scroll detection
│
├── lib/
│   ├── email/
│   │   ├── send.ts               # Resend wrapper — lazy-init (no module-level new Resend())
│   │   └── templates.ts          # HTML email templates: confirmation, dispatch, quote
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (createBrowserClient)
│   │   ├── server.ts             # Server Supabase client (createServerClient + cookies)
│   │   │                         # NEVER import server.ts in client components
│   │   └── middleware.ts         # updateSession for auth middleware
│   ├── utils/
│   │   ├── formatters.ts         # formatCurrency, formatDate
│   │   ├── order-number.ts       # JPP-YYYY-NNN generator
│   │   └── pricing.ts            # Slab price calculation logic
│   ├── mock-data.ts              # MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SLABS
│   │                             # Products use RAW_MOCK_PRODUCTS + seo null spread
│   ├── razorpay.ts (if present)  # Razorpay helpers
│   └── site-config.ts            # SiteConfig type, DEFAULT_CONFIG, getClientConfig
│                                 # NOTE: No server imports — getServerConfig was removed
│
├── middleware.ts                 # Supabase session refresh on every request
│
├── store/
│   ├── cartStore.ts              # Zustand + persist — cart items, totals
│   └── uiStore.ts                # Zustand — mobile menu, cart drawer, toasts
│
└── types/
    ├── database.ts               # Full Supabase DB type definitions
    ├── order.ts                  # Order-related types
    └── product.ts                # Product, Category, PricingSlab, CartItem, PriceCalculationResult
```

---

## 7. Database Schema (`src/types/database.ts`)

### Tables

#### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | FK to auth.users |
| full_name | text \| null | |
| phone | text \| null | |
| email | text \| null | |
| role | 'customer' \| 'admin' | |
| created_at | timestamptz | |

#### `categories`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| name | text | |
| slug | text | URL segment |
| description | text \| null | |
| icon | text \| null | Lucide icon name string |
| image_url | text \| null | |
| display_order | int \| null | |
| is_active | boolean | Controls catalog visibility |
| created_at | timestamptz | |

#### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| category_id | uuid \| null | FK → categories |
| name | text | |
| slug | text | |
| description | text \| null | |
| base_price | numeric \| null | Per piece, lowest slab |
| min_quantity | int | |
| is_custom_pricing | boolean | |
| has_live_preview | boolean | |
| specifications | jsonb \| null | `{ sizes, paperTypes, finishes, sides }` arrays |
| images | text[] \| null | Storage URLs |
| is_active | boolean | |
| display_order | int \| null | |
| meta_title | text \| null | SEO — max 70 chars |
| meta_description | text \| null | SEO — max 160 chars |
| seo_keywords | text[] \| null | SEO keyword array |
| created_at | timestamptz | |

#### `pricing_slabs`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| product_id | uuid \| null | FK → products |
| min_qty | int | |
| max_qty | int \| null | null = unlimited |
| price_per_unit | numeric | |
| created_at | timestamptz | |

#### `orders`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| order_number | text | Format: `JPP-YYYY-NNN` |
| customer_id | uuid \| null | FK → profiles |
| status | OrderStatus | See enum below |
| subtotal | numeric \| null | |
| tax | numeric | |
| total_amount | numeric \| null | |
| advance_amount | numeric \| null | 50% default |
| balance_amount | numeric \| null | |
| advance_paid | boolean | |
| advance_payment_id | text \| null | Razorpay payment ID |
| advance_payment_method | text \| null | |
| advance_paid_at | timestamptz \| null | |
| balance_paid | boolean | |
| balance_payment_id | text \| null | |
| balance_payment_method | 'online' \| 'cod' \| null | |
| balance_paid_at | timestamptz \| null | |
| delivery_address | jsonb \| null | `{ name, phone, addressLine1, addressLine2, city, state, pincode }` |
| estimated_delivery | timestamptz \| null | |
| actual_delivery | timestamptz \| null | |
| notes | text \| null | Customer-visible note |
| admin_notes | text \| null | Internal only |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `order_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| order_id | uuid \| null | FK → orders |
| product_id | uuid \| null | FK → products |
| product_name | text \| null | Snapshot at order time |
| quantity | int \| null | |
| specifications | jsonb \| null | Selected spec key-value |
| unit_price | numeric \| null | |
| total_price | numeric \| null | |
| design_file_url | text \| null | Supabase Storage URL |
| design_brief | text \| null | |
| needs_design | boolean | Design assistance requested |
| preview_data | jsonb \| null | |
| created_at | timestamptz | |

#### `order_status_history`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| order_id | uuid \| null | FK → orders |
| status | OrderStatus \| null | |
| note | text \| null | |
| changed_by | uuid \| null | FK → profiles |
| created_at | timestamptz | |

#### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| order_id | uuid \| null | |
| customer_id | uuid \| null | |
| rating | int | 1–5 |
| comment | text \| null | |
| images | text[] \| null | |
| is_approved | boolean | Admin must approve before visible |
| created_at | timestamptz | |

#### `payment_links`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| order_id | uuid \| null | |
| razorpay_payment_link_id | text \| null | |
| amount | numeric \| null | |
| type | 'advance' \| 'balance' \| null | |
| status | 'pending' \| 'paid' \| 'expired' | |
| expires_at | timestamptz \| null | |
| created_at | timestamptz | |

#### `contact_messages`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| name | text | |
| phone | text | |
| email | text | |
| message | text | |
| product | text \| null | Product enquired about |
| replied | boolean | Admin toggles in /admin/messages |
| created_at | timestamptz | |

#### `site_settings`
Key-value store. Admin edits via `/admin/settings`.
- Keys mirror `SiteConfig` fields: `phone`, `whatsapp`, `email`, `address`, `city`, `state`, `pincode`, `businessHours`, `gst`, `announcementBar`, `socialLinks`

### Order Status Enum
```ts
type OrderStatus =
  | 'pending_quote'    // Customer placed order, waiting for quote
  | 'quote_sent'       // Admin sent quote to customer
  | 'advance_pending'  // Customer accepted, advance payment pending
  | 'confirmed'        // Advance paid, confirmed
  | 'processing'       // In production
  | 'ready'            // Ready for dispatch
  | 'out_for_delivery' // Dispatched
  | 'delivered'        // Complete
  | 'cancelled'        // Cancelled
```

---

## 8. Authentication & Authorization

- **Auth:** Supabase Auth (email + password)
- **Session:** Refreshed on every request via `src/middleware.ts` → `updateSession`
- **Admin guard:** `src/app/admin/layout.tsx` fetches user profile and redirects non-admins to `/login`
- **Role field:** `profiles.role` — values `'customer'` or `'admin'`
- **API guards:** All `/api/admin/*` routes verify `profiles.role === 'admin'` before executing

---

## 9. Public Catalog Pages

### `/catalog` — Product listing
- Server-fetches categories from Supabase for the category tabs
- Search bar filters products client-side

### `/catalog/[category]` — Category page (`src/app/catalog/[category]/page.tsx`)
- Initialises from `getCategoryBySlug()` / `getProductsByCategory()` (mock) for instant render
- `useEffect` then fetches real data from Supabase and overrides
- Falls back to mock silently on error

### `/catalog/[category]/[product]` — Product detail (`src/app/catalog/[category]/[product]/page.tsx`)
- All hooks declared first (React rules)
- Seeded from `getProductWithCategory()` mock for instant render
- `useEffect` fetches from Supabase — if found, overrides product/category/slabs state
- Spec selectors reset via separate `useEffect([product?.id])`
- Design file upload → stored URL OR "needs design" flag
- Bulk pricing via `QuantityPriceCalculator` + `pricing_slabs`
- Cart via Zustand `cartStore`

---

## 10. Admin Panel

Protected route: `/admin/*` — requires `profiles.role === 'admin'`.

### Layout (`src/app/admin/layout.tsx`)
- `AdminSidebar` (left) + `AdminTopBar` (top) + `{children}` (main)

### Pages

| Route | Component | Key features |
|---|---|---|
| `/admin/dashboard` | inline | KPI cards, recent orders, quick actions |
| `/admin/products` | inline | Product list with edit/delete |
| `/admin/products/new` | inline | Full form: basic info, specs (TagInput), pricing slabs, SEO |
| `/admin/products/[id]/edit` | inline | Same form, pre-loaded from Supabase, SEO fields |
| `/admin/categories` | `CategoriesPage` | Full CRUD, icon picker, active toggle, display order |
| `/admin/orders` | inline | List + search + status filter + **checkbox bulk update** + **Export CSV** |
| `/admin/orders/[id]` | inline | Detail: status timeline, items with design file links, payment buttons, admin notes |
| `/admin/customers` | inline | Customer list |
| `/admin/customers/[id]` | inline | Profile + lifetime stats + order history |
| `/admin/reviews` | `ReviewsPage` | Approve/reject/delete, Supabase |
| `/admin/messages` | `MessagesPage` | Enquiries from `contact_messages`, mark replied |
| `/admin/pricing` | `PricingPage` | Bulk pricing slab editor |
| `/admin/settings` | `SettingsPage` | site_settings upsert — contact info, announcement bar |
| `/admin/analytics` | `AnalyticsPage` | Revenue + order charts (mock data, period toggle) |

### AdminTopBar (`src/components/admin/AdminTopBar.tsx`)
- Real notification count from `GET /api/admin/notifications` (orders in pending states in last 24h)
- Breadcrumb based on `usePathname()`
- User dropdown: profile settings, sign out

---

## 11. API Routes

All admin routes verify session + admin role before executing.

### `GET /api/admin/notifications`
Returns `{ count: number }` — pending/advance_pending orders in last 24 hours.

### `GET /api/admin/export-orders`
Query params: `status`, `from`, `to` (ISO dates).  
Returns CSV file download with columns: Order Number, Status, Customer Name/Email/Phone, Amounts, Dates, Note.

### `POST /api/admin/payment-link`
Body: `{ orderId: string, type: 'advance' | 'balance' }`  
Creates Razorpay payment link, stores in `payment_links`, returns `{ success, url, amount }`.  
Returns mock URL if `RAZORPAY_KEY_ID` not set.

### `POST /api/admin/send-email`
Body: `{ type: 'confirmation' | 'dispatched' | 'quote', orderId: string, ...extras }`  
Fetches order from Supabase, renders HTML template, sends via Resend.  
Skips silently if `RESEND_API_KEY` not set (returns `{ success: false, reason: 'no_api_key' }`).

### `POST /api/razorpay/create-order`
Creates Razorpay order for checkout.

### `GET /api/razorpay/verify`
Verifies Razorpay payment signature on callback.

---

## 12. State Management

### `cartStore` (Zustand + persist → localStorage)
```ts
items: CartItem[]
addItem(item)        // merges if same id
updateItem(id, updates)
removeItem(id)
clearCart()
totalItems()         // computed
totalPrice()         // computed
```

### `uiStore` (Zustand, not persisted)
```ts
isMobileMenuOpen: boolean
isCartOpen: boolean
toasts: Toast[]
setMobileMenuOpen(open)
setCartOpen(open)
addToast({ type, title, message?, duration? })
removeToast(id)
```

---

## 13. Home Page Sections (render order)

| # | Component | Render mode | Notes |
|---|---|---|---|
| 1 | AnnouncementBar | Client (lazy) | 3 rotating offers, dismissible |
| 2 | Navbar | Client (always) | Mega-menu, search, phone, cart |
| 3 | HeroSection | Client (lazy) | Split layout, floating CSS mockups, stats |
| 4 | ServicesShowcase | Client (lazy) | 7 cards — 4 product services + 3 tools (Free Templates, Price Calc, Order Mgmt) in 4+3 grid |
| 5 | TrustStrip | **Server** | 6 USPs on bg-secondary |
| 6 | CategoryGrid | **Server** | 8 categories |
| 7 | ClientLogos | Client (lazy) | Dual-row marquee |
| 8 | FeaturedProducts | Client (lazy) | 4 bestsellers |
| 9 | PrintingProcess | Client (lazy) | Dark section, 6-step offset workflow |
| 10 | PrintingServices | **Server** | 6 service cards |
| 11 | HowItWorks | **Server** | 4-step order process |
| 12 | PriceCalculator | Client (lazy) | Live bulk pricing |
| 13 | PortfolioGallery | Client (lazy) | Masonry CSS gallery |
| 14 | Testimonials | Client (lazy) | Dual-row marquee on bg-secondary |
| 15 | FAQ | **Server** | Accordion |
| 16 | Footer | Client (always) | Dark, payments, Maps |
| 17 | FloatingWhatsApp | Client | 3 FABs: Email, Phone, WhatsApp |

---

## 14. Floating Contact Widget

`src/components/home/FloatingWhatsApp.tsx` — 3 stacked FABs (bottom-right).

| Button | Color | Action |
|---|---|---|
| Email (top) | Gold `#F5A500` | `mailto:` link |
| Phone (middle) | Blue `#2D6FFF` | `tel:` link |
| WhatsApp (bottom, large) | Green `#25D366` | `wa.me` link, pulse ring |

Each has a hover tooltip chip showing label + contact detail.  
Values sourced from `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL`.

---

## 15. SEO

### Sitemap (`src/app/sitemap.ts`)
- **Async** — fetches active categories + products from Supabase at request time
- Falls back to 8 hardcoded category slugs if DB unavailable
- Includes product URLs: `/catalog/{category_slug}/{product_slug}`

### Product SEO Fields
Admin can set per-product `meta_title` (70 chars), `meta_description` (160 chars), `seo_keywords` (array) in the product edit form. Stored in the `products` table.

### Root Metadata (`src/app/layout.tsx`)
- Full OG tags, Twitter card, geo meta, hrefLang
- JSON-LD structured data: LocalBusiness + WebSite schemas
- `metadataBase` set to `NEXT_PUBLIC_SITE_URL`

---

## 16. Key Patterns & Rules

### Client vs Server Imports
- **NEVER** import `@/lib/supabase/server` in client components (uses `next/headers`)
- Client components use `@/lib/supabase/client` → `createBrowserClient`
- Server components/routes use `@/lib/supabase/server` → `createServerClient`
- `site-config.ts` has NO server imports — safe for client components

### Supabase with Mock Fallback Pattern
```ts
// Client component — always try Supabase, fall back to mock on error
useEffect(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { return }
  const load = async () => {
    try {
      const { data } = await (createClient() as any).from('table').select('*')
      if (data?.length) setState(data)
    } catch { /* keep mock */ }
  }
  load()
}, [])
```

### TypeScript Supabase Casting
All Supabase queries use `(supabase as any).from(...)` or typed `.from('table')` to avoid strict type errors on tables not yet in the generated types.

### Resend Email — Lazy Init
```ts
// Always create Resend client inside the function, never at module level
// Module-level new Resend() throws at build time if key is empty
if (!process.env.RESEND_API_KEY) return { success: false }
const resend = new Resend(process.env.RESEND_API_KEY)
```

### Mock Data
`src/lib/mock-data.ts` uses `RAW_MOCK_PRODUCTS` (type without SEO fields) then maps to full `Product[]`:
```ts
export const MOCK_PRODUCTS: Product[] = RAW_MOCK_PRODUCTS.map((p) => ({ ...p, ...seo }))
```

### Bulk Status Update (Orders)
Uses `Array.from(selectedSet)` not spread (`[...set]`) — TypeScript target requires it.

### Admin SEO Form Fields
Both `products/new` and `products/[id]/edit` include:
- `metaTitle` (string state, max 70)
- `metaDescription` (string state, max 160)
- `seoKeywords` (string[] state, TagInput component)

---

## 17. Build Notes

```
Last build output:
  37 routes
  0 TypeScript errors
  0 ESLint errors
  Home First Load JS: 174 kB
  Warnings only (not errors):
    - 'Phone' unused in customers/[id] (pre-existing)
    - 'User' unused in customers page (pre-existing)
    - 'CheckCircle' unused in dashboard (pre-existing)
    - useEffect missing dep 'product' in catalog product page (intentional — resets on id)
```

---

## 18. Auto-Update Instructions for Claude

When making changes to this codebase, update the relevant section above:

- **New page added** → Add to section 6 (Project Structure) and 10 (Admin) or 9 (Public)
- **New DB table/column** → Update section 7 (Database Schema)  
- **New API route** → Update section 11 (API Routes)
- **Design token changed** → Update section 4 (Design System)
- **New env var** → Update section 5 (Environment Variables)
- **New component** → Update section 6 (Project Structure)
- **Build stats changed** → Update section 17 (Build Notes)
- **New pattern introduced** → Update section 16 (Key Patterns)
- **State store changed** → Update section 12 (State Management)
