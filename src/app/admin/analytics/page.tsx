import { getAnalyticsOverview, getAuditLogs } from "@/server/queries/analytics";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminAnalyticsPage() {
  const [analytics, auditLogs] = await Promise.all([
    getAnalyticsOverview(30),
    getAuditLogs(30),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics & Audit</h1>

      {/* Overview cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Page Views (30d)</CardDescription>
            <CardTitle className="text-2xl">
              {analytics.totalPageViews.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events (30d)</CardDescription>
            <CardTitle className="text-2xl">
              {analytics.totalEvents.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Event Types</CardDescription>
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
            <CardTitle className="text-lg">Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.eventsByType.length === 0 ? (
              <p className="text-sm text-gray-500">No events recorded yet.</p>
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
            <CardTitle className="text-lg">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topPages.length === 0 ? (
              <p className="text-sm text-gray-500">No page views recorded yet.</p>
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
        <h2 className="mb-4 text-lg font-semibold">Recent Audit Log</h2>
        <div className="rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Entity</th>
                <th className="px-4 py-3 text-left font-medium">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {auditLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No audit log entries yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                      {log.createdAt.toLocaleString("ja-JP")}
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
