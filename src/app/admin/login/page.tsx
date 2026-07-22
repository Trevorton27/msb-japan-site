import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the admin dashboard.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {error === "CredentialsSignin"
              ? "Invalid email or password."
              : "Access denied. Your account may not be approved."}
          </p>
        )}

        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email") as string,
              password: formData.get("password") as string,
              redirectTo: "/admin",
            });
          }}
          className="space-y-3"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="block w-full rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">or</span>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="block w-full rounded-md border px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
