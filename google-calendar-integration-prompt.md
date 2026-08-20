# Google Calendar Integration - Implementation Prompt

You are implementing a full Google Calendar integration for **msb-japan-site**, a Next.js app using **NextAuth.js** (not Clerk), **PostgreSQL + Prisma**, and **Tailwind CSS**. This prompt contains everything you need: architecture overview, adapted source code, Prisma schema, API routes, UI components, and configuration.

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prisma Schema](#2-prisma-schema)
3. [Environment Variables](#3-environment-variables)
4. [File Structure](#4-file-structure)
5. [Encryption Utility](#5-encryption-utility)
6. [Google Calendar Client](#6-google-calendar-client)
7. [Token Manager](#7-token-manager)
8. [Sync Service](#8-sync-service)
9. [API Routes](#9-api-routes)
10. [UI Components](#10-ui-components)
11. [Auth Helpers](#11-auth-helpers)
12. [Setup Checklist](#12-setup-checklist)

---

## 1. Architecture Overview

### System Design

```
User clicks "Connect Google Calendar"
  -> GET /api/google-calendar/auth (generates OAuth URL, redirects to Google)
  -> User grants consent on Google
  -> GET /api/google-calendar/callback (exchanges code for tokens, encrypts & stores them)
  -> Initial batch sync runs (pushes all visible events to user's Google Calendar)

Admin/Event Coordinator creates event in app
  -> POST /api/calendar/events (saves to DB)
  -> syncEventToAllRelevantUsers() pushes to each user's Google Calendar (async, non-blocking)

User triggers manual sync
  -> POST /api/google-calendar/sync/batch
  -> batchSyncEvents() finds all events visible to user and creates/updates them in Google Calendar
```

### Key Design Decisions

- **Per-user Google Calendar event IDs**: One app event synced to N users means N different Google Calendar event IDs. The `UserGoogleCalendarEvent` join table tracks each mapping.
- **Encrypted tokens at rest**: OAuth access/refresh tokens are encrypted using AES-256-GCM before storage. Requires `ENCRYPTION_SECRET` env var (32-byte hex string).
- **Auto token refresh**: Before any Google API call, the token manager checks expiry and refreshes automatically. If refresh fails, sync is disabled for that user.
- **Retry with exponential backoff**: Rate limit (429) and server errors (5xx) are retried up to 3 times with exponential delay.
- **Non-blocking sync**: Event creation/update in the app never waits for Google Calendar sync. Sync failures are logged but don't break the app.

### Roles & Visibility Model

This integration uses two roles (adapted from the original ADMIN/INSTRUCTOR/STUDENT model):

| Role | Permissions |
|---|---|
| **ADMIN** | See all events, create/edit/delete any event, manage calendar settings |
| **EVENT_COORDINATOR** | Create/edit/delete own events, see INTERNAL + own events |

Visibility levels (adapted from PUBLIC/COURSE/PRIVATE/CUSTOM):

| Visibility | Who Can See |
|---|---|
| **INTERNAL** | All ADMINs and EVENT_COORDINATORs (replaces PUBLIC - no student-facing events) |
| **INVITED** | Only explicitly listed invitees (replaces CUSTOM) |
| **PRIVATE** | Only the creator |

> The original system had `COURSE` visibility tied to course enrollments. Since msb-japan-site has no courses, this is removed entirely.

---

## 2. Prisma Schema

Add these models and fields to your existing `schema.prisma`. Adapt the `User` model fields to match your existing user model.

```prisma
// Add these fields to your existing User model:
// model User {
//   ... existing fields ...
//   googleAccessToken          String?
//   googleRefreshToken         String?
//   googleTokenExpiry          DateTime?
//   googleCalendarSyncEnabled  Boolean  @default(false)
//   googleCalendarId           String?
//   googleCalendarLastSync     DateTime?
//   createdEvents              CalendarEvent[]              @relation("CreatedEvents")
//   googleCalendarEvents       UserGoogleCalendarEvent[]    @relation("UserGoogleCalendarEvents")
// }

model CalendarEvent {
  id                String              @id @default(cuid())
  title             String
  description       String?
  startTime         DateTime
  endTime           DateTime
  location          String?
  meetingUrl        String?
  eventType         EventType
  createdBy         String
  createdByRole     UserRole            // Use your existing role enum name
  isAllDay          Boolean             @default(false)
  recurrence        String?             // RRULE string for recurring events
  attendees         String[]            @default([])  // Array of user IDs for INVITED visibility
  visibility        EventVisibility     @default(INTERNAL)
  reminderMinutes   Int?
  metadata          Json?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  creator           User                @relation("CreatedEvents", fields: [createdBy], references: [id], onDelete: Cascade)
  userGoogleEvents  UserGoogleCalendarEvent[] @relation("CalendarEventGoogleEvents")

  @@index([createdBy])
  @@index([startTime])
  @@index([eventType])
  @@index([visibility])
}

// Per-user Google Calendar event ID tracking
// One app event synced to N users = N Google Calendar event IDs
model UserGoogleCalendarEvent {
  id               String        @id @default(cuid())
  userId           String
  calendarEventId  String
  googleEventId    String
  googleCalendarId String        @default("primary")
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  user             User          @relation("UserGoogleCalendarEvents", fields: [userId], references: [id], onDelete: Cascade)
  calendarEvent    CalendarEvent @relation("CalendarEventGoogleEvents", fields: [calendarEventId], references: [id], onDelete: Cascade)

  @@unique([userId, calendarEventId])
  @@index([userId])
  @@index([calendarEventId])
  @@index([googleEventId])
}

enum EventType {
  MEETING
  DEADLINE
  WORKSHOP
  HOLIDAY
  OTHER
}

enum EventVisibility {
  INTERNAL    // Visible to all admins and event coordinators
  INVITED     // Visible only to explicitly listed attendees
  PRIVATE     // Visible only to creator
}
```

After adding, run:
```bash
npx prisma generate
npx prisma db push   # or npx prisma migrate dev
```

---

## 3. Environment Variables

Add to `.env`:

```env
# Google OAuth (create at https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-calendar/callback

# Encryption (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_SECRET=your-64-char-hex-string

# App URL (used for event source metadata in Google Calendar)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Google Cloud Console setup:**
1. Enable the Google Calendar API
2. Create OAuth 2.0 credentials (Web application type)
3. Add authorized redirect URI: `{your-domain}/api/google-calendar/callback`
4. Add scopes: `calendar` and `userinfo.email`

---

## 4. File Structure

```
src/
├── lib/
│   ├── encryption.ts                    # AES-256-GCM encrypt/decrypt
│   ├── prisma.ts                        # Prisma client singleton (you likely have this)
│   └── auth.ts                          # Auth helpers adapted for NextAuth.js
├── server/
│   └── google-calendar/
│       ├── googleCalendarClient.ts       # Google Calendar API wrapper
│       ├── tokenManager.ts              # Token encryption, refresh, lifecycle
│       └── syncService.ts               # High-level sync orchestration
├── app/
│   └── api/
│       ├── google-calendar/
│       │   ├── auth/route.ts            # Initiate OAuth flow
│       │   ├── callback/route.ts        # Handle OAuth callback
│       │   ├── token/route.ts           # Check status / disconnect
│       │   ├── events/route.ts          # List Google Calendar events
│       │   └── sync/
│       │       └── batch/route.ts       # Manual batch sync
│       └── calendar/
│           ├── events/route.ts          # CRUD for app calendar events
│           └── events/[id]/route.ts     # Update/delete specific event
└── components/
    └── calendar/
        ├── GoogleCalendarSettings.tsx    # Connect/disconnect/sync UI
        ├── EventFormModal.tsx           # Create/edit event form
        └── UserSelector.tsx            # Select invitees for INVITED visibility
```

---

## 5. Encryption Utility

`src/lib/encryption.ts` - AES-256-GCM encryption for OAuth tokens at rest.

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function getEncryptionKey(salt: Buffer): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set');
  }
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LENGTH, 'sha512');
}

export function encrypt(text: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey(salt);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  const combined = Buffer.concat([
    salt, iv, authTag, Buffer.from(encrypted, 'hex'),
  ]);
  return combined.toString('base64');
}

export function decrypt(encryptedData: string): string {
  const combined = Buffer.from(encryptedData, 'base64');
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = getEncryptionKey(salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## 6. Google Calendar Client

`src/server/google-calendar/googleCalendarClient.ts` - Wraps the Google Calendar v3 API with typed error handling and retry logic.

```typescript
import { google, calendar_v3 } from 'googleapis';

// --- Error Classes ---

export class GoogleCalendarError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GoogleCalendarError';
  }
}

export class GoogleCalendarAuthError extends GoogleCalendarError {
  constructor(message: string = 'Google Calendar authentication failed') {
    super(message, 401);
    this.name = 'GoogleCalendarAuthError';
  }
}

export class GoogleCalendarRateLimitError extends GoogleCalendarError {
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
    super(message, 429);
    this.name = 'GoogleCalendarRateLimitError';
  }
}

export class GoogleCalendarNotFoundError extends GoogleCalendarError {
  constructor(message: string = 'Calendar event not found') {
    super(message, 404);
    this.name = 'GoogleCalendarNotFoundError';
  }
}

// --- Client Class ---

export class GoogleCalendarClient {
  private oauth2Client: InstanceType<typeof google.auth.OAuth2>;
  private calendar: calendar_v3.Calendar;

  constructor(accessToken: string, refreshToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  async createEvent(calendarId: string, event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.insert({ calendarId, requestBody: event });
      if (!response.data) throw new GoogleCalendarError('No data returned');
      return response.data;
    } catch (error: any) {
      return this.handleError(error, 'create event');
    }
  }

  async updateEvent(calendarId: string, eventId: string, event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.update({ calendarId, eventId, requestBody: event });
      if (!response.data) throw new GoogleCalendarError('No data returned');
      return response.data;
    } catch (error: any) {
      return this.handleError(error, 'update event');
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({ calendarId, eventId });
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 410) return;
      return this.handleError(error, 'delete event');
    }
  }

  async getEvent(calendarId: string, eventId: string): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.get({ calendarId, eventId });
      if (!response.data) throw new GoogleCalendarError('No data returned');
      return response.data;
    } catch (error: any) {
      return this.handleError(error, 'get event');
    }
  }

  async listEvents(calendarId: string, options?: {
    timeMin?: string; timeMax?: string; maxResults?: number;
    singleEvents?: boolean; orderBy?: string;
  }): Promise<calendar_v3.Schema$Event[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: options?.timeMin,
        timeMax: options?.timeMax,
        maxResults: options?.maxResults || 250,
        singleEvents: options?.singleEvents !== false,
        orderBy: options?.orderBy || 'startTime',
      });
      return response.data.items || [];
    } catch (error: any) {
      return this.handleError(error, 'list events');
    }
  }

  async refreshAccessToken(): Promise<{ accessToken: string; expiry: Date }> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      if (!credentials.access_token || !credentials.expiry_date) {
        throw new GoogleCalendarAuthError('Failed to refresh token');
      }
      this.oauth2Client.setCredentials(credentials);
      return {
        accessToken: credentials.access_token,
        expiry: new Date(credentials.expiry_date),
      };
    } catch (error: any) {
      throw new GoogleCalendarAuthError('Token refresh failed');
    }
  }

  private handleError(error: any, operation: string): never {
    const status = error.response?.status || error.code;
    const message = error.message || 'Unknown error';

    switch (status) {
      case 401:
      case 'UNAUTHENTICATED':
        throw new GoogleCalendarAuthError(`Auth failed: ${operation}`);
      case 403:
        if (message.includes('rate') || message.includes('quota') || message.includes('limit')) {
          throw new GoogleCalendarRateLimitError(`Rate limit: ${operation}`, error.response?.headers?.['retry-after']);
        }
        throw new GoogleCalendarError(`Permission denied: ${operation}`, 403);
      case 404:
      case 410:
        throw new GoogleCalendarNotFoundError(`Not found: ${operation}`);
      default:
        throw new GoogleCalendarError(`Failed to ${operation}: ${message}`, status);
    }
  }
}

