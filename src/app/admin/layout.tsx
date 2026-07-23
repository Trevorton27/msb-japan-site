import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminLocaleToggle } from "@/components/admin/admin-locale-toggle";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export const metadata: Metadata = {
  title: "Admin - MSB Japan",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const locale = await getAdminLocale();
  const l = getLabels(locale);

  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <header className="border-b bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-semibold">
              MSB Japan Admin
            </Link>
            <div className="flex items-center gap-3">
              {isLoggedIn && <AdminLocaleToggle />}
              <Link
                href="/ja"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {l.viewSite}
              </Link>
            </div>
          </div>
        </header>
        {isLoggedIn ? (
          <div className="flex flex-1">
            <AdminSidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        ) : (
          <main className="flex flex-1 items-center justify-center p-6">
            {children}
          </main>
        )}
      </body>
    </html>
  );
}
