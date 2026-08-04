# MSB Japan Site

Bilingual (Japanese / English) public-facing website and admin dashboard for MSB Japan. Built with Next.js App Router, Prisma, NextAuth v5, and deployed on Vercel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 7 with `PrismaPg` driver adapter |
| Auth | NextAuth v5 (JWT sessions) — Credentials + Google OAuth |
| Payments | Stripe |
| Email | Resend |
| Analytics | Vercel Analytics + custom page-view tracking |
| Social | Meta Graph API (Facebook/Instagram posting) |
| Styling | Tailwind CSS v4 |
| Package Manager | pnpm |
| Deploy | Vercel (auto-deploy from `main`) |

---

## Environment Variables

Copy and populate in `.env.local` (gitignored):

```
DATABASE_URL=             # Neon PostgreSQL connection string
NEXT_PUBLIC_APP_URL=      # Full public URL (e.g. http://localhost:3002)
AUTH_SECRET=              # NextAuth secret
AUTH_GOOGLE_ID=           # Google OAuth client ID
AUTH_GOOGLE_SECRET=       # Google OAuth client secret
ADMIN_EMAIL=              # Seed script: initial admin email
ADMIN_NAME=               # Seed script: initial admin name
ADMIN_PASSWORD=           # Seed script: initial admin password
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
META_APP_ID=
META_APP_SECRET=
NEXT_PUBLIC_META_APP_ID=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

---

## Development

```bash
pnpm install
pnpm dev          # starts on port 3002 by default
pnpm db:push      # push schema changes to Neon
pnpm db:seed      # seed admin user from env vars
```

---

## File Tree

```
src/
├── app/
│   ├── layout.tsx                        # Root HTML shell (Vercel Analytics)
│   ├── page.tsx                          # Redirects / → /ja
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── globals.css
│   │
│   ├── [locale]/                         # i18n wrapper (ja | en)
│   │   ├── layout.tsx                    # Loads dictionary, wraps public shell
│   │   └── (public)/                     # Route group — SiteHeader + SiteFooter
│   │       ├── layout.tsx
│   │       ├── page.tsx                  # Home
│   │       ├── about/page.tsx
│   │       ├── centres/page.tsx
│   │       ├── teachers/page.tsx         # Teacher profiles (anchor-linked)
│   │       ├── teachings/
│   │       │   ├── page.tsx              # Teaching posts list
│   │       │   └── [slug]/page.tsx       # Teaching post detail
│   │       ├── blog/
│   │       │   ├── page.tsx
│   │       │   └── [slug]/page.tsx
│   │       ├── events/
│   │       │   ├── page.tsx
│   │       │   └── [slug]/page.tsx       # Event detail + registration form
│   │       ├── shop/
│   │       │   ├── page.tsx
│   │       │   ├── [slug]/page.tsx       # Product detail
│   │       │   ├── cart/page.tsx
│   │       │   └── order-confirmed/page.tsx
│   │       ├── donate/
│   │       │   ├── page.tsx
│   │       │   └── thank-you/page.tsx
│   │       ├── contact/page.tsx
│   │       ├── start/page.tsx
│   │       ├── privacy/page.tsx
│   │       ├── tokushoho/page.tsx        # Japanese statutory disclosure
│   │       └── not-found.tsx
│   │
│   ├── admin/                            # Admin dashboard (no locale prefix)
│   │   ├── layout.tsx                    # Auth check, sidebar shell
│   │   ├── page.tsx                      # Dashboard overview
│   │   ├── login/page.tsx
│   │   ├── users/page.tsx
│   │   ├── content/
│   │   │   ├── page.tsx                  # Content list
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── donations/page.tsx
│   │   ├── contacts/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── social/
│   │   │   ├── page.tsx                  # Connected accounts
│   │   │   └── compose/page.tsx          # Post composer
│   │   └── redirects/page.tsx
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts   # NextAuth handlers
│       ├── analytics/route.ts            # Page-view ingest
│       ├── events/[id]/calendar/route.ts # .ics download
│       ├── social/meta/callback/route.ts # OAuth callback
│       └── webhooks/stripe/route.ts      # Stripe webhook
│
├── components/
│   ├── public/
│   │   ├── site-header.tsx               # Sticky nav (server, fetches teachers)
│   │   ├── site-footer.tsx
│   │   ├── mobile-nav.tsx                # Sheet nav with sub-item support
│   │   ├── teachers-dropdown.tsx         # Hover dropdown for Teachers nav item
│   │   ├── language-switcher.tsx
│   │   ├── contact-form.tsx
│   │   ├── donation-form.tsx
│   │   ├── registration-form.tsx
│   │   ├── newsletter-form.tsx
│   │   ├── event-filters.tsx
│   │   ├── post-body.tsx
│   │   └── analytics-tracker.tsx
│   ├── admin/
│   │   ├── admin-sidebar.tsx
│   │   ├── admin-locale-toggle.tsx
│   │   ├── content-form.tsx
│   │   ├── content-filters.tsx
│   │   ├── content-status-actions.tsx
│   │   ├── event-form.tsx
│   │   ├── product-form.tsx
│   │   ├── order-status-actions.tsx
│   │   ├── donation-filters.tsx
│   │   ├── contact-status-actions.tsx
│   │   ├── redirect-actions.tsx
│   │   ├── social-composer.tsx
│   │   ├── social-account-actions.tsx
│   │   ├── social-post-actions.tsx
│   │   ├── add-user-form.tsx
│   │   └── user-actions.tsx
│   ├── commerce/
│   │   ├── add-to-cart-button.tsx
│   │   ├── cart-items.tsx
│   │   └── checkout-form.tsx
│   └── ui/                               # shadcn/ui primitives
│
├── server/
│   ├── actions/                          # Next.js Server Actions (mutations)
│   │   ├── content.ts
│   │   ├── events.ts
│   │   ├── registrations.ts
│   │   ├── contacts.ts
│   │   ├── donations.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── cart.ts
│   │   ├── users.ts
│   │   ├── social.ts
│   │   └── redirects.ts
│   └── queries/                          # Read-only DB queries
│       ├── content.ts
│       ├── events.ts
│       ├── products.ts
│       ├── orders.ts
│       ├── donations.ts
│       ├── analytics.ts
│       └── social.ts
│
├── lib/
│   ├── auth/
│   │   ├── index.ts                      # NextAuth config
│   │   ├── rbac.ts                       # requirePermission / hasRole helpers
│   │   └── permissions.ts               # PERMISSIONS + ROLES + ROLE_PERMISSIONS
│   ├── i18n/
│   │   ├── config.ts                     # locales = ["ja", "en"], defaultLocale = "ja"
│   │   ├── dictionaries.ts               # getDictionary(locale) loader
│   │   └── index.ts
│   ├── db/index.ts                       # Prisma client singleton (PrismaPg adapter)
│   ├── stripe/
│   │   ├── index.ts
│   │   ├── checkout.ts                   # Donation checkout session
│   │   └── commerce-checkout.ts          # Shop checkout session
│   ├── social/                           # Meta / mock social providers
│   ├── analytics/                        # Event definitions + track() helper
│   ├── audit/index.ts                    # Audit log writes
│   ├── security/
│   │   ├── headers.ts
│   │   └── rate-limit.ts
│   ├── admin-labels.ts                   # i18n label sets for admin UI
│   ├── admin-locale.ts                   # Cookie-based admin locale
│   ├── admin-locale-store.ts
│   ├── calendar.ts                       # iCal generation
│   ├── utils.ts
│   └── validation/schemas.ts            # Zod schemas
│
├── dictionaries/
│   ├── en.json
│   └── ja.json
│
├── proxy.ts                              # Middleware: locale redirect logic
└── types/
    └── next-auth.d.ts                    # Augments Session with roles/permissions
