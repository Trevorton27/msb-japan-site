"use client";

import { useEffect, useState } from "react";

// Checked in the browser rather than with auth() on the server: reading the
// session cookie during render would make every public page dynamic. The
// request is shared so several header widgets don't each fetch the session.
let sessionRequest: Promise<boolean> | null = null;

function fetchSignedIn(): Promise<boolean> {
  sessionRequest ??= fetch("/api/auth/session")
    .then((res) => (res.ok ? res.json() : null))
    .then((session) => Boolean(session?.user))
    .catch(() => false);
  return sessionRequest;
}

export function useSignedIn(): boolean {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSignedIn().then((value) => {
      if (!cancelled) setSignedIn(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return signedIn;
}
