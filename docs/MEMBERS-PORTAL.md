# Members Portal

The members portal is a private area of the MSB Japan site for practitioner members. It is separate from the public site and from the admin dashboard.

## Route Structure

```
/[locale]/members/             ← Dashboard (auth-gated)
/[locale]/members/study        ← Resource library
/[locale]/members/study/[slug] ← Resource detail
/[locale]/members/events       ← Events with registration
/[locale]/members/sangha       ← Announcements
/[locale]/members/account      ← Profile & membership info
/[locale]/members/sign-in      ← Member sign-in (public)
/[locale]/members/unauthorized ← No-access message (public)
```

The route group `(members)` contains the auth-gated pages. The group `(members-open)` contains `sign-in` and `unauthorized`, which have no auth check so unauthenticated visitors can land there.

## Access Control

The portal uses the same DB-backed RBAC system as the admin dashboard.

**Permission:** `member.content`  
**Role:** `Member`

Any user holding a role that grants `member.content` can access the portal. Currently that is:

| Role | member.content |
|------|---------------|
| Administrator | ✅ (has all permissions) |
| Member | ✅ |
| All other roles | ❌ |

The auth gate in `src/app/[locale]/(members)/layout.tsx`:

1. Checks for an active session via `getCurrentUser()`
2. Redirects unauthenticated visitors to `/${locale}/members/sign-in`
3. Calls `canAccessMemberContent()` on authenticated users
4. Redirects users who lack the permission to `/${locale}/members/unauthorized`

All individual pages also call `requireMember()` server-side as a defence-in-depth measure.

### Granting Member Access

An administrator grants access via `/admin/members`. This adds the `Member` role to the user without disturbing any other roles they hold. The user can then sign in through the member sign-in page or the admin login page (same NextAuth handlers).

## Database Models

Three new models were added to `prisma/schema.prisma`:

### MemberResource

Stores study and practice materials.

| Field | Notes |
|-------|-------|
| `slugJa` / `slugEn` | URL slugs; `slugJa` is required and unique |
| `titleJa` / `titleEn` | Bilingual title |
| `resourceType` | `ARTICLE`, `PDF`, `AUDIO`, `VIDEO`, `LINK`, `PRACTICE_TEXT`, `COURSE_MATERIAL`, `RETREAT_MATERIAL` |
| `fileUrl` | CDN URL for downloadable files |
| `externalUrl` | Link to external resource |
| `videoUrl` / `audioUrl` | Embeddable media |
| `published` | Only published resources appear to members |
| `featured` | Shown in dashboard highlight and filtered view |

### MemberAnnouncement

Sangha announcements from administrators.

| Field | Notes |
|-------|-------|
| `titleJa` / `contentJa` | Required Japanese content |
| `titleEn` / `contentEn` | Optional English content |
| `published` | Only published announcements appear in the portal |
| `pinned` | Pinned announcements are shown first |
| `publishedAt` | Used for display ordering; falls back to `createdAt` |

### MemberEventRegistration

Tracks which members are registered for which events.

| Field | Notes |
|-------|-------|
| `userId` / `eventId` | FK to User and Event; unique pair |
| `status` | `REGISTERED`, `CANCELLED`, `WAITLISTED`, `ATTENDED` |

This model joins the existing `Event` model, which already has an `onlineUrl` field. The member events query returns `onlineUrl` only because it calls `requireMember()` first — the public event queries never include this field.

## Online Meeting URL Security

Event Zoom/meeting links (`Event.onlineUrl`) are sensitive. They are protected by:

1. All public event queries (`src/server/queries/events.ts`) never select `onlineUrl`
2. The member event query (`src/server/queries/member-events.ts`) includes `onlineUrl` but only runs after `requireMember()` succeeds
3. The client component (`events-client.tsx`) additionally only renders the Join button when the user is registered and the event mode is `ONLINE` or `HYBRID`

> **Limitation:** File resources use public CDN URLs (the existing site pattern). A member with the URL can share it. Truly private file delivery would require signed URLs from a private storage bucket — this is documented as a future enhancement.

## File Locations

### Server

| Path | Purpose |
|------|---------|
| `src/server/queries/member-resources.ts` | Resource reads (all auth-gated) |
| `src/server/queries/member-announcements.ts` | Announcement reads |
| `src/server/queries/member-events.ts` | Event reads with onlineUrl |
| `src/server/actions/member-resources.ts` | Resource CRUD (requires `content.publish`) |
| `src/server/actions/member-announcements.ts` | Announcement CRUD (requires `content.publish`) |
| `src/server/actions/member-event-registrations.ts` | Register/cancel (requires `member.content`) |
| `src/server/actions/members.ts` | Grant/revoke member role (requires `users.manage`) |

### Components

| Path | Purpose |
|------|---------|
| `src/components/members/member-nav.tsx` | Top nav with mobile drawer |
| `src/components/admin/member-resource-form.tsx` | Admin resource create/edit |
| `src/components/admin/member-announcement-form.tsx` | Admin announcement create/edit |
| `src/components/admin/member-access-actions.tsx` | Grant/revoke buttons in admin members list |

### RBAC

| Path | Change |
|------|--------|
| `src/lib/auth/permissions.ts` | Added `MEMBER_CONTENT` permission and `MEMBER` role |
| `src/lib/auth/rbac.ts` | Added `requireMember()` and `canAccessMemberContent()` |
| `src/lib/locale-utils.ts` | Pure `t()` helper usable in client components |

## Admin Management

Three admin sections manage the members portal:

- `/admin/members` — list all users, grant or revoke the Member role
- `/admin/member-resources` — create, edit, publish study materials
- `/admin/member-announcements` — create, edit, pin, publish announcements

## SEO

All member pages export:

```typescript
export const metadata = {
  robots: { index: false, follow: false },
};
```

This prevents search engines from indexing member content.

## Internationalization

The `members` section in `src/dictionaries/{en,ja}.json` contains all UI strings for the portal. Subsections: `nav`, `dashboard`, `study`, `events`, `sangha`, `account`, `unauthorized`, `signIn`.

Database content fields follow the existing bilingual pattern: `fieldJa` (required), `fieldEn` (optional). The `t(locale, ja, en)` helper in `src/lib/locale-utils.ts` selects the appropriate value.
