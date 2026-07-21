import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-charcoal-900">404</h1>
      <p className="mt-4 text-charcoal-600">
        Page not found / ページが見つかりません
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-burgundy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-burgundy-600"
      >
        Home / ホーム
      </Link>
    </div>
  );
}
