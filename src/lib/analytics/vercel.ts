const API_BASE = "https://api.vercel.com/v1/query/web-analytics";

function getConfig() {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId || !teamId) return null;

  return { token, projectId, teamId };
}

async function query(
  endpoint: string,
  params: Record<string, string>,
): Promise<unknown> {
  const config = getConfig();
  if (!config) return null;

  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set("projectId", config.projectId);
  url.searchParams.set("teamId", config.teamId);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${config.token}` },
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!res.ok) {
    console.error(`Vercel Analytics API error: ${res.status} ${res.statusText}`);
    return null;
  }

  return res.json();
}

interface CountResponse {
  data: { pageviews: number; visitors: number };
}

interface AggregateRow {
  timestamp?: string;
  key?: string;
  // dimension values are dynamic keys
  [dimension: string]: string | number | undefined;
  pageviews: number;
  visitors: number;
}

interface AggregateResponse {
  data: AggregateRow[];
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]!;
}

export async function getTotalCounts() {
  const result = (await query("visits/count", {})) as CountResponse | null;
  return result?.data ?? { pageviews: 0, visitors: 0 };
}

export async function getDailyTraffic(days: number = 30) {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = (await query("visits/aggregate", {
    since: formatDate(since),
    until: formatDate(until),
    by: "day",
  })) as AggregateResponse | null;

  return (
    result?.data?.map((row) => ({
      date: row.timestamp ?? "",
      pageviews: row.pageviews,
      visitors: row.visitors,
    })) ?? []
  );
}

export async function getTopPages(days: number = 30, limit: number = 10) {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = (await query("visits/aggregate", {
    since: formatDate(since),
    until: formatDate(until),
    by: "requestPath",
    limit: String(limit),
  })) as AggregateResponse | null;

  return (
    result?.data?.map((row) => ({
      path: (row.requestPath as string) ?? row.key ?? "",
      pageviews: row.pageviews,
      visitors: row.visitors,
    })) ?? []
  );
}

export async function getTopReferrers(days: number = 30, limit: number = 10) {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = (await query("visits/aggregate", {
    since: formatDate(since),
    until: formatDate(until),
    by: "referrerHostname",
    limit: String(limit),
  })) as AggregateResponse | null;

  return (
    result?.data?.map((row) => ({
      referrer: (row.referrerHostname as string) ?? row.key ?? "(direct)",
      pageviews: row.pageviews,
      visitors: row.visitors,
    })) ?? []
  );
}

export async function getTopCountries(days: number = 30, limit: number = 10) {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = (await query("visits/aggregate", {
    since: formatDate(since),
    until: formatDate(until),
    by: "country",
    limit: String(limit),
  })) as AggregateResponse | null;

  return (
    result?.data?.map((row) => ({
      country: (row.country as string) ?? row.key ?? "Unknown",
      pageviews: row.pageviews,
      visitors: row.visitors,
    })) ?? []
  );
}

export async function getDeviceTypes(days: number = 30) {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = (await query("visits/aggregate", {
    since: formatDate(since),
    until: formatDate(until),
    by: "deviceType",
  })) as AggregateResponse | null;

  return (
    result?.data?.map((row) => ({
      device: (row.deviceType as string) ?? row.key ?? "Unknown",
      pageviews: row.pageviews,
      visitors: row.visitors,
    })) ?? []
  );
}

export function isVercelAnalyticsConfigured(): boolean {
  return getConfig() !== null;
}
