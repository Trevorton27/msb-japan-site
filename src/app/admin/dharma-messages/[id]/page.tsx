import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getDharmaMessageByIdAdmin } from "@/server/queries/dharma-messages";
import { DharmaMessageForm } from "@/components/admin/dharma-message-form";

export default async function AdminEditDharmaMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const { id } = await params;
  const message = await getDharmaMessageByIdAdmin(id);
  if (!message) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Dharma Message</h1>
      <DharmaMessageForm
        initialData={{
          id: message.id,
          quoteJa: message.quoteJa,
          quoteEn: message.quoteEn ?? undefined,
          attributionJa: message.attributionJa,
          attributionEn: message.attributionEn ?? undefined,
          sourceJa: message.sourceJa ?? undefined,
          sourceEn: message.sourceEn ?? undefined,
          sortOrder: message.sortOrder,
          published: message.published,
        }}
      />
    </div>
  );
}