// --- Retry Helper ---

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (
        error instanceof GoogleCalendarRateLimitError ||
        (error instanceof GoogleCalendarError && error.statusCode && error.statusCode >= 500)
      ) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error('Max retries exceeded');
}

export function createGoogleCalendarClient(accessToken: string, refreshToken: string): GoogleCalendarClient {
  return new GoogleCalendarClient(accessToken, refreshToken);
}
```

Install dependency: `npm install googleapis`

---

## 7. Token Manager

`src/server/google-calendar/tokenManager.ts` - Manages encrypted token storage, refresh lifecycle, and connection status.

```typescript
import prisma from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';

export interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiry: Date;
}

export interface TokenRefreshResult {
  accessToken: string;
  expiry: Date;
}

export async function getDecryptedTokens(userId: string): Promise<GoogleTokens | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
      googleCalendarSyncEnabled: true,
    },
  });

  if (!user || !user.googleCalendarSyncEnabled) return null;
  if (!user.googleAccessToken || !user.googleRefreshToken) return null;

  return {
    accessToken: decrypt(user.googleAccessToken),
    refreshToken: decrypt(user.googleRefreshToken),
    expiry: user.googleTokenExpiry || new Date(),
  };
}

export async function storeEncryptedTokens(userId: string, tokens: GoogleTokens): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: encrypt(tokens.accessToken),
      googleRefreshToken: encrypt(tokens.refreshToken),
      googleTokenExpiry: tokens.expiry,
      googleCalendarSyncEnabled: true,
      googleCalendarId: 'primary',
    },
  });
}

