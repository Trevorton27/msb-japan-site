"use client";

import Link from "next/link";
import { useSignedIn } from "./use-signed-in";

export function AdminLink({
  label,
  className,
  onClick,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  const signedIn = useSignedIn();

  if (!signedIn) return null;

  return (
    <Link href="/admin" className={className} onClick={onClick}>
      {label}
    </Link>
  );
}
