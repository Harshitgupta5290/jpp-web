# Jawahar Printing Press — Web Platform

> *Print with Precision. Deliver with Speed.*

Full-stack e-commerce platform for **Jawahar Printing Press**, Rohtak (Est. 1972) — built to be the benchmark for printing business websites across India.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript — strict mode |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Payments | Razorpay (50% advance + balance) |
| Storage | Supabase Storage (design uploads) |
| AI | Anthropic Claude API (design brief generator) |
| WhatsApp | WATI API (order notifications) |
| Email | Resend |
| State | Zustand (cart + UI) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Getting Started

> **Requires Node 18+.** The system default may be older — use nvm:
> ```bash
> export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20
> ```

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase, Razorpay, Anthropic, WATI, and Resend credentials
```

### 3. Run development server
```bash
npm run dev
# → http://localhost:3000
```

### 4. Build for production
```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signature secret |
| `ANTHROPIC_API_KEY` | Claude API key (AI design brief feature) |
| `WATI_API_KEY` | WATI WhatsApp API key |
| `WATI_WHATSAPP_NUMBER` | WhatsApp number with country code |
| `RESEND_API_KEY` | Resend email API key |
| `NEXT_PUBLIC_SITE_URL` | Your deployed site URL |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── catalog/            # Product catalog + [category] + [product]
│   ├── contact/            # Contact form
│   ├── login/              # Auth — sign in
│   ├── register/           # Auth — sign up
│   ├── order/
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout + Razorpay payment
│   │   └── custom/         # Custom order request
│   ├── track/[orderId]/    # Order status tracker
│   └── api/
│       └── razorpay/       # Payment API routes
├── components/
│   ├── ui/                 # Button, Card, Input, Modal, Badge, Skeleton, Toast
│   ├── layout/             # Navbar, Footer, PageWrapper
│   ├── home/               # Hero, TrustStrip, CategoryGrid, HowItWorks, PriceCalculator, Testimonials, FloatingWhatsApp
│   ├── product/            # ProductCard, ProductGallery, SpecSelector, QuantityPriceCalculator, FileUpload
│   └── order/              # CartItem, OrderSummary
├── hooks/                  # useScrolled, useHasMounted
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   ├── utils/              # formatters, pricing, order-number
│   └── mock-data.ts        # Static product/category data (swap with DB queries)
├── store/                  # Zustand — cartStore, uiStore
└── types/                  # database.ts, product.ts, order.ts
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — Hero, Trust Strip, Category Grid, How It Works, Price Calculator, Testimonials |
| `/about` | Company story, timeline, values |
| `/catalog` | All products with search + category filter |
| `/catalog/[category]` | Products by category |
| `/catalog/[category]/[product]` | Product detail — specs, live pricing, file upload, add to cart |
| `/order/cart` | Shopping cart |
| `/order/checkout` | Address form + Razorpay payment (50% advance) |
| `/order/custom` | Custom order via WhatsApp |
| `/track/[orderId]` | Order status tracker |
| `/login` | Sign in |
| `/register` | Create account |
| `/contact` | Contact form |

---

## Payment Flow

```
Add to Cart
  → Checkout (fill address)
    → Pay 50% advance via Razorpay
      → POST /api/razorpay/create-order   (creates Razorpay order)
      → Razorpay modal opens
      → POST /api/razorpay/verify         (verifies HMAC signature)
      → Order confirmed → WhatsApp notification
        → Admin marks order "Ready"
          → Balance payment link sent via WhatsApp
            → Customer pays online OR cash on delivery
```

---

## Design System

| Token | Value |
|---|---|
| Background | `#0A0F1E` (primary), `#111827` (secondary), `#161D2F` (card) |
| Brand Blue | `#2D6FFF` |
| Brand Gold | `#F5C518` |
| Success | `#10B981` |
| Error | `#EF4444` |
| Font Display | Clash Display (Fontshare) |
| Font Body | Inter (Google Fonts) |
| Font Mono | JetBrains Mono (Google Fonts) |

---

## Database (Supabase)

Tables: `profiles`, `categories`, `products`, `pricing_slabs`, `orders`, `order_items`, `order_status_history`, `reviews`, `payment_links`

All tables have Row Level Security (RLS) policies. Run migrations from `/supabase/migrations/` (coming soon).

---

## What's Next

- [ ] Supabase database migrations + seed data
- [ ] Admin dashboard (order management, analytics)
- [ ] Customer dashboard (order history, tracking)
- [ ] AI design brief generator (Claude API)
- [ ] WhatsApp order notifications (WATI)
- [ ] Email confirmations (Resend)
- [ ] Live card preview (Canvas)
- [ ] Auth flows (Supabase Auth)

---

*Built with ❤️ for Jawahar Printing Press, Rohtak*
