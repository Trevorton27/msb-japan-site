# MSB Japan Site

Bilingual (Japanese/English) website for MSB Japan built with Next.js 16, featuring a full admin dashboard, event management, e-commerce, donations, and content publishing.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** Neon PostgreSQL via Prisma 7 (driver adapter)
- **Auth:** NextAuth v5 (credentials + Google OAuth, RBAC with 6 roles)
- **Styling:** Tailwind CSS 4 + custom UI components (Base UI / shadcn pattern)
- **Payments:** Stripe (donations + e-commerce checkout)
- **Email:** Brevo (transactional emails — contact form, donation/order notifications)
- **Analytics:** Vercel Web Analytics API + custom DB-backed event tracking
- **Deploy:** Vercel (auto-deploy from `main`)
- **Package Manager:** pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.sample .env.local
# Edit .env.local with your actual values

# Push database schema
pnpm db:push

# Seed admin user
pnpm db:seed

# Start dev server
pnpm dev
```

## Environment Variables

See `.env.sample` for all required variables. Key groups:

| Group | Variables | Purpose |
|---|---|---|
| Database | `DATABASE_URL` | Neon PostgreSQL connection |
| Auth | `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | NextAuth config |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payments |
| Brevo | `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` | Transactional email |
| Vercel Analytics | `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID` | Web analytics API |
| Sentry | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |
| Turnstile | `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Bot protection |

## Project Structure

```
src/
├── app/
│   ├── [locale]/(public)/    # Public pages (ja/en)
│   │   ├── about/
│   │   ├── contact/          # Contact form with Brevo email
│   │   ├── donate/
│   │   ├── events/
│   │   ├── history/
│   │   ├── shop/
│   │   ├── teachers/
│   │   └── vision/
│   ├── admin/                # Admin dashboard (auth-protected)
│   │   ├── analytics/        # Vercel Web Analytics + custom events + audit log
│   │   ├── contacts/
│   │   ├── content/
│   │   ├── donations/
│   │   ├── events/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── redirects/
│   │   ├── social/
│   │   └── users/
│   └── api/                  # API routes
│       ├── analytics/
│       ├── auth/
│       ├── contact/          # POST /api/contact
│       ├── events/
│       └── social/
├── components/
│   ├── admin/
│   ├── public/
│   └── ui/                   # Shared UI components
├── lib/
│   ├── analytics/            # Vercel Analytics API client + custom tracking
│   ├── auth/                 # NextAuth config, RBAC, permissions
│   ├── db/                   # Prisma client
│   ├── email/                # Brevo SDK (transactional emails)
│   ├── i18n/                 # Locale config + dictionary loader
│   ├── security/             # Rate limiting, security headers
│   ├── social/               # Social media integration
│   ├── stripe/               # Stripe checkout + commerce
│   └── validation/           # Zod schemas
├── server/
│   ├── actions/              # Server actions
│   └── queries/              # Server-side data queries
└── dictionaries/             # i18n JSON files (ja.json, en.json)
```

## i18n

The site supports Japanese (`ja`, default) and English (`en`). Public pages are routed under `/[locale]/`. Translations are stored in `src/dictionaries/` as JSON files.

## Email (Brevo)

Transactional emails are sent via the Brevo API (`@getbrevo/brevo` SDK). The email utility at `src/lib/email/` provides:

- `sendEmail()` — send custom HTML emails
- `sendTemplateEmail()` — send using Brevo dashboard templates
- `sendContactFormNotification()` — admin notification + locale-aware user acknowledgment
- `sendDonationStatusEmail()` — donation status updates
- `sendOrderStatusEmail()` — order status updates

Acknowledgment emails are sent in the user's selected language (ja/en).

## Analytics

Two analytics systems run in parallel:

1. **Vercel Web Analytics** — automatic page view and visitor tracking via `<Analytics />` component, queried via the REST API and displayed in `/admin/analytics`
2. **Custom DB analytics** — event tracking stored in PostgreSQL via `POST /api/analytics`, used for custom events and internal metrics

## Admin Roles (RBAC)

| Role | Access |
|---|---|
| Administrator | Full access |
| Editor | Content management |
| Translator | Translation workflows |
| Event Coordinator | Event management |
| Commerce Manager | Products, orders, donations |
| Analyst | Read-only analytics and reports |

## Scripts

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm format       # Prettier format
pnpm test         # Run unit tests (Vitest)
pnpm test:e2e     # Run E2E tests (Playwright)
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed admin user
pnpm db:studio    # Open Prisma Studio
```
