# Proposals for Discussion

## Video Page (/videos)

### Option A: YouTube API Integration + Grid Layout
- Fetch from YouTube Data API v3, cache with ISR (6hr revalidation)
- Grid layout (3/2/1 columns responsive), thumbnail cards with modal player
- Categorize via YouTube playlists mapping to filter tabs
- **Pros**: Auto-syncs with YouTube uploads, rich metadata
- **Cons**: API quota (10K units/day), external dependency, API key management

### Option B: Manual CMS Entry (Database-backed)
- New `Video` Prisma model with bilingual fields, videoUrl, category, sortOrder
- Admin CRUD at `/admin/videos` following existing patterns
- **Pros**: Full control, works with any host, no API quotas, consistent with site patterns
- **Cons**: Manual data entry for each video

### Option C: Hybrid (Recommended)
- Database model as source of truth (Option B)
- Admin tool to auto-fill form fields from a YouTube URL (fetches title, thumbnail, description)
- Grid layout with category filter tabs
- **Pros**: Best of both — control + reduced manual effort

**Layout Recommendation**: Grid layout — matches existing visual patterns (Books, Centers), video thumbnails are inherently visual

---

## iCal Compatibility

### Option A: Public iCal Feed (Recommended)
- New endpoint: `/api/calendar/feed.ics`
- Multi-event VCALENDAR with all upcoming PUBLIC published events
- Users subscribe in any calendar app (Apple, Google, Outlook)
- 1-hour cache, auto-refreshes
- **Pros**: Universal compatibility, simple, no auth needed
- **Cons**: Read-only, no personalization

### Option B: Authenticated Member Feed (Future Enhancement)
- `/api/calendar/member-feed.ics?token=<user-token>`
- Includes PUBLIC + PRIVATE events user is registered for
- Token-based auth (calendar apps can't use sessions)
- **Pros**: Personalized, works without Google Calendar setup
- **Cons**: Token management, security considerations

### Option C: CalDAV Server
- Full bidirectional protocol
- **Not recommended** — extremely complex, overkill given existing Google Calendar sync

### How it complements existing Google Calendar sync:
- Google Calendar sync = bidirectional, personalized, requires OAuth (for staff/members)
- iCal feed = read-only, public, no auth (for anyone following events)
- Existing single-event ICS download remains unchanged
