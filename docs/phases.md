# MSB Japan Site — Phase Implementation Summary

## Phase 0: Architecture & Scaffolding (Complete)

**Goal:** Buildable, testable foundation with auth, RBAC, i18n, database schema, and CI.

### Deliverables

- **Project scaffolding:** Next.js 16 App Router, TypeScript strict + `noUncheckedIndexedAccess`, pnpm
- **Tailwind + shadcn/ui:** Custom MSBJ theme (ivory, charcoal, burgundy, saffron) + 11 shadcn components (button, card, input, label, sonner, dropdown-menu, sheet, dialog, badge, separator, skeleton)
- **Database schema (Prisma 7):** 33+ models across Auth/RBAC, Events, Content, Contacts, Donations, Commerce, Integrations, Platform. Driver adapter pattern with `@prisma/adapter-pg`, `prisma.config.ts`
- **Auth.js (NextAuth v5):** Google OAuth + dev-only Credentials, JWT sessions enriched with roles/permissions
- **RBAC system:** 14 permissions, 6 roles (Administrator, Editor, Translator, Event Coordinator, Commerce Manager, Analyst), `requirePermission()` / `hasPermission()` / `hasRole()` helpers
- **i18n:** `ja`/`en` locale routing via proxy (Next.js 16), cookie/Accept-Language detection, dictionary system
- **Validation:** Zod schemas for contact, newsletter, event registration, donation
- **Testing:** Vitest + jest-dom (unit tests), Playwright config (e2e)
- **CI:** GitHub Actions (lint-and-typecheck, test, e2e jobs)
- **Documentation:** architecture.md, database.md, i18n.md

### Key Technical Decisions

- Next.js 16 renames `middleware.ts` to `proxy.ts` with `export function proxy()`
- `params` is a `Promise` — all layouts/pages use `await params`
- Prisma 7 requires `prisma.config.ts` with `datasource.url` and driver adapter

### File Count: ~40 files | Routes: 7 | Tests: 11

---

## Phase 1: Public Informational Website (Complete)

**Goal:** Full public-facing site with bilingual navigation, content pages, and SEO.

### Deliverables

- **Header:** Sticky header with desktop nav (7 links), mobile hamburger Sheet menu, language switcher (EN/JA), donate CTA button
- **Footer:** 4-column layout — branding, nav links, learn more, legal links
- **Homepage:** Hero section (dark bg), 3 visitor cards, centres section, donate CTA, newsletter signup form
- **Content pages:**
  - `/[locale]/about` — mission, history, 4 values cards
  - `/[locale]/centres` — Tashi Gachil + Tashi Choling with anchor links
  - `/[locale]/teachers` — placeholder teacher data (Tsoknyi Rinpoche)
  - `/[locale]/start` — first-time visitor: offerings grid, 3-step guide, FAQ
  - `/[locale]/events` — placeholder
  - `/[locale]/teachings` — placeholder
  - `/[locale]/contact` — placeholder
  - `/[locale]/donate` — placeholder
  - `/[locale]/privacy` — placeholder
  - `/[locale]/tokushoho` — placeholder
  - 404 not-found (bilingual)
- **SEO:** `generateMetadata` on all pages, Open Graph, JSON-LD Organization schema, `/sitemap.xml`, `/robots.txt`, canonical URLs, `hreflang` alternates
- **i18n:** Full Japanese and English dictionaries (home, about, centres, teachers, start, events, metadata, footer)

### Components Created

- `SiteHeader`, `SiteFooter`, `LanguageSwitcher`, `MobileNav`, `NewsletterForm`

### File Count: ~55 files | Routes: 17 | Tests: 11

---

## Phase 2: Events & Contact (Complete)

**Goal:** Event management system, public event listings with registration, and contact form.

### Deliverables

- **Server actions/queries:**
  - Events: `getPublishedEvents` (filters: mode, beginner), `getEventBySlug`, `getEventById`, `getAllEventsAdmin`, `createEvent`, `updateEvent`, `deleteEvent`
  - Registrations: `registerForEvent` with capacity tracking, waitlist logic, multi-attendee
  - Contacts: `submitContactForm` (rate limited: 5/hour per IP), `getContactMessages`, `updateContactStatus`, `addContactNote`