```

---

## Routes

### Public (`/[locale]/…`)

All public routes accept `ja` or `en` as the locale prefix. The middleware redirects bare paths (e.g. `/about`) to the locale determined by the `NEXT_LOCALE` cookie or `Accept-Language` header, defaulting to `ja`.

| Route | Description |
|---|---|
| `/[locale]` | Home page |
| `/[locale]/about` | About MSB Japan |
| `/[locale]/centres` | Practice centres |
| `/[locale]/teachers` | Teacher profiles (anchored by slug) |
| `/[locale]/teachings` | Teachings post list |
| `/[locale]/teachings/[slug]` | Teaching post detail |
| `/[locale]/blog` | Blog post list |
| `/[locale]/blog/[slug]` | Blog post detail |
| `/[locale]/events` | Upcoming events (filterable) |
| `/[locale]/events/[slug]` | Event detail + registration form |
| `/[locale]/shop` | Product list |
| `/[locale]/shop/[slug]` | Product detail |
| `/[locale]/shop/cart` | Cart |
| `/[locale]/shop/order-confirmed` | Post-checkout confirmation |
| `/[locale]/donate` | Donation form (Stripe) |
| `/[locale]/donate/thank-you` | Post-donation confirmation |
| `/[locale]/contact` | Contact form |
| `/[locale]/start` | Getting started / intro page |
| `/[locale]/privacy` | Privacy policy |
| `/[locale]/tokushoho` | Japanese statutory disclosure |

### Admin (`/admin/…`)

No locale prefix. Requires authentication. Each section is further gated by permission (see RBAC below).

| Route | Required Permission |
|---|---|
| `/admin` | any authenticated user |
| `/admin/login` | — (public) |
| `/admin/users` | `users.manage` |
| `/admin/content` | `content.read` |
| `/admin/content/new` | `content.create` |
| `/admin/content/[id]` | `content.edit` |
| `/admin/events` | `events.manage` |
| `/admin/events/new` | `events.manage` |
| `/admin/events/[id]` | `events.manage` |
| `/admin/products` | `commerce.manage` |
| `/admin/products/new` | `commerce.manage` |
| `/admin/products/[id]` | `commerce.manage` |
| `/admin/orders` | `commerce.manage` |
| `/admin/orders/[id]` | `commerce.manage` |
| `/admin/donations` | `donations.read` |
| `/admin/contacts` | `contacts.manage` |
| `/admin/analytics` | `analytics.read` |
| `/admin/social` | `social.publish` |
| `/admin/social/compose` | `social.publish` |
| `/admin/redirects` | `settings.manage` |

### API Routes

| Route | Purpose |
|---|---|
| `/api/auth/[...nextauth]` | NextAuth sign-in / sign-out / session |
| `/api/analytics` | Page-view ingest (POST from `AnalyticsTracker`) |
| `/api/events/[id]/calendar` | `.ics` file download |
| `/api/social/meta/callback` | Meta OAuth callback |
| `/api/webhooks/stripe` | Stripe webhook (payment confirmation) |

---

## RBAC — Roles & Permissions

Roles and permissions are stored in the database and loaded into the JWT at sign-in. The `session.user.permissions` array is checked server-side via `requirePermission()` / `hasPermission()` from `src/lib/auth/rbac.ts`.

### Permissions

| Key | Scope |
|---|---|
| `content.read` | View content posts |
| `content.create` | Create new content posts |
| `content.edit` | Edit existing content posts |
| `content.review` | Submit content for review |
| `content.publish` | Publish / unpublish content |
| `events.manage` | Create, edit, delete events |
| `registrations.manage` | View and manage event registrations |
| `contacts.manage` | View and action contact form submissions |
| `donations.read` | View donation records |
| `commerce.manage` | Manage products and orders |
| `social.publish` | Post to connected social accounts |
| `analytics.read` | View analytics dashboard |
| `users.manage` | Add, remove, and assign roles to users |
| `settings.manage` | Manage redirects and site settings |

### Role → Permission Map

| Role | Permissions |
|---|---|
| **Administrator** | All permissions |
| **Editor** | `content.read`, `content.create`, `content.edit`, `content.review`, `content.publish` |
| **Translator** | `content.read`, `content.edit` |
| **Event Coordinator** | `events.manage`, `registrations.manage`, `contacts.manage` |
| **Commerce Manager** | `commerce.manage`, `donations.read` |
| **Analyst** | `analytics.read`, `content.read`, `donations.read` |

---

## Data Flow

### Public page request

```
Browser → Middleware (proxy.ts)
  └─ locale detection (cookie → Accept-Language → default "ja")
  └─ redirect /foo → /ja/foo if no locale prefix

