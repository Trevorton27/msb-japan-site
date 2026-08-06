import { getAnalyticsOverview, getAuditLogs } from "@/server/queries/analytics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";
import {
  isVercelAnalyticsConfigured,
  getTotalCounts,
  getDailyTraffic,
  getTopPages,
  getTopReferrers,
  getTopCountries,
  getDeviceTypes,
} from "@/lib/analytics/vercel";
import { CurrentVisitors } from "@/components/admin/current-visitors";

export default async function AdminAnalyticsPage() {
  const locale = await getAdminLocale();
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";
  const vercelConfigured = isVercelAnalyticsConfigured();

  const [analytics, auditLogs, vercelData] = await Promise.all([
    getAnalyticsOverview(30),
    getAuditLogs(30),
    vercelConfigured
      ? Promise.all([
          getTotalCounts(),
          getDailyTraffic(30),
          getTopPages(30, 10),
          getTopReferrers(30, 10),
          getTopCountries(30, 10),
          getDeviceTypes(30),
        ])
      : null,
  ]);

  const [totals, dailyTraffic, topPages, topReferrers, topCountries, devices] =
    vercelData ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold">{l.analyticsAudit}</h1>

      {/* ─── Current Visitors (live) ────────────────────────────────── */}
      <section className="mt-6">
        <CurrentVisitors
          labels={{
            currentVisitors: l.currentVisitors,
            path: l.path,
            lastSeen: l.lastSeen,
            noActiveVisitors: l.noActiveVisitors,
            onlineNow: l.onlineNow,
          }}
        />
      </section>

      {/* ─── Vercel Web Analytics ─────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">{l.webAnalytics}</h2>

        {!vercelConfigured ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {l.vercelNotConfigured}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Totals */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{l.pageViews}</CardDescription>
                  <CardTitle className="text-2xl">
                    {(totals?.pageviews ?? 0).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{l.visitors}</CardDescription>
                  <CardTitle className="text-2xl">
                    {(totals?.visitors ?? 0).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Daily traffic table */}
            {dailyTraffic && dailyTraffic.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">{l.dailyTraffic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">
                            {l.date}
                          </th>
                          <th className="px-3 py-2 text-right font-medium">
                            {l.pageViews}
                          </th>
                          <th className="px-3 py-2 text-right font-medium">
                            {l.visitors}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {dailyTraffic.map((row) => (
                          <tr key={row.date} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-3 py-1.5 text-gray-600 dark:text-gray-400">
                              {new Date(row.date).toLocaleDateString(dateFmt)}
                            </td>
                            <td className="px-3 py-1.5 text-right">
                              {row.pageviews.toLocaleString()}
                            </td>
                            <td className="px-3 py-1.5 text-right">
                              {row.visitors.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {/* Top Pages */}
              {topPages && topPages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.topPages}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topPages.map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate font-mono text-gray-700 dark:text-gray-300">
                            {row.path}
                          </span>
                          <div className="ml-2 flex gap-2">
                            <Badge variant="secondary">
                              {row.pageviews} pv
                            </Badge>
                            <Badge variant="outline">
                              {row.visitors} vis
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Referrers */}
              {topReferrers && topReferrers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.topReferrers}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topReferrers.map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate text-gray-700 dark:text-gray-300">
                            {row.referrer || l.direct}
                          </span>
                          <Badge variant="secondary">{row.visitors} vis</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Countries */}
              {topCountries && topCountries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.topCountries}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topCountries.map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700 dark:text-gray-300">{row.country}</span>
                          <Badge variant="secondary">{row.visitors} vis</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Device Types */}
              {devices && devices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.deviceTypes}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {devices.map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="capitalize text-gray-700 dark:text-gray-300">
                            {row.device}
                          </span>
                          <Badge variant="secondary">{row.visitors} vis</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </section>

      {/* ─── Custom Event Analytics (from DB) ─────────────────────── */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">{l.eventsByType}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{l.pageViews30d}</CardDescription>
              <CardTitle className="text-2xl">
                {analytics.totalPageViews.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{l.totalEvents30d}</CardDescription>
              <CardTitle className="text-2xl">
                {analytics.totalEvents.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{l.eventTypes}</CardDescription>
              <CardTitle className="text-2xl">
                {analytics.eventsByType.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{l.eventsByType}</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.eventsByType.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{l.noEventsRecorded}</p>
              ) : (
                <div className="space-y-2">
                  {analytics.eventsByType.map((item) => (
                    <div
                      key={item.event}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-mono text-gray-700 dark:text-gray-300">
                        {item.event}
                      </span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{l.topPages}</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topPages.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{l.noPageViews}</p>
              ) : (
                <div className="space-y-2">
                  {analytics.topPages.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate font-mono text-gray-700 dark:text-gray-300">
                        {item.path}
                      </span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Audit Log ────────────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">{l.recentAuditLog}</h2>
        <div className="rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{l.time}</th>
                <th className="px-4 py-3 text-left font-medium">{l.user}</th>
                <th className="px-4 py-3 text-left font-medium">{l.action}</th>
                <th className="px-4 py-3 text-left font-medium">{l.entity}</th>
                <th className="px-4 py-3 text-left font-medium">{l.id}</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {auditLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {l.noAuditLogs}
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-400">
                      {log.createdAt.toLocaleString(dateFmt)}
                    </td>
                    <td className="px-4 py-2">
                      {log.user?.name ?? log.user?.email ?? "System"}
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{log.action}</Badge>
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400">
                      {log.entity}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-400">
                      {log.entityId ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