- **Admin dashboard:**
  - Sidebar navigation (Dashboard, Events, Contacts, Content, Donations, Products, Settings)
  - `/admin/events` — event list table with status badges, registration counts
  - `/admin/events/new` — full event form (bilingual, schedule, mode, pricing, capacity, beginner flag)
  - `/admin/events/[id]` — edit + registration summary
  - `/admin/contacts` — message list with status badges, notes, status transitions (New → Read → Replied → Archive)
- **Public event system:**
  - `/[locale]/events` — listing with mode filter, beginner-friendly checkbox
  - `/[locale]/events/[slug]` — detail page (date, venue, capacity/spots, description, calendar download, registration form)
  - Registration form: multi-attendee support, waitlist messaging
- **Public contact form:** `/[locale]/contact` — name, email, subject, message with Zod validation
- **Calendar download:** `lib/calendar.ts` ICS generator + `/api/events/[id]/calendar` endpoint

### Components Created

- `EventFilters`, `RegistrationForm`, `ContactForm`, `EventForm`, `ContactStatusActions`, `AdminSidebar`

### File Count: ~70 files | Routes: 24 | Tests: 14

---

## Phase 3: Content & Editorial Dashboard (Complete)

**Goal:** Content management with editorial workflow, teachings library, and redirect manager.

### Deliverables

- **Server actions/queries:**
  - Content: `getPublishedPosts` (filters: type, teacher), `getPostBySlug`, `getAllPostsAdmin` (filters: type, status, search), `getPostById`, `getTeachers`
  - Content CRUD: `createContentPost`, `updateContentPost`, `deleteContentPost`, `updatePostStatus`
  - Redirects: `getAllRedirects`, `createRedirect` (with loop detection), `deleteRedirect`, `importRedirectsFromCSV`
- **Admin content management:**
  - `/admin/content` — content list with type/status/search filters
  - `/admin/content/new` — full content form (bilingual title/slug/excerpt/body, type, status, teacher, image/media URLs, scheduled publish date)
  - `/admin/content/[id]` — edit + editorial workflow status actions
  - Editorial workflow buttons: Draft → Review → Approved → Published/Scheduled → Archived (with permission-appropriate transitions)
- **Admin redirect manager:**
  - `/admin/redirects` — redirect list table
  - Add redirect form with loop detection
  - CSV import (from,to,status format)
- **Public teachings:**
  - `/[locale]/teachings` — listing with type badges, teacher names, dates
  - `/[locale]/teachings/[slug]` — detail page with audio/video player support, body content
- **RBAC enforcement:** Content CRUD respects `content.read`, `content.create`, `content.edit`, `content.review`, `content.publish` permissions

### Components Created

- `ContentFilters`, `ContentForm`, `ContentStatusActions`, `RedirectActions`

### File Count: ~85 files | Routes: 29 | Tests: 14

---

## Phase 4: Donations (Complete)

**Goal:** Donation page with Stripe Checkout integration.

### Deliverables

- **Stripe integration:**
  - `lib/stripe/index.ts` — Lazy-initialized Stripe client (no build-time crash without keys)
  - `lib/stripe/checkout.ts` — `createDonationCheckoutSession` for one-time and recurring (monthly subscription) donations
- **Server actions/queries:**
  - `createDonation` — validates with Zod, creates Stripe Checkout session, records pending donation in DB
  - `getAllDonationsAdmin` — filtered by status and type (one-time/recurring), RBAC-protected (donations.read)
  - `getDonationStats` — aggregate stats (total, completed, recurring count, total amount)
- **Stripe webhook handler:** `/api/webhooks/stripe` — signature-verified, idempotent (StripeEvent table dedup)
  - `checkout.session.completed` → marks donation COMPLETED, records subscription ID for recurring
  - `checkout.session.expired` → marks PENDING donations as FAILED
  - `charge.refunded` → marks donation REFUNDED
  - `customer.subscription.deleted` → sets recurring=false on cancelled subscriptions
