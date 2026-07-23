import { notFound } from "next/navigation";
import { getOrderById } from "@/server/queries/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, locale] = await Promise.all([getOrderById(id), getAdminLocale()]);
  if (!order) notFound();
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{l.orders}</h1>
        <Badge variant="outline" className="text-sm">{order.status}</Badge>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{l.orderInfo}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-gray-500">{l.email}:</span>{" "}
              <span className="font-medium">{order.email}</span>
            </div>
            <div>
              <span className="text-gray-500">{l.date}:</span>{" "}
              <span>{order.createdAt.toLocaleString(dateFmt)}</span>
            </div>
            {order.shippingName && (
              <div>
                <span className="text-gray-500">{l.shippingName}:</span>{" "}
                <span>{order.shippingName}</span>
              </div>
            )}
            {order.shippingAddress && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">{l.shippingAddress}:</span>{" "}
                <span className="whitespace-pre-wrap">{order.shippingAddress}</span>
              </div>
            )}
            {order.notes && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">{l.notes}:</span>{" "}
                <span>{order.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{l.orderItems}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">{l.product}</th>
                  <th className="pb-2 font-medium">{l.variant}</th>
                  <th className="pb-2 text-right font-medium">{l.price}</th>
                  <th className="pb-2 text-right font-medium">{l.qty}</th>
                  <th className="pb-2 text-right font-medium">{l.subtotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">
                      {t(locale, item.variant.product.nameJa, item.variant.product.nameEn)}
                    </td>
                    <td className="py-2 text-gray-600">
                      {t(locale, item.variant.nameJa, item.variant.nameEn)}
                    </td>
                    <td className="py-2 text-right font-mono">¥{item.unitPrice.toLocaleString()}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right font-mono font-medium">
                      ¥{(item.unitPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={4} className="py-2 text-right font-medium">{l.total}</td>
                  <td className="py-2 text-right font-mono font-bold">
                    ¥{order.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{l.actions}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusActions orderId={order.id} currentStatus={order.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
