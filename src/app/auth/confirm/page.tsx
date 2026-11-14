"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import "@/src/styles/auth.css";

const pendingEmailKey = "ceojack-pending-confirmation-email";

export default function ConfirmSignupPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setEmail(window.sessionStorage.getItem(pendingEmailKey) ?? "");
  }, []);

  async function resendConfirmation() {
    if (!email || !isSupabaseConfigured() || isResending) return;

    setIsResending(true);
    setStatus("");
    setStatusType("");
    try {
      const { error } = await createClient().auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/onboarding")}`,
        },
      });
      if (error) throw error;
      setStatus("A new confirmation link has been sent. Check your inbox and spam folder.");
      setStatusType("success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We couldn’t resend the link. Please try again.");
      setStatusType("error");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <>
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>
      <header className="topbar">
        <Link href="/" className="logo" aria-label="CEO JACK Learning Hub home">
          <Image src="/assets/images/logo1.webp" alt="" className="logo-image" width={44} height={44} priority />
          <span className="logo-text"><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>
        <Link href="/auth?mode=signin" className="back-link">Already confirmed? Sign in <span aria-hidden="true">→</span></Link>
      </header>
      <main className="auth-confirmation-page">
        <section className="confirmation-card" aria-labelledby="confirmation-title">
          <div className="confirmation-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="5" y="10" width="38" height="28" rx="7" />
              <path d="m8 15 16 12 16-12" />
              <circle cx="37" cy="35" r="8" />
              <path d="m33.5 35 2.4 2.4 4.7-5" />
            </svg>
          </div>
          <p className="confirmation-label">ONE MORE STEP</p>
          <h1 id="confirmation-title">Check your email</h1>
          {email ? (
            <p className="confirmation-copy">We sent a confirmation link to <strong>{email}</strong>.</p>
          ) : (
            <p className="confirmation-copy">Open the confirmation link we sent to the email address you used to create your account.</p>
          )}
          <ol className="confirmation-steps">
            <li><span>1</span><p>Open the message from CEO JACK Learning Hub in your inbox.</p></li>
            <li><span>2</span><p>Select <strong>Confirm your email</strong> to verify your address.</p></li>
            <li><span>3</span><p>We’ll take you to your learning onboarding to set up your profile.</p></li>
          </ol>
          <p className="confirmation-spam-note">Can’t find the email? Check your spam or promotions folder.</p>
          {email ? (
            <button className="confirmation-resend" type="button" onClick={() => void resendConfirmation()} disabled={isResending}>
              {isResending ? "Sending another link…" : "Resend confirmation email"}
            </button>
          ) : (
            <Link className="confirmation-resend" href="/auth">Return to create your account</Link>
          )}
          <p className={`confirmation-status ${statusType}`} role="status" aria-live="polite">{status}</p>
          <Link className="confirmation-signin" href="/auth?mode=signin">Return to sign in</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
