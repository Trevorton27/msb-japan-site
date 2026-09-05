import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";
import { GoogleCalendarSettings } from "@/components/admin/google-calendar-settings";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Members without admin roles go to the member dashboard
  const roles = session.user.roles ?? [];
  if (roles.length === 1 && roles[0] === "Member") {
    redirect("/ja/members");
  }

  const [
    eventCount,
    contactCount,
    contentCount,
    donationCount,
    orderCount,
    socialPostCount,
    locale,
  ] = await Promise.all([
    db.event.count(),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.contentPost.count(),
    db.donation.count({ where: { status: "COMPLETED" } }),
    db.order.count({ where: { status: { in: ["PAID", "PROCESSING"] } } }),
    db.socialPost.count({ where: { status: "draft" } }),
    getAdminLocale(),
  ]);

  const l = getLabels(locale);

  const cards = [
    { label: l.events, count: eventCount, href: "/admin/events" },
    { label: l.newMessages, count: contactCount, href: "/admin/contacts" },
    { label: l.contentPosts, count: contentCount, href: "/admin/content" },
    { label: l.donationsCompleted, count: donationCount, href: "/admin/donations" },
    { label: l.ordersPending, count: orderCount, href: "/admin/orders" },
    { label: l.socialDrafts, count: socialPostCount, href: "/admin/social" },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">{l.dashboard}</h1>
      <p className="mb-6 text-gray-600">
        {l.welcome}, {session.user.name ?? session.user.email}
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

      <div className="mt-8">
        <GoogleCalendarSettings
          returnTo="/admin"
          labels={
            locale === "ja"
              ? {
                  title: "Google カレンダー連携",
                  connected: "Google カレンダーに接続済み",
                  notConnected: "未接続",
                  connectDescription:
                    "Google カレンダーを接続して、イベントを自動同期します。",
                  connect: "Google カレンダーを接続",
                  disconnect: "切断",
                  disconnecting: "切断中...",
                  syncNow: "今すぐ同期",
                  syncing: "同期中...",
                  lastSync: "最終同期",
                  syncComplete: "同期完了",
                  total: "合計",
                  created: "作成",
                  updated: "更新",
                  failed: "失敗",
                  disconnectConfirm: "Google カレンダーを切断しますか？",
                  removeEventsOption: "同期済みイベントも削除",
                }
              : {
                  title: "Google Calendar",
                  connected: "Connected to Google Calendar",
                  notConnected: "Not connected",
                  connectDescription:
                    "Connect your Google Calendar to automatically sync events.",
                  connect: "Connect Google Calendar",
                  disconnect: "Disconnect",
                  disconnecting: "Disconnecting...",
                  syncNow: "Sync Now",
                  syncing: "Syncing...",
                  lastSync: "Last sync",
                  syncComplete: "Sync Complete",
                  total: "Total",
                  created: "Created",
                  updated: "Updated",
                  failed: "Failed",
                  disconnectConfirm: "Disconnect Google Calendar?",
                  removeEventsOption: "Also remove synced events",
                }
          }
        />
      </div>
    </div>
  );
}
