import { getAnalyticsOverview, getAuditLogs } from "@/server/queries/analytics";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminAnalyticsPage() {
  const [analytics, auditLogs, locale] = await Promise.all([
    getAnalyticsOverview(30),
    getAuditLogs(30),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <h1 className="text-2xl font-bold">{l.analyticsAudit}</h1>

      {/* Overview cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Events by type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{l.eventsByType}</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.eventsByType.length === 0 ? (
              <p className="text-sm text-gray-500">{l.noEventsRecorded}</p>
            ) : (
              <div className="space-y-2">
                {analytics.eventsByType.map((item) => (
                  <div
                    key={item.event}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-mono text-gray-700">{item.event}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{l.topPages}</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topPages.length === 0 ? (
              <p className="text-sm text-gray-500">{l.noPageViews}</p>
            ) : (
              <div className="space-y-2">
                {analytics.topPages.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate font-mono text-gray-700">
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

      {/* Audit log */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">{l.recentAuditLog}</h2>
        <div className="rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{l.time}</th>
                <th className="px-4 py-3 text-left font-medium">{l.user}</th>
                <th className="px-4 py-3 text-left font-medium">{l.action}</th>
                <th className="px-4 py-3 text-left font-medium">{l.entity}</th>
                <th className="px-4 py-3 text-left font-medium">{l.id}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {auditLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {l.noAuditLogs}
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                      {log.createdAt.toLocaleString(dateFmt)}
                    </td>
                    <td className="px-4 py-2">
                      {log.user?.name ?? log.user?.email ?? "System"}
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{log.action}</Badge>
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-600">
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
      </div>
    </div>
  );
}
