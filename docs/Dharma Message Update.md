# Dharma Message Update

## Setup

### 1. CRON_SECRET

A `CRON_SECRET` must be set in `.env.local` (already added):

```
CRON_SECRET=msb-dharma-cron-939a1e805b792ba6ad0b5c2e95810259
```

For production, add this same value to Vercel environment variables.

## Testing

### Step 1: Start the dev server

```bash
pnpm dev
```

### Step 2: Create dharma messages via admin UI

- Go to `http://localhost:3002/admin/dharma-messages/new`
- Create 2-3 messages with the "Published" checkbox checked
- Give them different `sortOrder` values (e.g. 1, 2, 3)

### Step 3: Trigger the cron endpoint manually

```bash
curl -H "Authorization: Bearer msb-dharma-cron-939a1e805b792ba6ad0b5c2e95810259" \
  http://localhost:3002/api/cron/dharma-message
```

Expected response:

```json
{"success": true, "action": "published", "messageId": "<cuid>"}
```

### Step 4: Check the homepage

- Visit `http://localhost:3002/ja` — the Weekly Dharma Message section should show the message you just published

### Step 5: Trigger again to cycle

- Run the curl command again — it publishes the next message by `sortOrder`
- Once all are published, the next trigger resets the cycle and starts from the first

### Step 6: Verify on Vercel (production)

- Add the same `CRON_SECRET` value to Vercel environment variables
- The `vercel.json` cron runs every Sunday at 15:00 UTC (Monday 00:00 JST)

## Troubleshooting

### Homepage still shows static fallback text

This means no dharma message has `publishedAt` set yet. The query `getCurrentDharmaMessage()` looks for `published: true` AND `publishedAt: not null`. Creating a message in admin only sets `published: true` — `publishedAt` is only set when the cron fires (or you hit the curl endpoint above).

### Cron returns 401 Unauthorized

The `Authorization` header must match `Bearer <CRON_SECRET>` exactly. Verify the secret in `.env.local` matches what you're sending.

## How It Works

1. Admin creates dharma messages at `/admin/dharma-messages` with a `sortOrder` and marks them as "Published"
2. Every Sunday at midnight JST, the Vercel cron hits `/api/cron/dharma-message`
3. The cron picks the next message (by `sortOrder`) that has `published: true` but `publishedAt: null`, and sets `publishedAt` to now
4. The homepage query `getCurrentDharmaMessage()` returns the message with the most recent `publishedAt`
5. When all messages have been shown, the cron resets the cycle (clears all `publishedAt` values) and starts over from the first
