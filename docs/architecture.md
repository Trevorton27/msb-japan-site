# Architecture

## Overview

MSB Japan is a Next.js 15 App Router application with a bilingual (ja/en) public site and an admin dashboard.

## Directory Organization

- `src/app/` - Next.js routes (public with `[locale]` prefix, admin without)
- `src/components/` - React components organized by domain (ui, public, admin, forms, commerce)
- `src/features/` - Feature-specific logic, organized by domain
- `src/lib/` - Shared utilities (auth, db, email, i18n, stripe, validation)
- `src/server/` - Server-side code (actions, queries, services)
- `prisma/` - Database schema, migrations, seed

## Server/Client Component Strategy

- Default to Server Components for data fetching and rendering
- Use Client Components only for interactivity (forms, dropdowns, modals)
- Server Actions for mutations

## RBAC Model

- Users have Roles via UserRole join table
- Roles have Permissions via RolePermission join table
- Session JWT enriched with roles and permissions
- All authorization enforced server-side via `requirePermission()`

## Bilingual Content Pattern

- Database fields: `fieldJa` (required), `fieldEn` (optional)
- Public routes: `/[locale]/path`
- Admin routes: `/admin/path` (no locale prefix)
- Dictionary files for UI strings: `src/dictionaries/{ja,en}.json`
