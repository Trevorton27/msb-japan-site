import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/admin/social?error=oauth_denied", request.url)
    );
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUri = `${appUrl}/api/social/meta/callback`;

  if (!appId || !appSecret) {
    return NextResponse.redirect(
      new URL("/admin/social?error=missing_credentials", request.url)
    );
  }

  try {
    // Exchange code for short-lived token
    const tokenRes = await fetch(
      `${GRAPH_API_BASE}/oauth/access_token?` +
        new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        })
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return NextResponse.redirect(
        new URL("/admin/social?error=token_exchange_failed", request.url)
      );
    }

    // Exchange for long-lived token
    const longTokenRes = await fetch(
      `${GRAPH_API_BASE}/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: tokenData.access_token,
        })
    );
    const longTokenData = await longTokenRes.json();
    const accessToken = longTokenData.access_token ?? tokenData.access_token;
    const expiresIn = longTokenData.expires_in ?? 5184000;

    // Get user info
    const meRes = await fetch(
      `${GRAPH_API_BASE}/me?fields=id,name&access_token=${accessToken}`
    );
    const meData = await meRes.json();

    // Get pages managed by the user
    const pagesRes = await fetch(
      `${GRAPH_API_BASE}/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();

    // Store the first page (most common use case) or the user account
    const page = pagesData.data?.[0];

    await db.socialAccount.create({
      data: {
        platform: "facebook",
        accountName: page?.name ?? meData.name ?? "Facebook Account",
        accessToken: page?.access_token ?? accessToken,
        refreshToken: accessToken,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        pageId: page?.id ?? meData.id,
      },
    });

    return NextResponse.redirect(
      new URL("/admin/social?success=connected", request.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/admin/social?error=connection_failed", request.url)
    );
  }
}
