import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/server/queries/products";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const product = await getProductBySlug(slug, locale as "ja" | "en");
  if (!product) return {};
  const name = locale === "en" && product.nameEn ? product.nameEn : product.nameJa;
  return { title: `${name} — MSB Japan` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const product = await getProductBySlug(slug, locale as "ja" | "en");
  if (!product) notFound();

  const dict = await getDictionary(locale as Locale);
  const name = locale === "en" && product.nameEn ? product.nameEn : product.nameJa;
  const description =
    locale === "en" && product.descriptionEn
      ? product.descriptionEn
      : product.descriptionJa;

  const addToCartLabel = locale === "ja" ? "カートに追加" : "Add to Cart";
  const outOfStockLabel = locale === "ja" ? "在庫切れ" : "Out of Stock";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/shop`}
        className="text-sm text-charcoal-500 hover:text-charcoal-900"
      >
        &larr; {dict.common?.shop}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={name}
            className="w-full rounded-lg object-cover"
          />
        )}

        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">{name}</h1>

          {description && (
            <p className="mt-4 whitespace-pre-wrap text-charcoal-600">
              {description}
            </p>
          )}

          <div className="mt-8 space-y-4">
            <h2 className="text-sm font-semibold text-charcoal-700">
              {locale === "ja" ? "オプション" : "Options"}
            </h2>

            {product.variants.map((variant) => {
              const variantName =
                locale === "en" && variant.nameEn ? variant.nameEn : variant.nameJa;

              return (
                <div
                  key={variant.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium text-charcoal-900">{variantName}</p>
                    <p className="font-mono text-sm text-burgundy-600">
                      ¥{variant.priceAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-charcoal-400">
                      {variant.stockQuantity > 0
                        ? locale === "ja"
                          ? `在庫: ${variant.stockQuantity}`
                          : `In stock: ${variant.stockQuantity}`
                        : outOfStockLabel}
                    </p>
                  </div>
                  <AddToCartButton
                    variantId={variant.id}
                    inStock={variant.stockQuantity > 0}
                    label={addToCartLabel}
                    outOfStockLabel={outOfStockLabel}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Link
              href={`/${locale}/shop/cart`}
              className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700"
            >
              {locale === "ja" ? "カートを見る →" : "View Cart →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
