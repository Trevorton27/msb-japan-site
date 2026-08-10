import { notFound, redirect } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { MemberNav } from "@/components/members/member-nav";

export default async function MembersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/members/sign-in`);
  }

  if (!user.permissions.includes(PERMISSIONS.MEMBER_CONTENT)) {
    redirect(`/${locale}/members/unauthorized`);
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <div className="flex min-h-screen flex-col">
      <MemberNav locale={locale as Locale} dict={dict} user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
