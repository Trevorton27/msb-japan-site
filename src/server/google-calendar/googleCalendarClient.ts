import { google, calendar_v3 } from "googleapis";

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

export class GoogleCalendarAuthError extends GoogleCalendarError {
  constructor(message: string = "Google Calendar authentication failed") {
    super(message, 401);
    this.name = "GoogleCalendarAuthError";
  }
}

export class GoogleCalendarRateLimitError extends GoogleCalendarError {
  constructor(
    message: string = "Rate limit exceeded",
    public retryAfter?: number
  ) {
    super(message, 429);
    this.name = "GoogleCalendarRateLimitError";
  }
}

export class GoogleCalendarNotFoundError extends GoogleCalendarError {
  constructor(message: string = "Calendar event not found") {
    super(message, 404);
    this.name = "GoogleCalendarNotFoundError";
  }
}

export class GoogleCalendarClient {
  private oauth2Client: InstanceType<typeof google.auth.OAuth2>;
  private calendar: calendar_v3.Calendar;

  constructor(accessToken: string, refreshToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.calendar = google.calendar({ version: "v3", auth: this.oauth2Client });
  }

  async createEvent(
    calendarId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
      });
      if (!response.data) throw new GoogleCalendarError("No data returned");
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error, "create event");
    }
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
      });
      if (!response.data) throw new GoogleCalendarError("No data returned");
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error, "update event");
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({ calendarId, eventId });
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      if (status === 404 || status === 410) return;
      return this.handleError(error, "delete event");
    }
  }

  async listEvents(
    calendarId: string,
    options?: {
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
      singleEvents?: boolean;
      orderBy?: string;
    }
  ): Promise<calendar_v3.Schema$Event[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: options?.timeMin,
        timeMax: options?.timeMax,
        maxResults: options?.maxResults || 250,
        singleEvents: options?.singleEvents !== false,
        orderBy: options?.orderBy || "startTime",
      });
      return response.data.items || [];
    } catch (error: unknown) {
      return this.handleError(error, "list events");
    }
  }

  private handleError(error: unknown, operation: string): never {
    const err = error as {
      response?: { status?: number; headers?: Record<string, string> };
      code?: string | number;
      message?: string;
    };
    const status = err.response?.status || err.code;
    const message = err.message || "Unknown error";

    switch (status) {
      case 401:
      case "UNAUTHENTICATED":
        throw new GoogleCalendarAuthError(`Auth failed: ${operation}`);
      case 403:
        if (
          message.includes("rate") ||
          message.includes("quota") ||
          message.includes("limit")
        ) {
          throw new GoogleCalendarRateLimitError(
            `Rate limit: ${operation}`,
            Number(err.response?.headers?.["retry-after"]) || undefined
          );
        }
        throw new GoogleCalendarError(
          `Permission denied: ${operation}`,
          403
        );
      case 404:
      case 410:
        throw new GoogleCalendarNotFoundError(`Not found: ${operation}`);
      default:
        throw new GoogleCalendarError(
          `Failed to ${operation}: ${message}`,
          typeof status === "number" ? status : undefined
        );
    }
  }
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error as Error;
      if (
        error instanceof GoogleCalendarRateLimitError ||
        (error instanceof GoogleCalendarError &&
          error.statusCode &&
          error.statusCode >= 500)
      ) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error("Max retries exceeded");
}

export function createGoogleCalendarClient(
  accessToken: string,
  refreshToken: string
): GoogleCalendarClient {
  return new GoogleCalendarClient(accessToken, refreshToken);
}
