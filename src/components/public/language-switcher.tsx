"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({
  locale,
  className = "text-sm font-medium text-charcoal-500 transition-colors hover:text-charcoal-900",
  onNavigate,
}: {
  locale: Locale;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const otherLocale: Locale = locale === "ja" ? "en" : "ja";

  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onNavigate?.();
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=31536000`;
    // usePathname() omits the hash and search, so carry them across.
    router.push(switchedPath + window.location.search + window.location.hash);
  }

  return (
    <Link
      href={switchedPath}
      onClick={handleClick}
      className={className}
      aria-label={locale === "ja" ? "Switch to English" : "日本語に切り替え"}
    >
      {locale === "ja" ? "English" : "日本語"}
    </Link>
  );
}
