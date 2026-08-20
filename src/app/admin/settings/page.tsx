import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";
import { GoogleCalendarSettings } from "@/components/admin/google-calendar-settings";

export default async function AdminSettingsPage() {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  const locale = await getAdminLocale();
  const l = getLabels(locale);

  const calendarLabels =
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
          disconnectConfirm:
            "Google カレンダーを切断しますか？",
          removeEventsOption: "同期済みイベントも削除",
        }
      : {
          title: "Google Calendar Integration",
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
        };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{l.settings}</h1>
      <GoogleCalendarSettings labels={calendarLabels} />
    </div>
  );
}