- **Public donation page:** `/[locale]/donate` — preset amounts (¥1,000–¥50,000), custom amount input, one-time/monthly toggle, donor name, email, message
- **Thank you page:** `/[locale]/donate/thank-you` — success confirmation with back-to-home link
- **Admin donations dashboard:** `/admin/donations` — stats cards (total, completed, recurring, total amount), filterable table (status, type), donation details
- **Bilingual:** Full donate dictionary entries in ja.json and en.json
- **Validation:** `donationSchema` — email, integer amount (min ¥100), optional donor name/message, recurring default false

### Components Created

- `DonationForm`, `DonationFilters`

### Requires (for runtime)

- Stripe account + API keys (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET)
- Resend account + API key (for acknowledgment emails — TODO)

### File Count: ~95 files | Routes: 32 | Tests: 20

---

## Phase 5: Commerce (Complete)

**Goal:** Online store with product catalogue, cart, and Stripe Checkout.

### Deliverables

- **Product CRUD:**
  - `createProduct`, `updateProduct`, `deleteProduct` — with variant management (upsert/delete pattern)
  - `adjustInventory` — stock adjustments with audit trail via InventoryAdjustment model
  - RBAC-protected (commerce.manage)
- **Admin product pages:**
  - `/admin/products` — product list with variant count, price range, stock, active status
  - `/admin/products/new` — full product form with dynamic variant editor
  - `/admin/products/[id]` — edit product + variants
- **Admin order management:**
  - `/admin/orders` — order list with stats cards (total, awaiting fulfillment, shipped, revenue), status filter tabs
  - `/admin/orders/[id]` — order detail with items table, shipping info, status transition actions
  - Order workflow: Pending → Paid → Processing → Shipped → Delivered (with Cancel option)
- **Public shop:**
  - `/[locale]/shop` — product catalogue grid with images, descriptions, price ranges
  - `/[locale]/shop/[slug]` — product detail with variant selector and Add to Cart buttons
  - `/[locale]/shop/cart` — cart page with quantity controls, checkout form (email, shipping)
  - `/[locale]/shop/order-confirmed` — order success page
- **Cart system:**
  - Cookie-based persistent cart (30-day session), server-validated stock checks
  - `addToCart`, `updateCartItemQuantity`, `removeFromCart`, `clearCart`
- **Stripe Checkout:**
  - `createCommerceCheckoutSession` — builds line items from cart, creates Order record
  - Webhook handles: `checkout.session.completed` (marks PAID, decrements stock, clears cart), `checkout.session.expired` (marks CANCELLED), `charge.refunded` (marks REFUNDED)
- **Bilingual:** Full shop dictionary entries in ja.json and en.json
- **Sitemap:** `/shop` added to sitemap

### Components Created

- `ProductForm`, `OrderStatusActions`, `AddToCartButton`, `CartItems`, `CheckoutForm`

### Requires (for runtime)

- Stripe account + API keys (shared with Phase 4)
- Resend account + API key (for order confirmation emails — TODO)

### File Count: ~115 files | Routes: 41 | Tests: 20

---

## Phase 6: Social Publishing (Complete)

**Goal:** Publish content to Facebook/Instagram from the admin dashboard.

### Deliverables

- **Social provider abstraction:**
  - `lib/social/types.ts` — `SocialProvider` interface with `publish()` and optional `refreshToken()`
  - `lib/social/meta-provider.ts` — Facebook Graph API v21.0 integration (text + photo posts, token refresh)
  - `lib/social/mock-provider.ts` — Mock provider for development (simulates publish with delay)
  - `lib/social/index.ts` — Auto-selects mock in dev (when META_APP_ID missing) or real Meta provider
