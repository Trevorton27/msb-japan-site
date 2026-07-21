# Database

## Overview

PostgreSQL via Neon (serverless). ORM: Prisma.

## Schema Groups

- **Auth & RBAC**: User, Account, Session, VerificationToken, Role, Permission, RolePermission, UserRole
- **Events**: EventSeries, Event, Venue, EventRegistration, RegistrationAttendee
- **Content**: Teacher, ContentPost
- **Contacts**: ContactMessage, ContactMessageNote
- **Donations**: Donation
- **Commerce**: Product, ProductVariant, InventoryAdjustment, Cart, CartItem, Order, OrderItem
- **Integrations**: StripeEvent, SocialAccount, SocialPost
- **Platform**: NewsletterSubscriber, Redirect, AnalyticsEvent, AuditLog, SiteSetting, MediaAsset

## Conventions

- All bilingual fields: `fieldJa` (required), `fieldEn` (optional)
- Amounts: integers in smallest currency unit (yen)
- Table names: snake_case via `@@map()`
- IDs: CUID strings
- Timestamps: `createdAt`, `updatedAt`

## Migration Workflow

```bash
pnpm db:migrate     # Create and apply migration
pnpm db:generate    # Regenerate Prisma client
pnpm db:seed        # Seed roles/permissions
pnpm db:studio      # Open Prisma Studio
```
