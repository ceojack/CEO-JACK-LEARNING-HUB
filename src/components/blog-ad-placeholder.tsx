"use client";

import { useEffect, useRef, useState } from "react";

type BlogAdPlacement = "list" | "article";
type ConsentChoice = "accepted" | "declined";
type AdSenseQueue = unknown[] & { requestNonPersonalizedAds?: 0 | 1 };

declare global {
  interface Window {
    adsbygoogle?: AdSenseQueue;
  }
}

const publisherId = "ca-pub-3891995236976645";
const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_BLOG_SLOT_ID?.trim() || "6109291858";

// In AdSense, block Gambling, Betting, Dating, Alcohol, Crypto, Weight Loss, and Adult categories.
// Keep Education, Business, Technology, and Jobs enabled.

export function BlogAdPlaceholder({ placement }: { placement: BlogAdPlacement }) {
  const adRef = useRef<HTMLElement>(null);
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const readChoice = () => {
      const choice = window.localStorage.getItem("ceojack-ad-consent");
      setConsent(choice === "accepted" || choice === "declined" ? choice : null);
    };

    readChoice();
    window.addEventListener("ceojack-consent-change", readChoice);
    return () => window.removeEventListener("ceojack-consent-change", readChoice);
  }, []);

  useEffect(() => {
    if (!adSlotId || !consent || requested || !adRef.current) return;

    const requestAd = () => {
      if (requested) return;
      const queue = window.adsbygoogle ?? (window.adsbygoogle = []);
      queue.requestNonPersonalizedAds = consent === "declined" ? 1 : 0;
      queue.push({});
      setRequested(true);
    };

    if (typeof IntersectionObserver === "undefined") {
      requestAd();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        requestAd();
      }
    }, { rootMargin: "250px 0px" });

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [consent, requested]);

  return (
    <aside className={`blog-ad-placeholder blog-ad-placeholder-${placement}`} aria-label="Advertisement">
      <span className="blog-ad-placeholder-label">ADVERTISEMENT</span>
      {adSlotId && consent ? (
        <ins
          ref={adRef}
          className="adsbygoogle blog-ad-unit"
          style={{ display: "block" }}
          data-ad-client={publisherId}
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="blog-ad-placeholder-copy">
          <strong>{adSlotId ? "Ad available after your advertising choice" : "Responsive ad space reserved"}</strong>
          <small>{adSlotId ? "Use the cookie banner to choose your ad preference." : "Add your AdSense responsive display ad unit ID to NEXT_PUBLIC_ADSENSE_BLOG_SLOT_ID to serve ads here."}</small>
        </div>
      )}
    </aside>
  );
}
