import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/encryption";

export interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiry: Date;
}

export interface TokenRefreshResult {
  accessToken: string;
  expiry: Date;
}

export async function getDecryptedTokens(
  userId: string
): Promise<GoogleTokens | null> {
  const user = await db.user.findUnique({
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

export async function storeEncryptedTokens(
  userId: string,
  tokens: GoogleTokens
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: encrypt(tokens.accessToken),
      googleRefreshToken: encrypt(tokens.refreshToken),
      googleTokenExpiry: tokens.expiry,
      googleCalendarSyncEnabled: true,
      googleCalendarId: "primary",
    },
  });
}

export async function isTokenExpired(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { googleTokenExpiry: true },
  });
  if (!user || !user.googleTokenExpiry) return true;

  const bufferMs = 5 * 60 * 1000;
  return new Date() >= new Date(user.googleTokenExpiry.getTime() - bufferMs);
}

export async function refreshUserToken(
  userId: string
): Promise<TokenRefreshResult> {
  const tokens = await getDecryptedTokens(userId);
  if (!tokens) throw new Error("No tokens found for user");

  const { google } = await import("googleapis");
  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: tokens.refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials.access_token || !credentials.expiry_date) {
      throw new Error("Failed to refresh token");
    }

    const newTokens: GoogleTokens = {
      accessToken: credentials.access_token,
      refreshToken: tokens.refreshToken,
      expiry: new Date(credentials.expiry_date),
    };
    await storeEncryptedTokens(userId, newTokens);

    return { accessToken: newTokens.accessToken, expiry: newTokens.expiry };
  } catch {
    await disableSync(userId);
    throw new Error(
      "Failed to refresh token. Please reconnect Google Calendar."
    );
  }
}

export async function getValidAccessToken(userId: string): Promise<string> {
  if (await isTokenExpired(userId)) {
    const result = await refreshUserToken(userId);
    return result.accessToken;
  }
  const tokens = await getDecryptedTokens(userId);
  if (!tokens) throw new Error("No tokens available");
  return tokens.accessToken;
}

export async function disableSync(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { googleCalendarSyncEnabled: false },
  });
}

export async function disconnectGoogleCalendar(userId: string): Promise<void> {
  await db.user.update({
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
  await db.user
    .update({
      where: { id: userId },
      data: { googleCalendarLastSync: new Date() },
    })
    .catch(() => {});
}
