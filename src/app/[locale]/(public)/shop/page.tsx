import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPublishedProducts } from "@/server/queries/products";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: `${dict.common?.shop} — MSB Japan`,
    description:
      locale === "ja"
        ? "マンガラ・シュリー・ブーティ・ジャパンのオンラインショップ"
        : "Mangala Shri Bhuti Japan Online Shop",
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const products = await getPublishedProducts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.common?.shop}
      </h1>

      {products.length === 0 ? (
        <p className="mt-8 text-charcoal-500">
          {locale === "ja"
            ? "現在販売中の商品はありません。"
            : "No products available at this time."}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const slug =
              locale === "en" && product.slugEn ? product.slugEn : product.slugJa;
            const name =
              locale === "en" && product.nameEn ? product.nameEn : product.nameJa;
            const description =
              locale === "en" && product.descriptionEn
                ? product.descriptionEn
                : product.descriptionJa;
            const prices = product.variants.map((v) => v.priceAmount);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            return (
              <Link key={product.id} href={`/${locale}/shop/${slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={name}
                      className="h-48 w-full rounded-t-lg object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    {description && (
                      <CardDescription className="line-clamp-2">
                        {description}
                      </CardDescription>
                    )}
                    <p className="mt-2 font-mono text-sm font-medium text-burgundy-600">
                      {minPrice === maxPrice
                        ? `¥${minPrice.toLocaleString()}`
                        : `¥${minPrice.toLocaleString()} – ¥${maxPrice.toLocaleString()}`}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
