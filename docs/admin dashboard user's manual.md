# Admin Dashboard User's Manual

Welcome to the MSB Japan Site Admin Dashboard. This manual will guide you through every feature available in the dashboard so you can manage your site with confidence -- no technical background required.

---

## Table of Contents

1. [Signing In](#1-signing-in)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Understanding Roles & Permissions](#3-understanding-roles--permissions)
4. [Managing Users](#4-managing-users)
5. [Managing Members](#5-managing-members)
6. [Events](#6-events)
7. [Content Management](#7-content-management)
8. [Contacts](#8-contacts)
9. [Donations](#9-donations)
10. [Products](#10-products)
11. [Orders](#11-orders)
12. [Social Media](#12-social-media)
13. [Books](#13-books)
14. [Dharma Centers](#14-dharma-centers)
15. [Member Resources](#15-member-resources)
16. [Member Announcements](#16-member-announcements)
17. [Redirects](#17-redirects)
18. [Analytics](#18-analytics)
19. [Settings](#19-settings)
20. [Tips & Best Practices](#20-tips--best-practices)

---

## 1. Signing In

To access the admin dashboard, go to your site's sign-in page and log in with your admin credentials. You can sign in using:

- **Email and password** -- Enter the email and password provided to you by your site administrator.
- **Google sign-in** -- Click the Google sign-in button. Note: only pre-approved users can sign in with Google. If you haven't been added as a user yet, ask an administrator to add your email first.

Once signed in, you'll be taken to the Admin Dashboard.

---

## 2. Dashboard Overview

**Location:** `/admin`

The main dashboard is your landing page after signing in. It shows a set of quick-glance summary cards:

| Card | What It Shows |
|------|---------------|
| **Total Events** | The number of events in the system |
| **New Contacts** | Unread messages from the contact form |
| **Total Content** | Number of blog posts, teachings, and articles |
| **Completed Donations** | Number of successfully completed donations |
| **Pending Orders** | Orders awaiting processing |
| **Social Drafts** | Social media posts saved as drafts |

Each card is clickable and takes you directly to the relevant section for more detail.

**Navigation:** Use the sidebar menu on the left side of the screen to navigate between sections. On smaller screens, the sidebar may collapse into a menu button.

---

## 3. Understanding Roles & Permissions

The system uses roles to control what each user can see and do. Every user is assigned one or more roles, and each role comes with a specific set of permissions.

### Available Roles

| Role | What This Person Can Do |
|------|------------------------|
| **Administrator** | Full access to everything. Can manage users, settings, and all content. This is the highest-level role. |
| **Editor** | Can read, create, edit, review, and publish content (blog posts, teachings, articles). Cannot manage users or settings. |
| **Translator** | Can read and edit existing content only. Useful for team members who translate content between Japanese and English. |
| **Event Coordinator** | Can manage events, event registrations, and contact messages. |
| **Commerce Manager** | Can manage products and orders, and view donation records. |
| **Analyst** | Read-only access to analytics, content, and donation data. Cannot make changes. |

There is also a **Member** role, but this is for the member portal (the public-facing members area), not the admin dashboard.

### Which Roles Can Access Which Sections

| Admin Section | Who Can Access It |
|---------------|-------------------|
| Events | Administrator, Event Coordinator |
| Contacts | Administrator, Event Coordinator |
| Content | Administrator, Editor, Translator (limited), Analyst (read-only) |
| Donations | Administrator, Commerce Manager, Analyst (read-only) |
| Products & Orders | Administrator, Commerce Manager |
| Social Media | Administrator |
| Analytics | Administrator, Analyst |
| Users & Members | Administrator only |
| Member Resources | Administrator, Editor |
| Member Announcements | Administrator, Editor |
| Settings | Administrator |
| Redirects | Administrator |
| Books & Centers | Administrator, Editor |

### How to Assign Roles

See [Managing Users](#4-managing-users) below for step-by-step instructions on assigning and changing roles.

---

## 4. Managing Users

**Location:** `/admin/users`
**Required role:** Administrator

This is where you add, edit, and remove the people who can access the admin dashboard.

### Viewing Users

The Users page shows a table with all users:

- **Name** -- The user's display name
- **Email** -- Their login email address
- **Role(s)** -- Which role(s) they have been assigned
- **Login Type** -- Shows "Password" if they log in with email/password, or "Google" if they use Google sign-in
- **Created** -- When the account was created

### Adding a New User

1. Click the **"Add User"** button at the top of the page.
2. A dialog box will appear. Fill in:
   - **Name** (required) -- The person's full name
   - **Email** (required) -- Their email address (this will be their login)
   - **Password** (optional) -- Set a password for them. If you leave this blank, they will only be able to sign in using Google.
   - **Role** (required) -- Select their role from the dropdown
3. Click **Save** to create the user.

After creating the user, share their email and password with them securely (not by email if possible).

### Changing a User's Role

1. Find the user in the table.
2. Click the **Actions** button next to their name.
3. Select **"Change Role"**.
4. In the dialog that appears, select the new role from the dropdown.
5. Click **Save**.

### Resetting a User's Password

1. Find the user in the table.
2. Click the **Actions** button next to their name.
3. Select **"Reset Password"**.
4. Enter the new password (must be at least 8 characters).
5. Click **Save**.
6. Communicate the new password to the user securely.

### Deleting a User

1. Find the user in the table.
2. Click the **Actions** button next to their name.
3. Select **"Delete User"**.
4. A confirmation will appear. Confirm to permanently remove the user.

**Warning:** Deleting a user cannot be undone. The user will immediately lose access to the dashboard.

---

## 5. Managing Members

**Location:** `/admin/members`
**Required role:** Administrator

The Members page lets you control who has access to the **member portal** -- a separate area of the site where registered members can view exclusive resources and announcements.

### How It Works

Members are existing users who have been granted the "Member" role in addition to any admin role they may have. The Members page shows all users and indicates whether each one currently has member access.

### Granting Member Access

1. Find the user in the table.
2. Look at the **Member Access** column -- it will say either "Member" (green badge) or "Not a member".
3. Click the **Actions** button next to their name.
4. Select **"Grant Member Access"**.

The user will now be able to access the member portal and view member-only resources and announcements.

### Revoking Member Access

1. Find the user in the table.
2. Click the **Actions** button.
3. Select **"Revoke Member Access"**.

The user will immediately lose access to the member portal.

---

## 6. Events

**Location:** `/admin/events`
**Required role:** Administrator, Event Coordinator

This section lets you create, edit, and manage all events.

### Viewing Events

The events list shows a table with:

- **Title** -- The event name
- **Date** -- When the event starts
- **Status** -- Draft, Published, Cancelled, or Completed
- **Mode** -- In Person, Online, or Hybrid
- **Registrations** -- How many people have registered (both public and member registrations)

### Creating a New Event

1. Click the **"New Event"** button.
2. Fill in the event form, which is organized into sections:

#### Basic Info

| Field | Required? | Description |
|-------|-----------|-------------|
| Title (JA) | Yes | The event title in Japanese |
| Title (EN) | No | The event title in English |
| Slug (JA) | Yes | A URL-friendly version of the title (e.g., "summer-retreat-2026"). Used in the event's web address. Use lowercase letters, numbers, and hyphens only. |
| Slug (EN) | No | English version of the slug |
| Description (JA) | No | Full description in Japanese |
| Description (EN) | No | Full description in English |

#### Schedule & Location

| Field | Required? | Description |
|-------|-----------|-------------|
| Start Date/Time | Yes | When the event begins |
| End Date/Time | Yes | When the event ends |
| Registration Opens | No | When people can start registering. Leave blank to allow registration immediately. |
| Registration Closes | No | Deadline for registration. Leave blank for no deadline. |
| Mode | Yes | Choose: **In Person**, **Online**, or **Hybrid** (both in-person and online) |
| Online URL | No | The video call link (for Online or Hybrid events) |
| Venue | No | Select a venue if the event is in person |

#### Pricing & Status

| Field | Required? | Description |
|-------|-----------|-------------|
| Status | Yes | **Draft** -- Not visible to the public. Use while preparing. **Published** -- Visible on the website. **Cancelled** -- Marks the event as cancelled. **Completed** -- Marks the event as finished. |
| Price Type | Yes | **Free** -- No charge. **Fixed** -- Set a specific price. **Donation** -- Attendees can donate any amount. **Sliding Scale** -- Flexible pricing. |
| Price Amount (JPY) | No | The price in Japanese Yen (only needed for Fixed pricing) |
| Capacity | No | Maximum number of attendees. Leave blank for unlimited. When capacity is reached, additional registrants are placed on a waitlist. |
| Beginner Friendly | No | Check this box to indicate the event is suitable for beginners |

#### Setting Up Recurring Events

If your event repeats on a regular schedule (e.g., every Saturday, monthly meditation sessions):

1. In the event form, look for the **Recurring** option.
2. Choose a preset:
   - **None** -- One-time event (default)
   - **Weekly** -- Repeats every week on the same day
   - **Bi-weekly** -- Repeats every two weeks
   - **Monthly** -- Repeats once a month on the same day
3. For advanced scheduling, you can enter a custom recurrence rule (RRULE). For example:
   - `RRULE:FREQ=WEEKLY;COUNT=10;BYDAY=SA` means "every Saturday for 10 weeks"
   - Your administrator or a technical team member can help you write custom rules if needed.

3. Click **Save** to create the event.

### Editing an Event

1. Click the **Edit** link next to any event in the list.
2. The edit page shows all the same fields as the creation form, pre-filled with the current values.
3. Make your changes and click **Save**.

### Managing Event Registrations

When editing an event, you'll see registration statistics at the top:

- **Public Confirmed** -- Number of public registrants confirmed
- **Public Waitlisted** -- Number on the public waitlist (when capacity is reached)
- **Member Registered** -- Number of registered members
- **Member Waitlisted** -- Number of members on the waitlist
- **Total** -- Combined total vs. capacity

#### Adding Members to an Event

1. On the event edit page, scroll to the **Member Registration** section.
2. Use the dropdown to find and select a member.
3. Click **Add** to register them for the event.

#### Removing Members from an Event

1. In the member registration list, find the member.
2. Click the **Remove** button next to their name.

---

## 7. Content Management

**Location:** `/admin/content`
**Required role:** Administrator, Editor, Translator (limited), Analyst (read-only)

This section manages all written content on the site -- blog posts, teachings, articles, audio, and video.

### Content Types

| Type | Description |
|------|-------------|
| **Blog** | General blog posts and news |
| **Teaching** | Dharma teachings and talks |
| **Article** | Long-form articles |
| **Audio** | Audio recordings (talks, guided meditations, etc.) |
| **Video** | Video content |

### Content Status Workflow

Content goes through a review process:

```
Draft --> Review --> Approved --> Published
                                    |
                              (or Scheduled for a future date)
```

Content can also be **Archived** at any point, which removes it from the public site but keeps it in the system.

| Status | Meaning |
|--------|---------|
| **Draft** | Work in progress. Not visible to the public. |
| **Review** | Submitted for review by an editor. |
| **Approved** | Reviewed and approved, ready to publish. |
| **Scheduled** | Set to publish automatically at a future date/time. |
| **Published** | Live on the website, visible to visitors. |
| **Archived** | Removed from the site but preserved in the system. |

### Browsing Content

The content list page provides:

- **Filters** at the top to narrow by type, status, or search by title
- A table showing title, type, status, author, and last updated date
- Click the **Edit** link to modify any piece of content

### Creating New Content

1. Click **"New"** to start a new piece of content.
2. Fill in the form:

| Field | Required? | Description |
|-------|-----------|-------------|
| Title (JA) | Yes | Title in Japanese |
| Title (EN) | No | Title in English |
| Slug (JA) | Yes | URL-friendly identifier (e.g., "introduction-to-meditation") |
| Slug (EN) | No | English URL identifier |
| Excerpt (JA) | No | A short summary in Japanese (shown in listings) |
| Excerpt (EN) | No | A short summary in English |
| Body (JA) | No | The full content in Japanese |
| Body (EN) | No | The full content in English |
| Type | Yes | Blog, Teaching, Article, Audio, or Video |
| Status | Yes | Draft, Review, Approved, Scheduled, or Published |
| Teacher/Author | No | Select the teacher or author |
| Image URL | No | A link to the featured image |
| Media URL | No | A link to audio or video file (for Audio/Video types) |
| Scheduled At | No | If status is "Scheduled", set the date/time to publish |

3. Click **Save**.

### Editing Content

1. Click **Edit** next to any content item.
2. Modify the fields as needed.
3. Click **Save**.

### Tips for Content Workflow

- **Writers:** Create content and set status to **Draft**. When ready, change to **Review**.
- **Editors:** Review content marked as **Review**. Change to **Approved** when satisfied.
- **Publishers (Editors/Admins):** Change approved content to **Published** to make it live, or set to **Scheduled** with a future date.
- **Translators:** Can edit existing content to add or improve translations in the EN fields.

---

## 8. Contacts

**Location:** `/admin/contacts`
**Required role:** Administrator, Event Coordinator

This section shows messages submitted through the website's public contact form.

### Viewing Messages

Messages are displayed as cards (not a table), each showing:

- The sender's **name** and **email**
- The **subject** (if provided)
- The full **message** text
- The **date** it was sent
- A colored **status badge**

### Message Statuses

| Status | Color | Meaning |
|--------|-------|---------|
| **New** | Blue | A new, unread message |
| **Read** | Gray | You've seen the message |
| **Replied** | Green | You've responded to the sender |
| **Archived** | Yellow | Moved to archive (dealt with or no longer relevant) |

### Managing Messages

- Use the **status action buttons** on each card to change its status (e.g., mark as Read, Replied, or Archived).
- You can add **internal notes** to any message -- these are visible only to admin users and useful for tracking follow-ups or sharing context with colleagues.
- Notes show who wrote them and when.

### Best Practice

1. Check contacts regularly for new messages (the dashboard card shows new message count).
2. Mark messages as **Read** once reviewed.
3. After responding to the sender (via your own email), mark as **Replied**.
4. Archive old messages to keep the list manageable.

---

## 9. Donations

**Location:** `/admin/donations`
**Required role:** Administrator, Commerce Manager, Analyst (read-only)

View and track all donations received through the site.

### Summary Cards

At the top of the page, you'll see:

- **Total Donations** -- Total number of all donations
- **Completed** -- Number of successfully completed donations
- **Active Recurring** -- Number of ongoing monthly donations
- **Total Amount (JPY)** -- Total money received

### Filtering Donations

- **By Type:** All, One-time, or Recurring (monthly)
- **By Status:** Filter by donation status

### Donation Table

Each donation entry shows:

| Column | Description |
|--------|-------------|
| Date | When the donation was made |
| Donor Name | Name of the donor |
| Email | Donor's email address |
| Amount (JPY) | Donation amount in Japanese Yen |
| Type | One-time or Monthly |
| Designation | What the donation is for: General, Life Release, or Drupcho |
| Status | Pending, Completed, Failed, or Refunded |
| Message | Any message the donor included |

**Note:** This section is read-only for viewing and tracking purposes. Donation processing is handled by the payment system automatically.

---

## 10. Products

**Location:** `/admin/products`
**Required role:** Administrator, Commerce Manager

Manage items available for sale on the site.

### Viewing Products

The product list shows:

- **Name** -- Product name (in Japanese and English)
- **Variants** -- How many variations the product has (e.g., different sizes or editions)
- **Price Range** -- The lowest to highest price across variants (in JPY)
- **Stock** -- Total stock quantity across all variants
- **Status** -- Active or Inactive

### Creating a New Product

1. Click **"New Product"**.
2. Fill in the form:

#### Basic Info

| Field | Required? | Description |
|-------|-----------|-------------|
| Slug (JA) | Yes | URL-friendly identifier in Japanese |
| Slug (EN) | No | URL-friendly identifier in English |
| Name (JA) | Yes | Product name in Japanese |
| Name (EN) | No | Product name in English |
| Description (JA) | No | Product description in Japanese |
| Description (EN) | No | Product description in English |
| Image URL | No | Link to the product image |
| Active | No | Check to make the product visible on the site |
| Sort Order | No | A number to control the display order (lower numbers appear first) |

#### Product Variants

Each product can have one or more variants. For example, a book might have "Paperback" and "Hardcover" variants with different prices.

For each variant, fill in:

| Field | Required? | Description |
|-------|-----------|-------------|
| Name (JA) | No | Variant name in Japanese (e.g., "Paperback") |
| Name (EN) | No | Variant name in English |
| SKU | No | A unique product code for inventory tracking |
| Price (JPY) | Yes | The price in Japanese Yen |
| Stock Quantity | No | How many units are available |
| Active | No | Toggle to enable/disable this variant |

To add more variants, click **"Add Variant"**. To remove a variant, click the remove button next to it.

3. Click **Save**.

### Editing a Product

Click **Edit** next to any product to modify its details or manage its variants.

---

## 11. Orders

**Location:** `/admin/orders`
**Required role:** Administrator, Commerce Manager

Track and fulfill customer orders.

### Order Summary Cards

- **Total Orders** -- All orders in the system
- **Awaiting Fulfillment** -- Orders that need to be processed and shipped
- **Shipped** -- Orders currently in transit
- **Revenue (JPY)** -- Total revenue from orders

### Filtering Orders

Use the status tabs to filter:
- **All** -- Show everything
- **Pending** -- New orders not yet processed
- **Paid** -- Payment received, ready to fulfill
- **Processing** -- Being prepared for shipment
- **Shipped** -- Sent to the customer
- **Delivered** -- Successfully received
- **Cancelled** -- Cancelled orders

### Order Table

| Column | Description |
|--------|-------------|
| Date | When the order was placed |
| Customer Email | The buyer's email |
| Items | Number of items ordered |
| Total (JPY) | Order total in Japanese Yen |
| Status | Current order status |

### Viewing Order Details

Click **View** next to any order to see:
- Full customer information
- Individual items ordered with quantities and prices
- Order status and history

Use this page to manage the fulfillment process (updating status as you process, ship, and deliver orders).

---

## 12. Social Media

**Location:** `/admin/social`
**Required role:** Administrator

Manage social media accounts and publish posts from the dashboard.

### Connected Accounts

At the top, you'll see a list of connected social media accounts with:
- Platform name (e.g., Instagram, Facebook)
- Account name
- Token expiry date (when the connection needs to be renewed)

### Managing Posts

Use the status tabs to filter posts:
- **Draft** -- Saved but not published
- **Scheduled** -- Set to publish at a future date/time
- **Published** -- Already posted
- **Failed** -- Posts that encountered an error

### Composing a New Post

1. Click **"Compose"** (or navigate to `/admin/social/compose`).
2. Fill in:
   - **Caption** -- The text of your post
   - **Media URL** -- Link to an image or video to attach
   - **Account** -- Select which social media account to post from
   - **Schedule** -- Optionally set a future date and time to publish
3. Click **Publish** to post immediately, or **Save as Draft** to finalize later.

---

## 13. Books

**Location:** `/admin/books`
**Required role:** Administrator, Editor

Manage the book catalog displayed on the site.

### Book Form Fields

| Field | Required? | Description |
|-------|-----------|-------------|
| Slug (JA/EN) | Yes (JA) | URL-friendly identifier |
| Title (JA/EN) | Yes (JA) | Book title |
| Author (JA/EN) | No | Author name |
| Description (JA/EN) | No | Book description or summary |
| Image URL | No | Link to the book cover image |
| Purchase URL | No | Link to where the book can be bought |
| Active | No | Check to display on the site |
| Sort Order | No | Number to control display order |

---

## 14. Dharma Centers

**Location:** `/admin/centers`
**Required role:** Administrator, Editor

Manage the directory of dharma centers displayed on the site.

### Center Form Fields

| Field | Required? | Description |
|-------|-----------|-------------|
| Slug (JA/EN) | Yes (JA) | URL-friendly identifier |
| Name (JA/EN) | Yes (JA) | Center name |
| Location (JA/EN) | No | City, region, or address |
| Country | No | Country where the center is located |
| Description (JA/EN) | No | Description of the center |
| Image URL | No | Link to a photo of the center |
| Website URL | No | Link to the center's website |
| Active | No | Check to display on the site |
| Sort Order | No | Number to control display order |

---

## 15. Member Resources

**Location:** `/admin/member-resources`
**Required role:** Administrator, Editor

Manage exclusive content available only to members in the member portal.

### Resource Types

| Type | Description |
|------|-------------|
| **Article** | Written articles |
| **PDF** | Downloadable PDF documents |
| **Audio** | Audio recordings |
| **Video** | Video content |
| **Link** | External links |
| **Practice Text** | Texts for practice and study |
| **Course Material** | Materials for courses |
| **Retreat Material** | Materials for retreats |

### Viewing Resources

The list shows:
- Title (bilingual)
- Resource type
- Status (Published or Draft)
- Featured indicator (marked with a star if featured)

### Creating/Editing a Resource

| Field | Required? | Description |
|-------|-----------|-------------|
| Slug (JA) | Yes | URL-friendly identifier |
| Slug (EN) | No | English URL identifier |
| Title (JA) | Yes | Resource title in Japanese |
| Title (EN) | No | Resource title in English |
| Description (JA/EN) | No | Short description |
| Resource Type | Yes | Select from the types listed above |
| File URL | No | Link to a downloadable file |
| External URL | No | Link to an external website |
| Audio URL | No | Link to an audio file |
| Video URL | No | Link to a video file |
| Content (JA/EN) | No | Full text content |
| Sort Order | No | Number to control display order |
| Published | No | Check to make visible to members |
| Featured | No | Check to highlight this resource prominently |

**Tip:** Use the "Featured" checkbox to highlight important or new resources at the top of the member portal.

---

## 16. Member Announcements

**Location:** `/admin/member-announcements`
**Required role:** Administrator, Editor

Post announcements visible only to members in the member portal.

### Viewing Announcements

The list shows:
- Title (bilingual)
- Status (Published or Draft)
- Pinned indicator (pinned announcements stay at the top)
- Date

### Creating/Editing an Announcement

| Field | Required? | Description |
|-------|-----------|-------------|
| Title (JA) | Yes | Announcement title in Japanese |
| Title (EN) | No | Announcement title in English |
| Content (JA) | Yes | The announcement body in Japanese |
| Content (EN) | No | The announcement body in English |
| Published | No | Check to make visible to members |
| Pinned | No | Check to keep this announcement at the top of the list |

**Tip:** Use "Pinned" for important ongoing announcements (e.g., schedule changes, important notices) so they always appear first regardless of date.

---

## 17. Redirects

**Location:** `/admin/redirects`
**Required role:** Administrator

Redirects automatically send visitors from one URL to another. This is useful when you change a page's address or need to create shortcut links.

### Example Use Cases

- You renamed a page from `/events/old-name` to `/events/new-name` -- create a redirect so old links still work
- You want `/donate` to take visitors to your donation page at a longer URL
- You moved content and want to preserve links shared on social media

### Creating a Redirect

The redirect form appears at the top of the page:

| Field | Description |
|-------|-------------|
| **From Path** | The old or shortcut URL (e.g., `/old-page`) |
| **To Path** | Where visitors should be sent (e.g., `/new-page`) |
| **Status Code** | Usually **301** (permanent redirect) or **302** (temporary redirect). Use 301 when the change is permanent. |

### Managing Redirects

- The table shows all existing redirects with their from/to paths and status codes
- Each redirect has an **Active/Inactive** toggle -- turn off a redirect without deleting it
- Remove redirects you no longer need

---

## 18. Analytics

**Location:** `/admin/analytics`
**Required role:** Administrator, Analyst

View traffic data, user behavior, and admin activity logs.

### Current Visitors (Live)

Shows real-time information about who is on your site right now:
- Number of current visitors
- Which pages they are viewing
- When they were last active

### Web Analytics (30-day overview)

If Vercel Web Analytics is configured, you'll see:

- **Page Views** -- Total pages viewed in the last 30 days
- **Visitors** -- Unique visitors in the last 30 days
- **Daily Traffic** -- A day-by-day breakdown
- **Top Pages** -- Most visited pages
- **Top Referrers** -- Where your traffic is coming from (e.g., Google, social media)
- **Top Countries** -- Where your visitors are located
- **Device Types** -- Desktop vs. mobile vs. tablet breakdown

### Custom Event Analytics

Tracks specific interactions on your site:
- Total page views (30-day)
- Total tracked events (30-day)
- Event types and counts
- Top pages by event activity

### Audit Log

A record of all actions taken by admin users in the last 30 days. This is useful for accountability and troubleshooting.

| Column | Description |
|--------|-------------|
| Time | When the action occurred |
| User | Who performed the action |
| Action | What they did (e.g., "created", "updated", "deleted") |
| Entity Type | What type of item was affected (e.g., "event", "content") |
| Entity ID | The specific item's identifier |

---

## 19. Settings

**Location:** `/admin/settings`
**Required role:** Administrator

### Google Calendar Integration

Sync your site's published events to a Google Calendar so they appear on your personal or shared calendar.

#### Connecting Google Calendar

1. Go to **Settings**.
2. Click **"Connect Google Calendar"**.
3. You'll be asked to sign in to your Google account and grant permission.
4. Once connected, you'll see a green "Connected" indicator.

#### Syncing Events

Once connected:

- **Automatic Sync** -- Published events are automatically synced to your Google Calendar.
- **Manual Sync** -- Click the **"Sync Now"** button to force a full sync of all events. After syncing, you'll see a summary:
  - Total events processed
  - Events created (new)
  - Events updated (changed)
  - Events that failed (if any)
- **Last Sync** -- Shows when the last sync occurred.

Recurring events are expanded automatically based on their recurrence rules.

All event times are handled in Japan Standard Time (JST).

#### Disconnecting Google Calendar

1. Click **"Disconnect"**.
2. Optionally check **"Remove synced events"** to delete all previously synced events from your Google Calendar.
3. Confirm the disconnection.

---

## 20. Tips & Best Practices

### Bilingual Content (Japanese & English)

Nearly every form in the dashboard has parallel Japanese (JA) and English (EN) fields. Here's how to use them:

- **Japanese fields** are typically required -- always fill these in first.
- **English fields** are optional but recommended for reaching a wider audience.
- The site will display content in the visitor's preferred language, falling back to Japanese if no English translation is available.

### Slugs

Many forms ask for a "slug." A slug is the part of the web address that identifies a specific page. For example, in `yoursite.com/events/summer-retreat`, the slug is `summer-retreat`.

**Rules for slugs:**
- Use only lowercase letters, numbers, and hyphens
- No spaces (use hyphens instead)
- Keep them short and descriptive
- Example: "Introduction to Meditation" becomes `introduction-to-meditation`

### Event Management Workflow

A recommended workflow for managing events:

1. **Create** the event as a **Draft** while gathering details.
2. **Fill in** all information (description, schedule, pricing, capacity).
3. Set up **recurring** if it's a repeating event.
4. Change status to **Published** when ready to go live.
5. **Monitor registrations** through the event edit page.
6. After the event, change status to **Completed**.

### Content Publishing Workflow

For teams with multiple content creators:

1. **Writer** creates content and saves as **Draft**.
2. **Writer** changes status to **Review** when ready.
3. **Editor** reviews, makes changes, and sets to **Approved**.
4. **Editor/Admin** changes to **Published** (immediate) or **Scheduled** (future date).
5. Old content can be **Archived** when no longer relevant.

### Regular Maintenance Checklist

- Check **Contacts** for new messages (daily)
- Review **Pending Orders** and process them (daily)
- Monitor **Donations** for any failed transactions (weekly)
- Review **Analytics** to understand site performance (weekly)
- Update **Events** -- mark completed events, create upcoming ones (as needed)
- Check **Social Media** for failed posts (weekly)
- Review the **Audit Log** for any unexpected activity (monthly)

### Security Reminders

- Never share your admin password via email or chat
- Use a strong password (at least 8 characters, mix of letters, numbers, and symbols)
- If you suspect unauthorized access, contact your administrator immediately
- Administrators should periodically review the user list and remove inactive accounts

---

*This manual covers all features of the MSB Japan Admin Dashboard. If you encounter issues not covered here, please contact your site administrator for assistance.*
