"use client";

import { useSyncExternalStore } from "react";

type ConsentChoice = "accepted" | "declined";

export function CookieConsent() {
  const visible = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener("ceojack-consent-change", onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("ceojack-consent-change", onChange);
      };
    },
    () => {
      const choice = window.localStorage.getItem("ceojack-ad-consent");
      return choice !== "accepted" && choice !== "declined";
    },
    () => false,
  );

  function choose(choice: ConsentChoice) {
    window.localStorage.setItem("ceojack-ad-consent", choice);
    window.dispatchEvent(new Event("ceojack-consent-change"));
  }

  if (!visible) return null;

  return (
    <aside className="fixed bottom-4 left-1/2 z-[1000] mx-auto flex w-[min(680px,calc(100%-2rem))] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-indigo-300/25 bg-[#10182a] p-4 text-[#f5f7ff] shadow-2xl shadow-black/30 max-[520px]:flex-col max-[520px]:items-stretch" aria-label="Cookie and advertising preferences" role="dialog" aria-live="polite">
      <p className="m-0 text-sm leading-snug">We use cookies and Google ads to keep this site free.</p>
      <div className="flex shrink-0 gap-2 max-[520px]:grid max-[520px]:grid-cols-2">
        <button type="button" className="min-h-10 rounded-lg border border-indigo-300 bg-indigo-200 px-3 text-[13px] font-bold text-slate-950" onClick={() => choose("accepted")}>Accept</button>
        <button type="button" className="min-h-10 rounded-lg border border-white/20 bg-transparent px-3 text-[13px] font-bold text-white" onClick={() => choose("declined")}>Decline</button>
      </div>
    </aside>
  );
}