export async function isTokenExpired(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { googleTokenExpiry: true },
  });
  if (!user || !user.googleTokenExpiry) return true;

  const bufferMs = 5 * 60 * 1000; // 5-minute buffer
  return new Date() >= new Date(user.googleTokenExpiry.getTime() - bufferMs);
}

export async function refreshUserToken(userId: string): Promise<TokenRefreshResult> {
  const tokens = await getDecryptedTokens(userId);
  if (!tokens) throw new Error('No tokens found for user');

  const { google } = await import('googleapis');
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: tokens.refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials.access_token || !credentials.expiry_date) {
      throw new Error('Failed to refresh token');
    }

    const newTokens: GoogleTokens = {
      accessToken: credentials.access_token,
      refreshToken: tokens.refreshToken,
      expiry: new Date(credentials.expiry_date),
    };
    await storeEncryptedTokens(userId, newTokens);

    return { accessToken: newTokens.accessToken, expiry: newTokens.expiry };
  } catch (error) {
    await disableSync(userId);
    throw new Error('Failed to refresh token. Please reconnect Google Calendar.');
  }
}

export async function getValidAccessToken(userId: string): Promise<string> {
  if (await isTokenExpired(userId)) {
    const result = await refreshUserToken(userId);
    return result.accessToken;
  }
  const tokens = await getDecryptedTokens(userId);
  if (!tokens) throw new Error('No tokens available');
  return tokens.accessToken;
}

