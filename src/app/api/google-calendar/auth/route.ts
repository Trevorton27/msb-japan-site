import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/auth";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      !process.env.AUTH_GOOGLE_ID ||
      !process.env.AUTH_GOOGLE_SECRET ||
      !process.env.GOOGLE_REDIRECT_URI
    ) {
      return NextResponse.json(
        { success: false, error: "Google Calendar not configured" },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const state = Buffer.from(
      JSON.stringify({
        state: crypto.randomBytes(32).toString("hex"),
        userId: session.user.id,
      })
    ).toString("base64");

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state,
      prompt: "consent",
    });

    return NextResponse.redirect(authUrl);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to initiate OAuth" },
      { status: 500 }
    );
  }
}
