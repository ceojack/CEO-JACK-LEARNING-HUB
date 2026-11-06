"use client";

import { useEffect, useState } from "react";

type ConsentChoice = "accepted" | "declined";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = window.localStorage.getItem("ceojack-ad-consent");
    if (choice !== "accepted" && choice !== "declined") setVisible(true);
  }, []);

  function choose(choice: ConsentChoice) {
    window.localStorage.setItem("ceojack-ad-consent", choice);
    window.dispatchEvent(new Event("ceojack-consent-change"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-consent" aria-label="Cookie and advertising preferences" role="dialog" aria-live="polite">
      <p>We use cookies and Google ads to keep this site free.</p>
      <div>
        <button type="button" onClick={() => choose("accepted")}>Accept</button>
        <button type="button" className="cookie-consent-decline" onClick={() => choose("declined")}>Decline</button>
      </div>
    </aside>
  );
}
