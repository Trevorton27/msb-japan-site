"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Checked in the browser rather than with auth() on the server: reading the
// session cookie during render would make every public page dynamic.
export function AdminLink() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((session) => {
        if (!cancelled) setSignedIn(Boolean(session?.user));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!signedIn) return null;

  return (
    <Link
      href="/admin"
      className="rounded-md border border-charcoal-300 px-3 py-2 text-xs font-medium text-charcoal-600 transition-colors hover:bg-charcoal-100"
    >
      Admin Dashboard
    </Link>
  );
}
