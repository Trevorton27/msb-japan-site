# Google Calendar Setup

This guide explains how to connect, use, and manage Google Calendar sync from the admin UI. It assumes all Google Cloud Platform credentials and Vercel environment variables are already configured.

## Prerequisites

- You must be logged into the admin panel
- Your account must have the **Administrator** or **Event Coordinator** role

## Connecting Google Calendar

1. Navigate to **Settings** in the admin sidebar (or go to `/admin/settings`)
2. Under **Google Calendar Integration**, click **Connect Google Calendar**
3. You will be redirected to Google's consent screen
4. Select the Google account you want to sync events to
5. Grant the requested permissions (calendar access and email verification)
6. You will be redirected back to the Settings page with a success message
7. An initial batch sync automatically runs in the background, pushing all published future events to your Google Calendar

## Syncing Events

### Automatic Sync

Once connected, events sync automatically whenever an admin or event coordinator:

- **Creates** a published event — the event is added to all connected users' Google Calendars
- **Updates** a published event — the event is updated in all connected users' Google Calendars
- **Unpublishes** an event (changes status from Published to Draft/Cancelled/Completed) — the event is removed from all connected users' Google Calendars
- **Deletes** an event — the event is removed from all connected users' Google Calendars

Sync is non-blocking — if it fails, event creation/editing is not affected.

### Manual Sync

To manually sync all published future events:

1. Go to **Settings**
2. Click **Sync Now**
3. A summary will appear showing how many events were created, updated, or failed

### What Gets Synced

- Only **published** events with a start date **in the future** are synced
- Event titles appear in bilingual format: **English / Japanese** (e.g. "Meditation Workshop / 瞑想ワークショップ")
- Event descriptions include both English and Japanese text, plus the online URL if applicable
- The venue name is used as the Google Calendar event location
- Events are color-coded by mode: blue (in-person), orange (online), sage (hybrid)
- All events use the **Asia/Tokyo** timezone

## Disconnecting

1. Go to **Settings**
2. Click **Disconnect**
3. Confirm when prompted

This clears your stored tokens and disables sync. Events that were already synced will remain in your Google Calendar — they are not automatically removed on disconnect.

## Troubleshooting

| Issue | Solution |
|---|---|
| "Not connected" after connecting | Check browser console/network tab for errors. Ensure `ENCRYPTION_SECRET` and `GOOGLE_REDIRECT_URI` are set on Vercel and the app has been redeployed. |
| Events not appearing in Google Calendar | Click **Sync Now** to trigger a manual sync. Check that events are **Published** and have a future start date. |
| "Auth failed" error during sync | Your Google token has expired and could not be refreshed. Click **Disconnect**, then **Connect Google Calendar** again. |
| Sync shows failures | Some events may have failed due to Google API rate limits. Wait a moment and click **Sync Now** again. |

## Notes

- Each user connects their own Google Calendar independently
- Multiple admin users can each connect their own calendars
- If you revoke access from [Google Account Permissions](https://myaccount.google.com/permissions), you should also click **Disconnect** in the admin UI to clean up stored tokens