Next.js Server Component (page.tsx)
  └─ getDictionary(locale)          — loads src/dictionaries/[locale].json
  └─ server query (src/server/queries/*.ts)
       └─ db.* (Prisma → Neon PostgreSQL via PrismaPg adapter)
  └─ renders HTML with data
```

### Admin mutation (Server Action)

```
Admin UI (client component)
  └─ calls Server Action (src/server/actions/*.ts)
       └─ requirePermission(permission)   — throws if not authorized
       └─ validates input with Zod schema
       └─ db.* mutation
       └─ audit log write (src/lib/audit/index.ts)
       └─ revalidatePath(...)
  └─ UI updates via React state / toast
```

### Authentication flow

```
Sign-in form (/admin/login)
  └─ NextAuth Credentials provider
       └─ checks user exists with at least one role
       └─ bcrypt.compare(password, passwordHash)
  └─ OR Google OAuth
       └─ gated: only pre-existing users with a role may sign in
  └─ JWT callback: queries DB for roles + permissions
       └─ token.roles, token.permissions written to JWT
  └─ session callback: exposes roles/permissions on session.user
```

### Stripe payment flow

```
Donate / Checkout page
  └─ Server Action creates Stripe Checkout Session
       └─ redirects to Stripe-hosted checkout
  └─ Stripe webhook POST → /api/webhooks/stripe
       └─ verifies signature (STRIPE_WEBHOOK_SECRET)
       └─ on payment_intent.succeeded → updates DB record
  └─ User redirected to /thank-you or /order-confirmed
```

### Content i18n

All content models (posts, events, teachers, products) carry dual-language fields (`titleJa`/`titleEn`, `slugJa`/`slugEn`, etc.). Pages select the appropriate field based on the `[locale]` path segment. The admin dashboard has an independent locale toggle (stored in a cookie) to preview or edit either language without affecting the public site.