export async function disableSync(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { googleCalendarSyncEnabled: false },
  });
}

export async function disconnectGoogleCalendar(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
      googleCalendarSyncEnabled: false,
      googleCalendarId: null,
      googleCalendarLastSync: null,
    },
  });
}

export async function updateLastSyncTime(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { googleCalendarLastSync: new Date() },
  }).catch(() => {}); // Non-critical
}
```

---

## 8. Sync Service

`src/server/google-calendar/syncService.ts` - Orchestrates syncing app events to Google Calendar based on visibility rules.

```typescript
import prisma from '@/lib/prisma';
import { calendar_v3 } from 'googleapis';
import {
  getDecryptedTokens, getValidAccessToken, updateLastSyncTime, disableSync,
} from './tokenManager';
import {
  createGoogleCalendarClient, retryWithBackoff,
  GoogleCalendarAuthError, GoogleCalendarNotFoundError,
} from './googleCalendarClient';
import type { CalendarEvent } from '@prisma/client';

export interface SyncResult {
  success: boolean;
  googleEventId?: string;
  error?: string;
}

export interface BatchSyncResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: Array<{ eventId: string; error: string }>;
}

// --- Sync a single event to one user's Google Calendar ---

export async function syncEventToGoogleCalendar(
  userId: string, event: CalendarEvent
): Promise<SyncResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
    });
    if (!user || !user.googleCalendarSyncEnabled) return { success: true };

    const calendarId = user.googleCalendarId || 'primary';
    const accessToken = await getValidAccessToken(userId);
    const tokens = await getDecryptedTokens(userId);
    if (!tokens) throw new Error('No tokens available');

    const client = createGoogleCalendarClient(accessToken, tokens.refreshToken);
    const googleEvent = convertToGoogleCalendarEvent(event);

    // Check for existing mapping
    const existingUserEvent = await prisma.userGoogleCalendarEvent.findUnique({
      where: { userId_calendarEventId: { userId, calendarEventId: event.id } },
    });

    let googleEventId: string;

    if (existingUserEvent) {
      // Update existing
      try {
        const result = await retryWithBackoff(() =>
          client.updateEvent(calendarId, existingUserEvent.googleEventId, googleEvent)
        );
        googleEventId = result.id!;

        if (googleEventId !== existingUserEvent.googleEventId) {
          await prisma.userGoogleCalendarEvent.update({
            where: { id: existingUserEvent.id },
            data: { googleEventId, googleCalendarId: calendarId },
          });
        }
      } catch (updateError: any) {
        if (updateError instanceof GoogleCalendarNotFoundError) {
          // Event deleted from Google Calendar, recreate
          const result = await retryWithBackoff(() =>
            client.createEvent(calendarId, googleEvent)
          );
          googleEventId = result.id!;
          await prisma.userGoogleCalendarEvent.update({
            where: { id: existingUserEvent.id },
            data: { googleEventId, googleCalendarId: calendarId },
          });
        } else {
          throw updateError;
        }
      }
    } else {
      // Create new
      const result = await retryWithBackoff(() =>
        client.createEvent(calendarId, googleEvent)
      );
      googleEventId = result.id!;
      await prisma.userGoogleCalendarEvent.create({
        data: { userId, calendarEventId: event.id, googleEventId, googleCalendarId: calendarId },
      });
    }

    return { success: true, googleEventId };
  } catch (error: any) {
    if (error instanceof GoogleCalendarAuthError) {
      await disableSync(userId);
      return { success: false, error: 'Auth failed. Please reconnect Google Calendar.' };
    }
    return { success: false, error: error.message || 'Failed to sync event' };
  }
}

// --- Delete event from one user's Google Calendar ---

