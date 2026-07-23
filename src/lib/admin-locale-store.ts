/** Tiny shared store so client components react instantly to locale changes. */

type Listener = () => void;

let current: "ja" | "en" =
  typeof document !== "undefined"
    ? ((document.cookie.match(/(?:^|; )admin-locale=([^;]*)/)?.[1] as "ja" | "en") || "ja")
    : "ja";

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function getAdminLocaleSnapshot(): "ja" | "en" {
  return current;
}

export function getAdminLocaleServerSnapshot(): "ja" | "en" {
  return "ja";
}

export function subscribeAdminLocale(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAdminLocale(next: "ja" | "en") {
  current = next;
  document.cookie = `admin-locale=${next};path=/;max-age=31536000;samesite=lax`;
  emit();
}
