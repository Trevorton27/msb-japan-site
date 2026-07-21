import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://msbjapan.org";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);

  return {
    title: {
      default: dict.metadata?.title ?? "MSB Japan",
      template: `%s — ${dict.common?.siteNameShort ?? "MSB Japan"}`,
    },
    description: dict.metadata?.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ja: "/ja",
        en: "/en",
      },
    },
    openGraph: {
      title: dict.metadata?.title,
      description: dict.metadata?.description,
      url: `${baseUrl}/${locale}`,
      siteName: dict.common?.siteName,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mangala Shri Bhuti Japan",
    url: `${baseUrl}/${locale}`,
    description:
      locale === "ja"
        ? "チベット仏教の教えと瞑想の実践"
        : "Tibetan Buddhist teachings and meditation practice",
  };

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-ivory-50 text-charcoal-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