export async function deleteEventFromGoogleCalendar(
  userId: string, event: CalendarEvent
): Promise<SyncResult> {
  try {
    const userEvent = await prisma.userGoogleCalendarEvent.findUnique({
      where: { userId_calendarEventId: { userId, calendarEventId: event.id } },
    });
    if (!userEvent) return { success: true };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
    });

    if (!user || !user.googleCalendarSyncEnabled) {
      await prisma.userGoogleCalendarEvent.delete({ where: { id: userEvent.id } });
      return { success: true };
    }

    const calendarId = user.googleCalendarId || 'primary';
    const accessToken = await getValidAccessToken(userId);
    const tokens = await getDecryptedTokens(userId);
    if (!tokens) throw new Error('No tokens available');

    const client = createGoogleCalendarClient(accessToken, tokens.refreshToken);
    await retryWithBackoff(() => client.deleteEvent(calendarId, userEvent.googleEventId));
    await prisma.userGoogleCalendarEvent.delete({ where: { id: userEvent.id } });

    return { success: true };
  } catch (error: any) {
    if (error instanceof GoogleCalendarNotFoundError) {
      await prisma.userGoogleCalendarEvent.deleteMany({
        where: { userId, calendarEventId: event.id },
      }).catch(() => {});
      return { success: true };
    }
    return { success: false, error: error.message };
  }
}

// --- Batch sync all visible events for a user ---

export async function batchSyncEvents(userId: string): Promise<BatchSyncResult> {
  const result: BatchSyncResult = { total: 0, created: 0, updated: 0, failed: 0, errors: [] };

  const events = await getEventsVisibleToUser(userId);
  result.total = events.length;

  const existingMappings = await prisma.userGoogleCalendarEvent.findMany({
    where: { userId, calendarEventId: { in: events.map(e => e.id) } },
    select: { calendarEventId: true },
  });
  const existingEventIds = new Set(existingMappings.map(m => m.calendarEventId));

  const BATCH_SIZE = 10;
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((event) => syncEventToGoogleCalendar(userId, event))
    );

    results.forEach((promiseResult, index) => {
      const event = batch[index];
      if (promiseResult.status === 'fulfilled' && promiseResult.value.success) {
        if (existingEventIds.has(event.id)) result.updated++;
        else result.created++;
      } else {
        result.failed++;
        result.errors.push({
          eventId: event.id,
          error: promiseResult.status === 'fulfilled'
            ? promiseResult.value.error || 'Unknown'
            : promiseResult.reason?.message || 'Unknown',
        });
      }
    });

    if (i + BATCH_SIZE < events.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  await updateLastSyncTime(userId);
  return result;
}

// --- Sync to all relevant users (called on event create/update) ---

export async function syncEventToAllRelevantUsers(event: CalendarEvent): Promise<void> {
  try {
    const relevantUsers = await getUsersWhoShouldSeeEvent(event);
    await Promise.allSettled(
      relevantUsers.map((user) => syncEventToGoogleCalendar(user.id, event))
    );
  } catch (error) {
    // Don't throw - sync failures shouldn't break event creation
    console.error('Failed to sync event to all users:', error);
  }
}

// --- Delete from all relevant users (called on event delete) ---

export async function deleteEventFromAllRelevantUsers(event: CalendarEvent): Promise<void> {
  try {
    const relevantUsers = await getUsersWhoShouldSeeEvent(event);
    await Promise.allSettled(
      relevantUsers.map((user) => deleteEventFromGoogleCalendar(user.id, event))
    );
  } catch (error) {
    console.error('Failed to delete event from all users:', error);
  }
}

// --- Visibility Logic (ADAPTED for ADMIN + EVENT_COORDINATOR roles) ---

async function getEventsVisibleToUser(userId: string): Promise<CalendarEvent[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw new Error('User not found');

  const where: any = {};

  if (user.role === 'ADMIN') {
    // Admins see all events
  } else if (user.role === 'EVENT_COORDINATOR') {
    // Event coordinators see INTERNAL events + their own + events they're invited to
    where.OR = [
      { visibility: 'INTERNAL' },
      { createdBy: userId },
      { attendees: { has: userId } },
    ];
  } else {
    // Other users only see events they're invited to or created
    where.OR = [
      { createdBy: userId },
      { attendees: { has: userId } },
    ];
  }

  return prisma.calendarEvent.findMany({ where, orderBy: { startTime: 'asc' } });
}

async function getUsersWhoShouldSeeEvent(
  event: CalendarEvent
): Promise<Array<{ id: string }>> {
  const syncEnabledUsers = await prisma.user.findMany({
    where: { googleCalendarSyncEnabled: true },
    select: { id: true, role: true },
  });

  if (event.visibility === 'INTERNAL') {
    // All admins and event coordinators with sync enabled
    return syncEnabledUsers.filter(
      (u) => u.role === 'ADMIN' || u.role === 'EVENT_COORDINATOR'
    );
  }

  if (event.visibility === 'PRIVATE') {
    return syncEnabledUsers.filter((u) => u.id === event.createdBy);
  }

  if (event.visibility === 'INVITED') {
    if (event.attendees && event.attendees.length > 0) {
      return syncEnabledUsers.filter((u) => event.attendees.includes(u.id));
    }
    return [];
  }

  return [];
}

// --- Convert app event to Google Calendar format ---

