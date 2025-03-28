"use client";

import Link from "next/link";
import { useUser } from "@/app/contexts/UserProvider";

export default async function HeaderAuth() {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) return null;

  return (
    <Link className="rounded-sm" href="/sign-in">
      Sign in
    </Link>
  );
}
