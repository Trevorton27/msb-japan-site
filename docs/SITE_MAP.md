# MSB Japan Site Map

All routes are prefixed with `/{locale}` (ja/en) unless noted otherwise.

## Public Pages

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Homepage — hero, dharma message, events, books, centers | Public |
| `/about` | About MSB Japan | Public |
| `/start` | Getting started guide for newcomers | Public |
| `/teachers` | Teacher profiles | Public |
| `/teachings` | Published teachings list | Public |
| `/teachings/[slug]` | Individual teaching page | Public |
| `/events` | Upcoming public events | Public |
| `/events/[slug]` | Event detail + registration (public events only) | Public |
| `/programs` | Programs overview | Public |
| `/gatherings` | Online study group info | Public |
| `/member-programs` | Member programs info | Public |
| `/blog` | Blog posts | Public |
| `/blog/[slug]` | Individual blog post | Public |
| `/centres` | Physical centres info | Public |
| `/dharma-centers/[slug]` | Individual dharma center page | Public |
| `/books/[slug]` | Individual book page | Public |
| `/shop` | Product catalog | Public |
| `/shop/[slug]` | Product detail page | Public |
| `/shop/cart` | Shopping cart | Public |
| `/shop/order-confirmed` | Post-checkout confirmation | Public |
| `/contact` | Contact form | Public |
| `/donate` | Donation page | Public |
| `/donate/thank-you` | Post-donation thank you | Public |
| `/vision` | Vision of MSB | Public |
| `/history` | Organization history | Public |
| `/life-release` | Life release ceremony info | Public |
| `/prayer-requests` | Prayer request form | Public |
| `/privacy` | Privacy policy | Public |
| `/tokushoho` | Specified commercial transactions | Public |
| `/bylaws` | Organization bylaws | Public |
| `/organization-info` | Organization information | Public |

## Members Area

| Route | Purpose | Access |
|-------|---------|--------|
| `/members/sign-in` | Member sign-in page | Public (open) |
| `/members/unauthorized` | Unauthorized access page | Public (open) |
| `/members` | Member dashboard | Authenticated + member.content permission |
| `/members/events` | Member event list + registration | Authenticated + member.content permission |
| `/members/study` | Study materials list | Authenticated + member.content permission |
| `/members/study/[slug]` | Individual study resource | Authenticated + member.content permission |
| `/members/sangha` | Sangha community page | Authenticated + member.content permission |
| `/members/account` | Account settings + calendar sync | Authenticated + member.content permission |

## Admin Panel

All admin routes require authentication and appropriate permissions.

### Core

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin` | Admin dashboard | Any admin role |
| `/admin/login` | Admin login page | Public |
| `/admin/settings` | Site settings | settings.manage |

### Content Management

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/content` | Content posts list | content.read |
| `/admin/content/new` | Create content post | content.create |
| `/admin/content/[id]` | Edit content post | content.edit |

### Events

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/events` | Events list (with visibility badge) | events.manage |
| `/admin/events/new` | Create event | events.manage |
| `/admin/events/[id]` | Edit event + member registrations | events.manage |
| `/admin/events/[id]/details` | Event detail view | events.manage |

### Commerce

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/products` | Products list | commerce.manage |
| `/admin/products/new` | Create product | commerce.manage |
| `/admin/products/[id]` | Edit product | commerce.manage |
| `/admin/orders` | Orders list | commerce.manage |
| `/admin/orders/[id]` | Order detail | commerce.manage |
| `/admin/donations` | Donations list | donations.read |

### Reference Data

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/books` | Books list | content.publish |
| `/admin/books/new` | Create book | content.publish |
| `/admin/books/[id]` | Edit book | content.publish |
| `/admin/centers` | Dharma centers list | content.publish |
| `/admin/centers/new` | Create center | content.publish |
| `/admin/centers/[id]` | Edit center | content.publish |
| `/admin/redirects` | URL redirects | settings.manage |

### User & Member Management

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/users` | Users list + role management | users.manage |
| `/admin/users/[id]` | User profile (isSanghaMember toggle) | users.manage |
| `/admin/members` | Member access + Sangha Member toggles | users.manage |

### Member Content

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/member-resources` | Member resources list | content.publish |
| `/admin/member-resources/new` | Create resource | content.publish |
| `/admin/member-resources/[id]` | Edit resource | content.publish |
| `/admin/member-announcements` | Announcements list | content.publish |
| `/admin/member-announcements/new` | Create announcement | content.publish |
| `/admin/member-announcements/[id]` | Edit announcement | content.publish |
| `/admin/dharma-messages` | Dharma messages list | content.publish |
| `/admin/dharma-messages/new` | Create dharma message | content.publish |
| `/admin/dharma-messages/[id]` | Edit dharma message | content.publish |

### Social & Analytics

| Route | Purpose | Permission |
|-------|---------|------------|
| `/admin/social` | Social posts list | social.publish |
| `/admin/social/compose` | Compose social post | social.publish |
| `/admin/contacts` | Contact messages | contacts.manage |
| `/admin/analytics` | Analytics + audit log | analytics.read |

## API Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/api/auth/[...nextauth]` | NextAuth authentication | Public |
| `/api/contact` | Contact form submission | Public |
| `/api/analytics` | Analytics event tracking | Public |
| `/api/analytics/current` | Current visitors data | Admin |
| `/api/events/[id]/calendar` | ICS file download (auth required for PRIVATE) | Public/Auth |
| `/api/webhooks/stripe` | Stripe webhook handler | Stripe signature |
| `/api/social/meta/callback` | Meta OAuth callback | OAuth flow |
| `/api/google-calendar/auth` | Google Calendar OAuth initiation | Auth |
| `/api/google-calendar/callback` | Google Calendar OAuth callback | OAuth flow |
| `/api/google-calendar/token` | Google Calendar token management | Auth |
| `/api/google-calendar/events` | Google Calendar events list | Auth |
| `/api/google-calendar/sync/batch` | Batch calendar sync | Auth |
| `/api/cron/dharma-message` | Weekly dharma message rotation | CRON_SECRET bearer token |

## Generated Routes

| Route | Purpose |
|-------|---------|
| `/sitemap.xml` | Dynamic XML sitemap |

## Roles & Permissions

| Role | Permissions | Notes |
|------|-------------|-------|
| Administrator | All permissions | Full access |
| Editor | content.read/create/edit/review/publish | Content management |
| Translator | content.read/edit | Translation work |
| Event Coordinator | events.manage, registrations.manage, contacts.manage | Event management |
| Commerce Manager | commerce.manage, donations.read | Shop + donations |
| Analyst | analytics.read, content.read, donations.read | Read-only analytics |
| Member | member.content | Member portal access |
| Stream Watcher | member.content | Member portal (no Sangha access by default) |

### Special Flags

- **isSanghaMember**: Boolean on User model. Grants access to PRIVATE events regardless of role.
- **EventVisibility**: PUBLIC (default) or PRIVATE. PRIVATE events are hidden from public pages and non-Sangha members.