function convertToGoogleCalendarEvent(event: CalendarEvent): calendar_v3.Schema$Event {
  const googleEvent: calendar_v3.Schema$Event = {
    summary: event.title,
    description: event.description || undefined,
    location: event.location || undefined,
  };

  if (event.isAllDay) {
    googleEvent.start = { date: event.startTime.toISOString().split('T')[0] };
    googleEvent.end = { date: event.endTime.toISOString().split('T')[0] };
  } else {
    googleEvent.start = { dateTime: event.startTime.toISOString(), timeZone: 'UTC' };
    googleEvent.end = { dateTime: event.endTime.toISOString(), timeZone: 'UTC' };
  }

  if (event.meetingUrl) {
    googleEvent.description = googleEvent.description
      ? `${googleEvent.description}\n\nMeeting URL: ${event.meetingUrl}`
      : `Meeting URL: ${event.meetingUrl}`;
  }

  if (event.reminderMinutes) {
    googleEvent.reminders = {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: event.reminderMinutes },
        { method: 'email', minutes: event.reminderMinutes },
      ],
    };
  }

  if (event.recurrence) {
    googleEvent.recurrence = [event.recurrence];
  }

  googleEvent.source = {
    title: 'MSB Japan',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/calendar`,
  };

  const colorMap: Record<string, string> = {
    MEETING: '9',    // Blue
    DEADLINE: '11',  // Red
    WORKSHOP: '6',   // Orange
    HOLIDAY: '2',    // Sage
    OTHER: '7',      // Cyan
  };
  googleEvent.colorId = colorMap[event.eventType] || colorMap.OTHER;

  return googleEvent;
}
```

---

## 9. API Routes

### 9a. OAuth Initiation - `src/app/api/google-calendar/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Your NextAuth config
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
      return NextResponse.json({ success: false, error: 'Google Calendar not configured' }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // CSRF state token with user ID
    const state = Buffer.from(JSON.stringify({
      state: crypto.randomBytes(32).toString('hex'),
      userId: session.user.id,
    })).toString('base64');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      state,
      prompt: 'consent', // Force consent to ensure refresh token
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}
```

### 9b. OAuth Callback - `src/app/api/google-calendar/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { storeEncryptedTokens, GoogleTokens } from '@/server/google-calendar/tokenManager';
import { batchSyncEvents } from '@/server/google-calendar/syncService';

export async function GET(request: NextRequest) {
  // Adjust this redirect path to wherever your calendar settings page lives
  const settingsUrl = '/settings/calendar';

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Validate state and extract userId
    let userId: string;
    try {
      const decoded = JSON.parse(Buffer.from(state || '', 'base64').toString());
      userId = decoded.userId;
      if (!userId) throw new Error('No userId in state');
    } catch {
      return NextResponse.redirect(new URL(`${settingsUrl}?error=invalid_state`, request.url));
    }

    if (error) {
      return NextResponse.redirect(new URL(`${settingsUrl}?error=google_calendar_denied`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL(`${settingsUrl}?error=invalid_callback`, request.url));
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
      return NextResponse.redirect(new URL(`${settingsUrl}?error=incomplete_tokens`, request.url));
    }

    const googleTokens: GoogleTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiry: new Date(tokens.expiry_date),
    };
    await storeEncryptedTokens(userId, googleTokens);

    // Trigger initial batch sync (async, don't wait)
    batchSyncEvents(userId).catch(console.error);

    return NextResponse.redirect(
      new URL(`${settingsUrl}?success=google_calendar_connected`, request.url)
    );
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`${settingsUrl}?error=${encodeURIComponent(error.message || 'callback_failed')}`, request.url)
    );
  }
}
```

### 9c. Token Status / Disconnect - `src/app/api/google-calendar/token/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { disconnectGoogleCalendar } from '@/server/google-calendar/tokenManager';

// GET - Check connection status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleCalendarSyncEnabled: true,
        googleCalendarId: true,
        googleCalendarLastSync: true,
        googleTokenExpiry: true,
      },
    });

    return NextResponse.json({
      success: true,
      connected: userData?.googleCalendarSyncEnabled || false,
      calendarId: userData?.googleCalendarId,
      lastSync: userData?.googleCalendarLastSync,
      tokenExpiry: userData?.googleTokenExpiry,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to check status' }, { status: 500 });
  }
}

// DELETE - Disconnect Google Calendar
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await disconnectGoogleCalendar(session.user.id);
    return NextResponse.json({ success: true, message: 'Disconnected' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to disconnect' }, { status: 500 });
  }
}
```

### 9d. Batch Sync - `src/app/api/google-calendar/sync/batch/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { batchSyncEvents } from '@/server/google-calendar/syncService';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await batchSyncEvents(session.user.id);
    return NextResponse.json({ success: true, message: 'Batch sync completed', result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Batch sync failed', details: error.message },
      { status: 500 }
    );
  }
}
```

### 9e. App Calendar Events CRUD - `src/app/api/calendar/events/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { syncEventToAllRelevantUsers } from '@/server/google-calendar/syncService';

