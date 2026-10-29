"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/src/components/footer";
import "@/src/styles/not-found.css";

export default function NotFound() {
  const router = useRouter();

  function goBack() {
    const referrer = document.referrer;
    const hasSameSiteHistory = window.history.length > 1 && referrer && (() => {
      try {
        return new URL(referrer).origin === window.location.origin;
      } catch {
        return false;
      }
    })();

    if (hasSameSiteHistory) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <>
      <main className="not-found-page">
        <div className="not-found-card">
          <span className="not-found-code">404 · PAGE NOT FOUND</span>
          <h1>We can’t find that page.</h1>
          <p>The link may be outdated, or the page may have moved. Choose where you’d like to go next.</p>
          <div className="not-found-actions">
            <button type="button" className="not-found-back" onClick={goBack}>← Go back</button>
            <Link href="/" className="not-found-home">Go to home <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
