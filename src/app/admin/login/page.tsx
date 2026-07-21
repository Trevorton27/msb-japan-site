import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the admin dashboard.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="block w-full rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign in with Google
          </button>
        </form>
        {process.env.NODE_ENV === "development" && <DevLoginForm />}
      </div>
    </div>
  );
}

function DevLoginForm() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        await signIn("credentials", {
          email: formData.get("email") as string,
          redirectTo: "/admin",
        });
      }}
      className="space-y-3 border-t pt-4"
    >
      <p className="text-xs font-medium text-gray-400">Dev Login</p>
      <input
        name="email"
        type="email"
        defaultValue="admin@msbjapan.org"
        placeholder="Email"
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-500"
      >
        Dev Sign In
      </button>
    </form>
  );
}
