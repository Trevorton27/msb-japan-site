import { notFound } from "next/navigation";
import { getOrderById } from "@/server/queries/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderStatusActions } from "@/components/admin/order-status-actions";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Badge variant="outline" className="text-sm">
          {order.status}
        </Badge>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              <span className="font-medium">{order.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>{" "}
              <span>{order.createdAt.toLocaleString("ja-JP")}</span>
            </div>
            {order.shippingName && (
              <div>
                <span className="text-gray-500">Shipping Name:</span>{" "}
                <span>{order.shippingName}</span>
              </div>
            )}
            {order.shippingAddress && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Shipping Address:</span>{" "}
                <span className="whitespace-pre-wrap">{order.shippingAddress}</span>
              </div>
            )}
            {order.notes && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Notes:</span>{" "}
                <span>{order.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">Variant</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                  <th className="pb-2 text-right font-medium">Qty</th>
                  <th className="pb-2 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.variant.product.nameJa}</td>
                    <td className="py-2 text-gray-600">{item.variant.nameJa}</td>
                    <td className="py-2 text-right font-mono">
                      ¥{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right font-mono font-medium">
                      ¥{(item.unitPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={4} className="py-2 text-right font-medium">
                    Total
                  </td>
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
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusActions orderId={order.id} currentStatus={order.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
