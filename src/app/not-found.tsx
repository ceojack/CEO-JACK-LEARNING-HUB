"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/src/components/footer";

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
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_50%_15%,rgba(99,133,255,0.14),transparent_45%),#080d1b] px-[18px] py-9 text-center text-[#f4f6fc] sm:px-6 sm:py-16">
        <div className="w-full max-w-[620px] rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(18,28,48,0.94),rgba(12,19,34,0.96))] p-[clamp(26px,6vw,52px)] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
          <span className="text-[13px] font-extrabold tracking-[0.14em] text-[#b8a5ff]">404 · PAGE NOT FOUND</span>
          <h1 className="mb-3 mt-[18px] text-[clamp(32px,6vw,48px)] leading-[1.1] tracking-[-0.04em]">We can’t find that page.</h1>
          <p className="mx-auto max-w-[480px] text-[17px] leading-[1.7] text-[#b6c0d2]">The link may be outdated, or the page may have moved. Choose where you’d like to go next.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 max-[520px]:flex-col">
            <button type="button" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[11px] border border-white/15 bg-white/5 px-[19px] text-[15px] font-bold text-[#f4f6fc] transition duration-150 hover:-translate-y-0.5 hover:border-[#b8a5ff]/75 hover:bg-[#9b7bff]/15 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#b8a5ff]" onClick={goBack}>← Go back</button>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[11px] border border-[#9b7bff]/50 bg-[linear-gradient(105deg,rgba(99,133,255,0.2),rgba(155,123,255,0.2))] px-[19px] text-[15px] font-bold text-[#f4f6fc] transition duration-150 hover:-translate-y-0.5 hover:border-[#b8a5ff]/75 hover:bg-[#9b7bff]/15 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#b8a5ff]">Go to home <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
