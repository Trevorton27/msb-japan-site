import Link from "next/link";
import { getAllOrdersAdmin, getOrderStats } from "@/server/queries/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  PROCESSING: "secondary",
  SHIPPED: "secondary",
  DELIVERED: "default",
  PENDING: "outline",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [orders, stats, locale] = await Promise.all([
    getAllOrdersAdmin({ status: params.status || undefined }),
    getOrderStats(),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <h1 className="text-2xl font-bold">{l.orders}</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.totalOrders}</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.awaitingFulfillment}</CardDescription>
            <CardTitle className="text-2xl">{stats.paid + stats.processing}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.shipped}</CardDescription>
            <CardTitle className="text-2xl">{stats.shipped}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.revenue}</CardDescription>
            <CardTitle className="text-2xl">¥{stats.revenue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6 flex gap-2">
        {["", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              (params.status ?? "") === s
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {s || l.all}
          </Link>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{l.date}</th>
              <th className="px-4 py-3 text-left font-medium">{l.email}</th>
              <th className="px-4 py-3 text-left font-medium">{l.items}</th>
              <th className="px-4 py-3 text-right font-medium">{l.total}</th>
              <th className="px-4 py-3 text-left font-medium">{l.status}</th>
              <th className="px-4 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">{l.noOrders}</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    {order.createdAt.toLocaleDateString(dateFmt)}
                  </td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.items.length} {l.items.toLowerCase()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono">
                    ¥{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[order.status] ?? "secondary"}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                      {l.view}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