// GET - List events visible to current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');

    const where: any = {};

    // Date filtering
    if (startDate || endDate) {
      where.AND = [];
      if (startDate) where.AND.push({ endTime: { gte: new Date(startDate) } });
      if (endDate) where.AND.push({ startTime: { lte: new Date(endDate) } });
    }

    if (type) where.eventType = type;

    // Get user role from DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Role-based visibility
    if (user?.role === 'ADMIN') {
      // Admins see all events
    } else if (user?.role === 'EVENT_COORDINATOR') {
      where.OR = [
        { visibility: 'INTERNAL' },
        { createdBy: session.user.id },
        { attendees: { has: session.user.id } },
      ];
    } else {
      // Other users only see events they created or are invited to
      where.OR = [
        { createdBy: session.user.id },
        { attendees: { has: session.user.id } },
      ];
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json({ success: true, events, count: events.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only ADMIN and EVENT_COORDINATOR can create events
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (!user || !['ADMIN', 'EVENT_COORDINATOR'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title, description, startTime, endTime, location, meetingUrl,
      eventType, visibility = 'INTERNAL', isAllDay = false,
      attendees = [], reminderMinutes,
    } = body;

    if (!title || !startTime || !endTime || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, startTime, endTime, eventType' },
        { status: 400 }
      );
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json({ success: false, error: 'End time must be after start time' }, { status: 400 });
    }

    if (visibility === 'INVITED' && (!attendees || attendees.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'INVITED visibility requires at least one attendee' },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title, description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location, meetingUrl, eventType, visibility, isAllDay,
        attendees, reminderMinutes,
        createdBy: session.user.id,
        createdByRole: user.role,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Async Google Calendar sync (non-blocking)
    syncEventToAllRelevantUsers(event).catch(console.error);

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
  }
}
```

### 9f. Update/Delete Event - `src/app/api/calendar/events/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  syncEventToAllRelevantUsers,
  deleteEventFromAllRelevantUsers,
} from '@/server/google-calendar/syncService';

// PUT - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existingEvent = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Only creator or admin can update
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== 'ADMIN' && existingEvent.createdBy !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title, description, startTime, endTime, location, meetingUrl,
      eventType, visibility, isAllDay, attendees, reminderMinutes,
    } = body;

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json({ success: false, error: 'End time must be after start time' }, { status: 400 });
    }

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(location !== undefined && { location }),
        ...(meetingUrl !== undefined && { meetingUrl }),
        ...(eventType !== undefined && { eventType }),
        ...(visibility !== undefined && { visibility }),
        ...(isAllDay !== undefined && { isAllDay }),
        ...(attendees !== undefined && { attendees }),
        ...(reminderMinutes !== undefined && { reminderMinutes }),
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    syncEventToAllRelevantUsers(updatedEvent).catch(console.error);

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existingEvent = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== 'ADMIN' && existingEvent.createdBy !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Delete from Google Calendar first
    await deleteEventFromAllRelevantUsers(existingEvent).catch(console.error);

    // Delete from DB
    await prisma.calendarEvent.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete event' }, { status: 500 });
  }
}
```

### 9g. Google Calendar Events (read from Google) - `src/app/api/google-calendar/events/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getValidAccessToken, getDecryptedTokens } from '@/server/google-calendar/tokenManager';
import { createGoogleCalendarClient } from '@/server/google-calendar/googleCalendarClient';
import prisma from '@/lib/prisma';

// GET - Fetch events directly from user's Google Calendar
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const timeMin = searchParams.get('timeMin') || new Date().toISOString();
    const timeMax = searchParams.get('timeMax');

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
    });

    if (!dbUser || !dbUser.googleCalendarSyncEnabled) {
      return NextResponse.json({ success: false, connected: false, events: [] });
    }

    const calendarId = dbUser.googleCalendarId || 'primary';
    const accessToken = await getValidAccessToken(session.user.id);
    const tokens = await getDecryptedTokens(session.user.id);
    if (!tokens) {
      return NextResponse.json({ success: false, connected: false, events: [] });
    }

    const client = createGoogleCalendarClient(accessToken, tokens.refreshToken);
    const params: any = { timeMin, maxResults, singleEvents: true, orderBy: 'startTime' };
    if (timeMax) params.timeMax = timeMax;

    const response = await client.listEvents(calendarId, params);

    const events = (response || []).map((event: any) => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description,
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      isAllDay: !!event.start?.date,
      location: event.location,
      meetingUrl: event.hangoutLink,
      htmlLink: event.htmlLink,
    }));

    return NextResponse.json({ success: true, connected: true, events, count: events.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch events', events: [] }, { status: 500 });
  }
}
```

---

## 10. UI Components

### 10a. Google Calendar Settings - `src/components/calendar/GoogleCalendarSettings.tsx`

Connect/disconnect Google Calendar and trigger manual sync.

```tsx
'use client';

