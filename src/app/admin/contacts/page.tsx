import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getContactMessages } from "@/server/actions/contacts";
import { Badge } from "@/components/ui/badge";
import { ContactStatusActions } from "@/components/admin/contact-status-actions";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  READ: "bg-gray-100 text-gray-700",
  REPLIED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-yellow-100 text-yellow-700",
};

export default async function AdminContactsPage() {
  await requirePermission(PERMISSIONS.CONTACTS_MANAGE);
  const [messages, locale] = await Promise.all([getContactMessages(), getAdminLocale()]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{l.contactMessages}</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{msg.name}</span>
                  <Badge className={statusColors[msg.status] ?? ""} variant="secondary">
                    {msg.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500">{msg.email}</p>
                {msg.subject && <p className="mt-1 text-sm font-medium">{msg.subject}</p>}
              </div>
              <span className="text-xs text-gray-400">
                {msg.createdAt.toLocaleDateString(dateFmt)}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{msg.body}</p>
            <ContactStatusActions id={msg.id} currentStatus={msg.status} />

            {msg.notes.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <h3 className="text-xs font-semibold text-gray-500">{l.notes}</h3>
                {msg.notes.map((note) => (
                  <div key={note.id} className="mt-2 text-sm">
                    <span className="font-medium">
                      {note.author.name ?? note.author.email}:
                    </span>{" "}
                    {note.body}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="py-8 text-center text-gray-500">{l.noContacts}</p>
        )}
      </div>
    </div>
  );
}
