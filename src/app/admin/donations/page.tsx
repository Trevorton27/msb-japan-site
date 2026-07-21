import { getAllDonationsAdmin, getDonationStats } from "@/server/queries/donations";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DonationFilters } from "@/components/admin/donation-filters";

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
  const status = params.status;
  const type = params.type;

  const [donations, stats] = await Promise.all([
    getAllDonationsAdmin({
      status: status || undefined,
      recurring: type === "recurring" ? true : type === "one-time" ? false : undefined,
    }),
    getDonationStats(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Donations</h1>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Donations</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Recurring</CardDescription>
            <CardTitle className="text-2xl">{stats.recurring}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-2xl">
              ¥{stats.totalAmount.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <DonationFilters />
      </div>

      {/* Donations table */}
      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Donor</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No donations found.
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    {donation.createdAt.toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3">{donation.donorName ?? "—"}</td>
                  <td className="px-4 py-3">{donation.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono">
                    ¥{donation.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {donation.recurring ? "Monthly" : "One-time"}
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