- **Meta OAuth flow:**
  - `/api/social/meta/callback` — Full OAuth callback: code exchange → long-lived token → page token → stores SocialAccount
  - Requests `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `pages_read_user_content` scopes
- **Server actions:**
  - `createSocialPost` — draft or scheduled, optionally linked to ContentPost
  - `updateSocialPost`, `deleteSocialPost`
  - `publishSocialPost` — calls provider, updates status + platformPostId
  - `addSocialAccount` (manual), `removeSocialAccount` (cascade deletes posts)
- **Server queries:**
  - `getSocialAccounts` (with post counts), `getSocialPosts` (filter by status/account), `getSocialPostById`
- **Admin social pages:**
  - `/admin/social` — Connected accounts management (OAuth connect + manual add + remove), post list with status filter tabs (draft/scheduled/published/failed), publish/delete actions per post
  - `/admin/social/compose` — Composer form: account selector, optional content link (auto-fills caption/media from published ContentPost), caption editor, media URL, schedule datetime
- **RBAC:** All social actions require `social.publish` permission

### Components Created

- `SocialComposer`, `SocialPostActions`, `SocialAccountActions`

### Requires (for runtime)

- Meta Developer account + app credentials (META_APP_ID, META_APP_SECRET, NEXT_PUBLIC_META_APP_ID)
- In development: works with MockSocialProvider without any credentials

### File Count: ~130 files | Routes: 44 | Tests: 23

---

## Phase 7: Analytics & Production Hardening (Complete)

**Goal:** Analytics, monitoring, security, accessibility, and production readiness.

### Deliverables

- **First-party analytics:**
  - `lib/analytics/track.ts` — Server-side `trackEvent()` and `trackPageView()` helpers
  - `lib/analytics/events.ts` — 11 typed analytics event constants (page_view, donation_started, donation_completed, event_registration, contact_form_submitted, newsletter_signup, product_viewed, add_to_cart, checkout_started, order_completed, social_post_published)
  - `/api/analytics` — Client-side POST endpoint for tracking page views and custom events
  - `AnalyticsTracker` — Client component added to public layout, tracks page views on route change
- **Audit logging:**
  - `lib/audit/index.ts` — `auditLog()` helper that records user, action, entity, and metadata to AuditLog table
- **Admin analytics dashboard:**
  - `/admin/analytics` — Overview cards (page views, total events, event types), events by type breakdown, top pages, recent audit log table
- **Admin dashboard overhaul:**
  - `/admin` — Real dashboard with summary cards linking to each section (events, new messages, content, donations, pending orders, social drafts)
- **Security headers:**
  - `lib/security/headers.ts` — Comprehensive security headers applied via `next.config.ts`:
    - Content-Security-Policy (restrictive: self + Stripe + Facebook + Sentry)
    - Strict-Transport-Security (HSTS with preload)
    - X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Rate limiting:**
  - `lib/security/rate-limit.ts` — Generic in-memory rate limiter with configurable max/window (reusable across endpoints)
- **Redirect system:** Already implemented in Phase 3 (redirect manager with loop detection, CSV import) — handles legacy URL migration

### Components Created

- `AnalyticsTracker`

### Requires (for production)

- Sentry account + DSN (add `@sentry/nextjs` when ready)
- Cloudflare Turnstile keys (add to contact/registration forms when ready)
- Vercel Web Analytics + Speed Insights (enable in Vercel dashboard)

### File Count: ~140 files | Routes: 47 | Tests: 28

---

## Current State Summary

| Metric | Value |
|--------|-------|
| Routes | 47 |
| Unit Tests | 28 |
| Prisma Models | 33+ |
| Dictionary Keys | ~200 per locale |
| shadcn Components | 11 |
| Admin Pages | 17 |
| Public Pages | 20 |
| Server Actions | 29 |
| Server Queries | 21 |
| API Routes | 4 |

### External Services Status

| Service | Status |
|---------|--------|
| Neon (PostgreSQL) | Needs account — required for runtime |
| Vercel | Needs account — required for deployment |
| Google OAuth | Needs credentials — required for admin login |
| Stripe | Code ready — needs API keys for runtime |
| Resend | Not started — Phase 2+ emails |
| Meta Developer | Code ready — needs app credentials for runtime |
| Sentry | Code-ready — add @sentry/nextjs + DSN when ready |
| Cloudflare Turnstile | Code-ready — add to forms when ready |

### Content Needed from MSBJ

- Organization description and mission statement (placeholder text in place)
- Teacher bios and photos
- Centre addresses and details
- Event policies
- Legal entity details (tokushoho page)
- Privacy policy content
- Brand assets (logo, photos)
- Legacy URL inventory for redirects