import { useState, useEffect } from 'react';

interface GoogleCalendarStatus {
  connected: boolean;
  calendarId?: string;
  lastSync?: string;
  tokenExpiry?: string;
}

export default function GoogleCalendarSettings() {
  const [status, setStatus] = useState<GoogleCalendarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadStatus(); }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/google-calendar/token');
      const data = await res.json();
      if (data.success) setStatus(data);
      else setError(data.error || 'Failed to load status');
    } catch {
      setError('Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = '/api/google-calendar/auth';
  };

  const handleDisconnect = async () => {
    if (!confirm('Disconnect Google Calendar? Synced events will remain in your Google Calendar.')) return;
    try {
      setDisconnecting(true);
      setError(null);
      const res = await fetch('/api/google-calendar/token', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { setStatus({ connected: false }); setSyncResult(null); }
      else setError(data.error);
    } catch {
      setError('Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      setSyncResult(null);
      const res = await fetch('/api/google-calendar/sync/batch', { method: 'POST' });
      const data = await res.json();
      if (data.success) { setSyncResult(data.result); await loadStatus(); }
      else setError(data.error);
    } catch {
      setError('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Google Calendar Integration</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {status?.connected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <p className="text-sm font-medium">Connected to Google Calendar</p>
          </div>

          {status.lastSync && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last sync: {new Date(status.lastSync).toLocaleString()}
            </p>
          )}

          {syncResult && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
              <p className="font-medium mb-1">Sync Complete</p>
              <p>Total: {syncResult.total} | Created: {syncResult.created} | Updated: {syncResult.updated}</p>
              {syncResult.failed > 0 && <p className="text-red-600">Failed: {syncResult.failed}</p>}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSync} disabled={syncing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <button onClick={handleDisconnect} disabled={disconnecting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <p className="text-sm font-medium">Not connected</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect your Google Calendar to automatically sync events.
          </p>
          <button onClick={handleConnect}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Connect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
}
```

### 10b. Event Form Modal - `src/components/calendar/EventFormModal.tsx`

Adapt the form for your event types and visibility model. See the full form in the source code reference above. Key changes from the original:

- **Event types**: MEETING, DEADLINE, WORKSHOP, HOLIDAY, OTHER (removed LMS-specific types)
- **Visibility options**: INTERNAL, INVITED, PRIVATE (removed PUBLIC, COURSE)
- **No course selector** (removed courseId field)
- **Attendees selector** shown when visibility is INVITED

```tsx
// The form structure follows the same pattern as EventFormModal above.
// Key visibility options for your app:
const visibilityOptions = [
  { value: 'INTERNAL', label: 'Internal', description: 'Visible to admins & event coordinators' },
  { value: 'INVITED', label: 'Invited Only', description: 'Visible to selected users' },
  { value: 'PRIVATE', label: 'Private', description: 'Visible only to you' },
];

// Show UserSelector when visibility === 'INVITED'
```

---

## 11. Auth Helpers

Your NextAuth.js auth helpers should provide session access in API routes. Here's the pattern used throughout:

```typescript
// In every API route:
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Your NextAuth.js config

const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

// session.user.id is the database user ID
// To check roles, query the DB:
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { role: true },
});
```

Make sure your NextAuth config exposes the database user ID in the session. In your `[...nextauth]/route.ts` callbacks:

```typescript
callbacks: {
  async session({ session, token }) {
    if (token.sub) {
      session.user.id = token.sub; // or your DB user ID
    }
    return session;
  },
}
```

---

## 12. Setup Checklist

1. [ ] Install dependency: `npm install googleapis`
2. [ ] Add Prisma schema models (`CalendarEvent`, `UserGoogleCalendarEvent`, `EventType`, `EventVisibility` enums)
3. [ ] Add Google Calendar fields to your `User` model
4. [ ] Run `npx prisma generate && npx prisma db push`
5. [ ] Create `src/lib/encryption.ts`
6. [ ] Create `src/server/google-calendar/googleCalendarClient.ts`
7. [ ] Create `src/server/google-calendar/tokenManager.ts`
8. [ ] Create `src/server/google-calendar/syncService.ts`
9. [ ] Create API routes (7 route files)
10. [ ] Create UI components
11. [ ] Set environment variables (`.env`)
12. [ ] Set up Google Cloud Console OAuth credentials
13. [ ] Ensure NextAuth.js session includes the database user ID
14. [ ] Add `ADMIN` and `EVENT_COORDINATOR` roles to your role enum if not already present
15. [ ] Test: Connect Google Calendar -> Create event -> Verify it appears in Google Calendar
16. [ ] Test: Manual batch sync -> Verify all visible events sync
17. [ ] Test: Disconnect -> Verify tokens are cleared
