import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const [
    eventCount,
    contactCount,
    contentCount,
    donationCount,
    orderCount,
    socialPostCount,
  ] = await Promise.all([
    db.event.count(),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.contentPost.count(),
    db.donation.count({ where: { status: "COMPLETED" } }),
    db.order.count({ where: { status: { in: ["PAID", "PROCESSING"] } } }),
    db.socialPost.count({ where: { status: "draft" } }),
  ]);

  const cards = [
    { label: "Events", count: eventCount, href: "/admin/events" },
    { label: "New Messages", count: contactCount, href: "/admin/contacts" },
    { label: "Content Posts", count: contentCount, href: "/admin/content" },
    { label: "Donations (Completed)", count: donationCount, href: "/admin/donations" },
    { label: "Orders (Pending)", count: orderCount, href: "/admin/orders" },
    { label: "Social Drafts", count: socialPostCount, href: "/admin/social" },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-gray-600">
        Welcome, {session.user.name ?? session.user.email}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl">{card.count}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
