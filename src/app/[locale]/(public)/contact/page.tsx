import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/public/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.contact?.title} — MSB Japan` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.contact?.title}
      </h1>
      <p className="mt-4 text-charcoal-600">
        {locale === "ja"
          ? "ご質問・ご相談がございましたら、以下のフォームよりお気軽にお問い合わせください。"
          : "Please feel free to reach out using the form below."}
      </p>

      <div className="mt-8">
        <ContactForm
          labels={{
            name: dict.contact?.name ?? "Name",
            email: dict.contact?.email ?? "Email",
            subject: dict.contact?.subject ?? "Subject",
            message: dict.contact?.message ?? "Message",
            send: dict.contact?.send ?? "Send",
            success: dict.contact?.success ?? "Sent.",
            error: dict.contact?.error ?? "Failed.",
          }}
        />
      </div>
    </div>
  );
}
