"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const query = new URLSearchParams(params.toString());
    query.set("mode", "signin");
    router.replace(`/auth?${query.toString()}`);
  }, [params, router]);

  return <p>Opening sign in…</p>;
}

export default function LoginPage() {
  return <Suspense fallback={<p>Opening sign in…</p>}><LoginRedirect /></Suspense>;
}
