"use client";

import { useEffect, useRef, useState } from "react";

type ConsentChoice = "accepted" | "declined";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & { requestNonPersonalizedAds?: number };
  }
}

export function AdSenseSlot({ label }: { label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const readConsent = () => {
      const choice = window.localStorage.getItem("ceojack-ad-consent");
      setConsent(choice === "accepted" || choice === "declined" ? choice : null);
    };
    readConsent();
    window.addEventListener("ceojack-consent-change", readConsent);
    return () => window.removeEventListener("ceojack-consent-change", readConsent);
  }, []);

  useEffect(() => {
    if (!containerRef.current || consent === null) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px 0px" });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [consent]);

  useEffect(() => {
    if (!nearViewport || !consent || !containerRef.current) return;
    const slot = containerRef.current.querySelector("ins.adsbygoogle");
    if (!slot || slot.getAttribute("data-requested") === "true") return;
    slot.setAttribute("data-requested", "true");
    window.adsbygoogle = window.adsbygoogle || [];
    if (consent === "declined") window.adsbygoogle.requestNonPersonalizedAds = 1;
    try {
      window.adsbygoogle.push({});
    } catch {
      slot.removeAttribute("data-requested");
    }
  }, [consent, nearViewport]);

  if (!consent) return null;

  return (
    <div className="adsense-slot" ref={containerRef} aria-label={label}>
      {/* In AdSense, block Gambling, Betting, Dating, Alcohol, Crypto, Weight Loss, and Adult categories. Keep Education, Business, Technology, and Jobs. */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: 0 }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
