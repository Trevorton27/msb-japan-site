import type { Metadata } from "next";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin - MSB Japan",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <header className="border-b bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-semibold">
              MSB Japan Admin
            </Link>
            <Link
              href="/ja"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              View Site
            </Link>
          </div>
        </header>
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
