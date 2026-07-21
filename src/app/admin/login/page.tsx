import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the admin dashboard.
          </p>
        </div>
        <Link
          href="/api/auth/signin"
          className="block w-full rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
