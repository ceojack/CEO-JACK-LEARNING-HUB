"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/src/components/footer";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import "@/src/styles/auth.css";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setStatusType("error");
      setStatus("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setStatusType("error");
      setStatus("Your passwords do not match.");
      return;
    }
    if (!isSupabaseConfigured()) {
      setStatusType("error");
      setStatus("Password updates are unavailable right now. Please contact support@ceojacklearninghub.com.");
      return;
    }

    setSubmitting(true);
    setStatusType("");
    setStatus("Updating your password…");
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      setStatusType("success");
      setStatus("Password updated. Taking you to your learning dashboard…");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setStatusType("error");
      setStatus(error instanceof Error && /session|token|expired/i.test(error.message)
        ? "This reset link has expired or was already used. Request a new password reset link and try again."
        : error instanceof Error ? error.message : "We couldn’t update your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="background" aria-hidden="true"><div className="grid" /><div className="glow glow-one" /><div className="glow glow-two" /></div>
      <header className="topbar">
        <Link href="/" className="logo" aria-label="CEO JACK Learning Hub home"><span className="logo-text"><strong>CEO JACK</strong><small>LEARNING HUB</small></span></Link>
        <Link href="/auth?mode=signin" className="back-link"><span aria-hidden="true">←</span> Back to sign in</Link>
      </header>
      <main className="auth-page">
        <section className="auth-section" aria-label="Set a new password">
          <div className="auth-card">
            <div className="auth-header"><div><span className="auth-label">ACCOUNT SECURITY</span><h1>Choose a new password</h1><p>Use at least 8 characters you have not used here before.</p></div></div>
            <form noValidate onSubmit={handleSubmit}>
              <div className="form-panel-heading"><span aria-hidden="true">✦</span><div><strong>Password update form</strong><small>Enter and confirm your new password.</small></div></div>
              <div className="form-group"><label htmlFor="new-password">New password</label><input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
              <div className="form-group"><label htmlFor="confirm-new-password">Confirm new password</label><input id="confirm-new-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
              <button type="submit" className="submit-btn" disabled={submitting}><span>{submitting ? "Please wait…" : "Update password"}</span><span aria-hidden="true">→</span></button>
              <p className={`form-status ${statusType}`} role="status">{status}</p>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
