import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import {
  storeEncryptedTokens,
  type GoogleTokens,
} from "@/server/google-calendar/tokenManager";
import { batchSyncEvents } from "@/server/google-calendar/syncService";

export async function GET(request: NextRequest) {
  let settingsUrl = "/admin/settings";

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    let userId: string;
    try {
      const decoded = JSON.parse(
        Buffer.from(state || "", "base64").toString()
      );
      userId = decoded.userId;
      if (decoded.returnTo) settingsUrl = decoded.returnTo;
      if (!userId) throw new Error("No userId in state");
    } catch {
      return NextResponse.redirect(
        new URL(`${settingsUrl}?error=invalid_state`, request.url)
      );
    }

    if (error) {
      return NextResponse.redirect(
        new URL(`${settingsUrl}?error=google_calendar_denied`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`${settingsUrl}?error=invalid_callback`, request.url)
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (
      !tokens.access_token ||
      !tokens.refresh_token ||
      !tokens.expiry_date
    ) {
      return NextResponse.redirect(
        new URL(`${settingsUrl}?error=incomplete_tokens`, request.url)
      );
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
      new URL(
        `${settingsUrl}?success=google_calendar_connected`,
        request.url
      )
    );
  } catch (error: unknown) {
    const message = (error as Error).message || "callback_failed";
    return NextResponse.redirect(
      new URL(
        `${settingsUrl}?error=${encodeURIComponent(message)}`,
        request.url
      )
    );
  }
}
