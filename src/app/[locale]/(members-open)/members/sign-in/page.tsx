import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MemberSignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const session = await auth();
  if (session?.user) {
    redirect(`/${locale}/members`);
  }

  const { error } = await searchParams;
  const dict = await getDictionary(locale as Locale);
  const t = dict.members.signIn;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-burgundy-500">
            {dict.members.nav.portal}
          </p>
          <h1 className="text-2xl font-semibold text-charcoal-900">{t.title}</h1>
          <p className="mt-2 text-sm text-charcoal-500">{t.subtitle}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-center text-sm text-red-700">
            {error === "CredentialsSignin" ? t.error : t.accessDenied}
          </div>
        )}

        {/* Credentials form */}
        <form
          action={async (formData: FormData) => {
            "use server";
            try {
              await signIn("credentials", {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                redirectTo: `/${locale}/members`,
              });
            } catch (err) {
              if (err instanceof AuthError) {
                redirect(`/${locale}/members/sign-in?error=${err.type}`);
              }
              throw err;
            }
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-charcoal-700"
            >
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-charcoal-200 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-burgundy-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-charcoal-700"
            >
              {t.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-charcoal-200 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-burgundy-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-burgundy-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
          >
            {t.signIn}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-charcoal-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-ivory-50 px-2 text-charcoal-400">or</span>
          </div>
        </div>

        {/* Google sign-in */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: `/${locale}/members` });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md border border-charcoal-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-700 transition-colors hover:bg-charcoal-200/30"
          >
            {t.signInWithGoogle}
          </button>
        </form>

        {/* Contact link */}
        <p className="mt-8 text-center text-xs text-charcoal-400">
          <a
            href={`/${locale}/contact`}
            className="underline underline-offset-2 hover:text-charcoal-700"
          >
            {dict.members.unauthorized.contact}
          </a>
        </p>
      </div>
    </div>
  );
}
