import { getAllDonationsAdmin, getDonationStats } from "@/server/queries/donations";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DonationFilters } from "@/components/admin/donation-filters";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  COMPLETED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [donations, stats, locale] = await Promise.all([
    getAllDonationsAdmin({
      status: params.status || undefined,
      recurring: params.type === "recurring" ? true : params.type === "one-time" ? false : undefined,
    }),
    getDonationStats(),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <h1 className="text-2xl font-bold">{l.donations}</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.totalDonations}</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.completed}</CardDescription>
            <CardTitle className="text-2xl">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.activeRecurring}</CardDescription>
            <CardTitle className="text-2xl">{stats.recurring}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{l.totalAmount}</CardDescription>
            <CardTitle className="text-2xl">¥{stats.totalAmount.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6">
        <DonationFilters />
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{l.date}</th>
              <th className="px-4 py-3 text-left font-medium">{l.donor}</th>
              <th className="px-4 py-3 text-left font-medium">{l.email}</th>
              <th className="px-4 py-3 text-right font-medium">{l.amount}</th>
              <th className="px-4 py-3 text-left font-medium">{l.donationType}</th>
              <th className="px-4 py-3 text-left font-medium">{l.status}</th>
              <th className="px-4 py-3 text-left font-medium">{l.message}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">{l.noDonations}</td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    {donation.createdAt.toLocaleDateString(dateFmt)}
                  </td>
                  <td className="px-4 py-3">{donation.donorName ?? "—"}</td>
                  <td className="px-4 py-3">{donation.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono">
                    ¥{donation.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {donation.recurring ? l.monthly : l.oneTime}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[donation.status] ?? "secondary"}>
                      {donation.status}
                    </Badge>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-gray-500">
                    {donation.message ?? "—"}
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
