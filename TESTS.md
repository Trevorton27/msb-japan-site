# Test Plan

Covers all CRUD operations and UI functionality. Tests are grouped by domain, then split into **automated** (Playwright E2E or Vitest unit) and **manual** categories.

Suggested stack: **Playwright** for E2E browser tests, **Vitest** for server action / schema unit tests.

---

## Table of Contents

1. [Auth & Sessions](#1-auth--sessions)
2. [RBAC / Access Control](#2-rbac--access-control)
3. [Content Posts](#3-content-posts)
4. [Events](#4-events)
5. [Event Registrations](#5-event-registrations)
6. [Products & Variants](#6-products--variants)
7. [Cart & Checkout](#7-cart--checkout)
8. [Orders](#8-orders)
9. [Donations](#9-donations)
10. [Contact Form](#10-contact-form)
11. [Users](#11-users)
12. [Redirects](#12-redirects)
13. [Social Posts & Accounts](#13-social-posts--accounts)
14. [Navigation & i18n](#14-navigation--i18n)
15. [Manual-Only Tests](#15-manual-only-tests)

---

## 1. Auth & Sessions

### Automated

| # | Test | Type |
|---|---|---|
| 1.1 | Sign in with valid credentials redirects to `/admin` | Playwright |
| 1.2 | Sign in with wrong password shows error, stays on login page | Playwright |
| 1.3 | Sign in with unknown email shows error | Playwright |
| 1.4 | User with no roles cannot sign in (credentials returns null) | Vitest (unit) |
| 1.5 | Unauthenticated request to any `/admin/*` page redirects to `/admin/login` | Playwright |
| 1.6 | Sign out clears session and redirects to `/admin/login` | Playwright |
| 1.7 | JWT callback correctly populates `token.roles` and `token.permissions` from DB | Vitest (unit) |
| 1.8 | Session callback copies roles/permissions onto `session.user` | Vitest (unit) |

### Manual

See [§15 Manual-Only Tests → Auth](#auth).

---

## 2. RBAC / Access Control

### Automated

| # | Test | Type |
|---|---|---|
| 2.1 | `requirePermission('content.create')` throws for Analyst role | Vitest (unit) |
| 2.2 | `requirePermission('users.manage')` throws for Editor role | Vitest (unit) |
| 2.3 | `hasPermission('analytics.read')` returns `true` for Analyst | Vitest (unit) |
| 2.4 | `hasPermission('commerce.manage')` returns `false` for Translator | Vitest (unit) |
| 2.5 | Administrator role grants all 14 permissions | Vitest (unit) |
| 2.6 | Playwright: Editor cannot navigate to `/admin/users` (redirected or 403) | Playwright |
| 2.7 | Playwright: Analyst cannot access `/admin/content/new` | Playwright |
| 2.8 | Playwright: Commerce Manager can access `/admin/orders` | Playwright |

---

## 3. Content Posts

### Automated

| # | Test | Type |
|---|---|---|
| 3.1 | `contentPostSchema` rejects empty `slugJa` | Vitest (unit) |
| 3.2 | `contentPostSchema` rejects `imageUrl` that is not a valid URL and not empty string | Vitest (unit) |
| 3.3 | Create post: valid data inserts record, returns `{ success: true, id }` | Vitest (integration) |
| 3.4 | Create post: setting `status: PUBLISHED` sets `publishedAt` to now | Vitest (integration) |
| 3.5 | Update post: changing status from DRAFT → PUBLISHED sets `publishedAt` | Vitest (integration) |
| 3.6 | Update post: re-publishing an already-published post does not overwrite `publishedAt` | Vitest (integration) |
| 3.7 | Delete post: record is removed from DB | Vitest (integration) |
| 3.8 | `updatePostStatus('PUBLISHED')` requires `content.publish`, not just `content.edit` | Vitest (unit) |
| 3.9 | `updatePostStatus('APPROVED')` requires `content.review` | Vitest (unit) |
| 3.10 | Admin UI: `/admin/content/new` form submits and new post appears in list | Playwright |
| 3.11 | Admin UI: Edit post form pre-populates all fields correctly | Playwright |
| 3.12 | Admin UI: Status change button updates displayed status without page reload | Playwright |
| 3.13 | Admin UI: Delete post removes it from the list | Playwright |
| 3.14 | Public: Published post appears on `/[locale]/teachings` and `/[locale]/blog` | Playwright |
| 3.15 | Public: DRAFT post does not appear on public listings | Playwright |
| 3.16 | Public: `/[locale]/teachings/[slug]` resolves correct locale slug | Playwright |

---

## 4. Events

### Automated

| # | Test | Type |
|---|---|---|
| 4.1 | `eventSchema` rejects missing `startsAt` | Vitest (unit) |
| 4.2 | `eventSchema` rejects `onlineUrl` that is not a valid URL and not empty string | Vitest (unit) |
| 4.3 | Create event: record inserted, returns `{ success: true, id }` | Vitest (integration) |
| 4.4 | Update event: changes persisted to DB | Vitest (integration) |
| 4.5 | Delete event: record removed | Vitest (integration) |
| 4.6 | Admin UI: `/admin/events/new` form submits and event appears in list | Playwright |
| 4.7 | Admin UI: Edit event pre-populates all fields | Playwright |
| 4.8 | Admin UI: Delete event removes it from the list | Playwright |
| 4.9 | Public: Published event appears on `/[locale]/events` list | Playwright |
| 4.10 | Public: DRAFT event is not shown on public listing | Playwright |
| 4.11 | Public: Event detail page `/[locale]/events/[slug]` renders title, dates, and registration form | Playwright |
| 4.12 | API: `GET /api/events/[id]/calendar` returns a valid `.ics` file with `Content-Type: text/calendar` | Playwright / fetch |

---

## 5. Event Registrations

### Automated

| # | Test | Type |
|---|---|---|
| 5.1 | `eventRegistrationSchema` rejects missing email | Vitest (unit) |
| 5.2 | Registration creates DB record with status `CONFIRMED` when under capacity | Vitest (integration) |
| 5.3 | Registration creates DB record with status `WAITLISTED` when at capacity | Vitest (integration) |
| 5.4 | Registration rejected if `registrationClosesAt` is in the past | Vitest (integration) |
| 5.5 | Registration rejected if event status is not `PUBLISHED` | Vitest (integration) |
| 5.6 | Concurrent registrations at the last spot: only one succeeds as `CONFIRMED`, other as `WAITLISTED` (serializable transaction) | Vitest (integration) |
| 5.7 | Public UI: Registration form on event detail page submits successfully | Playwright |
| 5.8 | Public UI: Submitting with missing required fields shows validation errors | Playwright |

---

## 6. Products & Variants

### Automated

| # | Test | Type |
|---|---|---|
| 6.1 | Create product: inserts product + variants in single operation | Vitest (integration) |
| 6.2 | Update product: removed variants are deleted, new variants are created, existing variants are updated | Vitest (integration) |
| 6.3 | Delete product: cascades to variants | Vitest (integration) |
| 6.4 | `adjustInventory`: increments `stockQuantity` and inserts `InventoryAdjustment` record atomically | Vitest (integration) |
| 6.5 | Admin UI: `/admin/products/new` form submits and product appears in list | Playwright |
| 6.6 | Admin UI: Add/remove variant rows dynamically in the product form | Playwright |
| 6.7 | Admin UI: Edit product — pre-populated values, save updates list | Playwright |
| 6.8 | Admin UI: Delete product removes it and its variants from the list | Playwright |
| 6.9 | Public: Active product appears on `/[locale]/shop` | Playwright |
| 6.10 | Public: Inactive product does not appear on `/[locale]/shop` | Playwright |
| 6.11 | Public: Product detail page renders name, description, and variants | Playwright |

---

## 7. Cart & Checkout

### Automated

| # | Test | Type |
|---|---|---|
| 7.1 | `addToCart`: creates a new cart + cookie if none exists | Vitest (integration) |
| 7.2 | `addToCart`: increments quantity for existing item in cart | Vitest (integration) |
| 7.3 | `addToCart`: returns error if requested quantity exceeds `stockQuantity` | Vitest (integration) |
| 7.4 | `addToCart`: returns error for inactive variant | Vitest (integration) |
| 7.5 | `updateCartItemQuantity(0)`: deletes the cart item | Vitest (integration) |
| 7.6 | `updateCartItemQuantity`: returns error if new quantity exceeds stock | Vitest (integration) |
| 7.7 | `removeFromCart`: deletes the specified cart item | Vitest (integration) |
| 7.8 | `clearCart`: removes all items from the cart | Vitest (integration) |
| 7.9 | Public UI: "Add to Cart" button adds product and shows updated item count | Playwright |
| 7.10 | Public UI: Cart page shows all items with correct subtotals | Playwright |
| 7.11 | Public UI: Increment/decrement quantity on cart page updates total | Playwright |
| 7.12 | Public UI: Remove item from cart page removes it from the list | Playwright |
| 7.13 | Public UI: Checkout button on cart page redirects to Stripe (URL starts with `checkout.stripe.com`) | Playwright |

### Manual

See [§15 Manual-Only Tests → Stripe Checkout](#stripe-checkout).

---

## 8. Orders

### Automated

| # | Test | Type |
|---|---|---|
| 8.1 | `updateOrderStatus`: persists new status to DB | Vitest (integration) |
| 8.2 | `addOrderNote`: persists notes string to DB | Vitest (integration) |
| 8.3 | Admin UI: Order list shows all orders with status badges | Playwright |
| 8.4 | Admin UI: Status dropdown on order detail page updates displayed status | Playwright |
| 8.5 | Admin UI: Save note on order detail page persists and re-displays the note | Playwright |

---

## 9. Donations

### Automated

| # | Test | Type |
|---|---|---|
| 9.1 | `donationSchema` rejects amount below minimum | Vitest (unit) |
| 9.2 | `createDonation`: inserts DB record with `status: PENDING` before Stripe redirect | Vitest (integration, mocked Stripe) |
| 9.3 | Stripe webhook `payment_intent.succeeded`: updates donation status to `PAID` | Vitest (integration, mocked webhook) |
| 9.4 | Stripe webhook: rejects request with invalid signature | Vitest (unit) |
| 9.5 | Public UI: Donation form validates required fields before submit | Playwright |
| 9.6 | Public UI: Selecting "recurring" changes UI label/description | Playwright |
| 9.7 | Admin UI: `/admin/donations` list displays donations with amounts and statuses | Playwright |

### Manual

See [§15 Manual-Only Tests → Stripe Checkout](#stripe-checkout).

---

## 10. Contact Form

### Automated

| # | Test | Type |
|---|---|---|
| 10.1 | `contactFormSchema` rejects invalid email format | Vitest (unit) |
| 10.2 | `contactFormSchema` rejects empty `body` | Vitest (unit) |
| 10.3 | `submitContactForm`: inserts `ContactMessage` in DB | Vitest (integration) |
| 10.4 | `submitContactForm`: rate-limits after 5 submissions from same IP within 1 hour | Vitest (unit) |
| 10.5 | `updateContactStatus`: persists `READ`, `REPLIED`, `ARCHIVED` transitions | Vitest (integration) |
| 10.6 | `addContactNote`: inserts note with correct `authorId` | Vitest (integration) |
| 10.7 | Public UI: Contact form submits and shows success message | Playwright |
| 10.8 | Public UI: Submitting with missing fields shows per-field validation errors | Playwright |
| 10.9 | Admin UI: Contacts list shows all messages | Playwright |
| 10.10 | Admin UI: Status action buttons update the displayed status | Playwright |
| 10.11 | Admin UI: Adding a note appends it to the message detail | Playwright |

---

## 11. Users

### Automated

| # | Test | Type |
|---|---|---|
| 11.1 | `createUser`: inserts user with hashed password and assigned role | Vitest (integration) |
| 11.2 | `createUser`: returns `{ success: false, error }` if email already exists | Vitest (integration) |
| 11.3 | `updateUserRole`: deletes existing roles and assigns the new one | Vitest (integration) |
| 11.4 | `resetUserPassword`: returns error if password is fewer than 8 characters | Vitest (unit) |
| 11.5 | `resetUserPassword`: stores a valid bcrypt hash | Vitest (integration) |
| 11.6 | `deleteUser`: returns `{ success: false, error }` when user tries to delete themselves | Vitest (integration) |
| 11.7 | `deleteUser`: removes the user record | Vitest (integration) |
| 11.8 | Admin UI: `/admin/users` lists all users with their roles | Playwright |
| 11.9 | Admin UI: Add user form submits and new user appears in the list | Playwright |
| 11.10 | Admin UI: Change role dropdown updates the displayed role | Playwright |
| 11.11 | Admin UI: Reset password dialog accepts new password and shows success | Playwright |
| 11.12 | Admin UI: Delete user removes them from the list | Playwright |
| 11.13 | Admin UI: Delete button for the currently signed-in user is disabled or shows error | Playwright |

---

## 12. Redirects

### Automated

| # | Test | Type |
|---|---|---|
| 12.1 | `redirectSchema` rejects `fromPath` not starting with `/` | Vitest (unit) |
| 12.2 | `createRedirect`: returns error when `fromPath === toPath` | Vitest (unit) |
| 12.3 | `createRedirect`: returns loop-detection error when `toPath` already has a redirect entry | Vitest (integration) |
| 12.4 | `createRedirect`: inserts valid redirect | Vitest (integration) |
| 12.5 | `deleteRedirect`: removes the record | Vitest (integration) |
| 12.6 | `importRedirectsFromCSV`: skips header row, upserts valid lines, reports errors for invalid lines | Vitest (unit) |
| 12.7 | Admin UI: Create redirect form submits and new row appears in list | Playwright |
| 12.8 | Admin UI: Delete redirect removes the row | Playwright |
| 12.9 | Admin UI: CSV import with valid data shows imported count | Playwright |
| 12.10 | Admin UI: CSV import with bad rows shows per-row errors | Playwright |

---

## 13. Social Posts & Accounts

### Automated

| # | Test | Type |
|---|---|---|
| 13.1 | `createSocialPost`: inserts post with `status: draft` when no `scheduledAt` | Vitest (integration) |
| 13.2 | `createSocialPost`: inserts post with `status: scheduled` when `scheduledAt` provided | Vitest (integration) |
| 13.3 | `updateSocialPost`: caption, mediaUrl, scheduledAt updated correctly | Vitest (integration) |
| 13.4 | `deleteSocialPost`: record removed | Vitest (integration) |
| 13.5 | `publishSocialPost`: calls provider `publish()`, updates status to `published` on success | Vitest (integration, mocked provider) |
| 13.6 | `publishSocialPost`: sets status to `failed` and returns error when provider fails | Vitest (integration, mocked provider) |
| 13.7 | `publishSocialPost`: returns error if post is already `published` | Vitest (unit) |
| 13.8 | `addSocialAccount`: inserts account record | Vitest (integration) |
| 13.9 | `removeSocialAccount`: deletes account record | Vitest (integration) |
| 13.10 | Admin UI: Social page lists connected accounts and draft/scheduled posts | Playwright |
| 13.11 | Admin UI: Compose form submits and new post appears in list | Playwright |
| 13.12 | Admin UI: Delete post removes it from the list | Playwright |

### Manual

See [§15 Manual-Only Tests → Social / Meta](#social--meta).

---

## 14. Navigation & i18n

### Automated

| # | Test | Type |
|---|---|---|
| 14.1 | Middleware: bare `/about` redirects to `/ja/about` (default locale) | Playwright |
| 14.2 | Middleware: bare `/about` redirects to `/en/about` when `NEXT_LOCALE=en` cookie is set | Playwright |
| 14.3 | Middleware: `/api/…` and `/admin/…` paths are not redirected | Playwright |
| 14.4 | Desktop nav: Teachers dropdown appears on hover | Playwright |
| 14.5 | Desktop nav: Each teacher link in dropdown navigates to `/[locale]/teachers#[slug]` and scrolls teacher into view | Playwright |
| 14.6 | Desktop nav: Clicking the Teachers label itself navigates to `/[locale]/teachers` | Playwright |
| 14.7 | Mobile nav: hamburger opens the sheet | Playwright |
| 14.8 | Mobile nav: Teachers item has a chevron button; tapping it expands sub-items | Playwright |
| 14.9 | Mobile nav: Tapping a teacher sub-item navigates and closes the sheet | Playwright |
| 14.10 | Mobile nav: Donate button at bottom of sheet navigates to `/[locale]/donate` | Playwright |
| 14.11 | Language switcher: toggling from `ja` to `en` updates the locale in the URL and re-renders content in English | Playwright |
| 14.12 | Language switcher: switching locales sets the `NEXT_LOCALE` cookie | Playwright |
| 14.13 | Admin locale toggle: switching between JA and EN re-renders admin labels without navigating away | Playwright |

---

## 15. Manual-Only Tests

These tests require external services, live credentials, or hardware that cannot be fully automated.

---

### Auth

| # | Test | Steps |
|---|---|---|
| M-1 | Google OAuth sign-in — approved user | Click "Sign in with Google" on `/admin/login`. Authenticate with a Google account that exists in the DB with a role. Verify redirect to `/admin`. |
| M-2 | Google OAuth sign-in — unknown user | Authenticate with a Google account that is NOT in the DB. Verify sign-in is rejected (error page or redirect back to login). |
| M-3 | Google OAuth sign-in — user with no role | Authenticate with a Google account that exists in the DB but has no assigned role. Verify rejection. |
| M-4 | Session expiry | Let the JWT expire (adjust `AUTH_SECRET` expiry or wait). Verify that a subsequent request to `/admin` redirects to login. |

---

### Stripe Checkout

| # | Test | Steps |
|---|---|---|
| M-5 | Donation — one-time payment | Complete the donation form (any amount). Verify redirect to Stripe Checkout. Use Stripe test card `4242 4242 4242 4242`. Verify redirect to `/[locale]/donate/thank-you`. Check that the donation record in `/admin/donations` updates to `PAID`. |
| M-6 | Donation — recurring subscription | Select "recurring" on the donation form. Complete checkout. Verify that a Stripe subscription is created in the Stripe dashboard. |
| M-7 | Shop checkout — successful payment | Add a product to the cart. Complete checkout with test card. Verify redirect to `/[locale]/shop/order-confirmed`. Check that order appears in `/admin/orders` with status `PAID`. |
| M-8 | Shop checkout — declined card | Use test card `4000 0000 0000 0002`. Verify Stripe shows a decline error. Verify no order is created in the DB. |
| M-9 | Stripe webhook — payment confirmation | Trigger `payment_intent.succeeded` via `stripe trigger` CLI. Verify the corresponding donation or order status is updated in the DB. |
| M-10 | Stripe webhook — invalid signature | Send a POST to `/api/webhooks/stripe` with a bad `Stripe-Signature` header. Verify 400 response and no DB changes. |

---

### Email (Resend)

| # | Test | Steps |
|---|---|---|
| M-11 | Contact form notification email | Submit the contact form on `/[locale]/contact`. Verify the admin notification email is received at the configured address (once Resend integration is wired up). |

---

### Social / Meta

| # | Test | Steps |
|---|---|---|
| M-12 | Connect Facebook/Instagram account | Go to `/admin/social`. Click "Connect Account". Complete the Meta OAuth flow. Verify the account appears in the connected accounts list. |
| M-13 | Meta OAuth callback — valid code | Complete the OAuth flow with a valid app in Meta's developer portal. Verify `accessToken` is stored and account is listed. |
| M-14 | Publish post to Meta | In `/admin/social/compose`, write a caption and select the connected account. Click "Publish Now". Verify the post appears live on the connected Facebook/Instagram page. |
| M-15 | Remove social account | Click "Remove" on a connected account. Verify it disappears from the list and any draft posts linked to it no longer display it. |

---

### Calendar

| # | Test | Steps |
|---|---|---|
| M-16 | Add to Calendar — iOS/macOS | On an event detail page, click the "Add to Calendar" / `.ics` download link. Open the file on an iOS or macOS device. Verify the event title, start/end times, and location import correctly into Calendar. |
| M-17 | Add to Calendar — Google Calendar | Import the `.ics` file into Google Calendar via "Other calendars → Import". Verify event details are correct. |

---

### Accessibility & Visual

| # | Test | Steps |
|---|---|---|
| M-18 | Keyboard navigation — desktop nav | Tab through the navigation. Verify Teachers dropdown opens on focus and teacher links are reachable without a mouse. |
| M-19 | Mobile nav on real device | Open the site on a physical iOS/Android device. Verify the hamburger menu opens, Teachers sub-items expand on tap, and all links close the sheet and navigate correctly. |
| M-20 | RTL / CJK text rendering | Review all Japanese-locale pages. Verify CJK characters render in the correct font and line-height without clipping. |
