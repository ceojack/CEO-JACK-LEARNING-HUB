"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { AuthRequestTimeoutError, withAuthRequestTimeout } from "@/src/utils/supabase/request-timeout";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";
const primaryButtonClass = "flex min-h-12 w-full items-center justify-center rounded-xl bg-violet-700 px-4 font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-60";

function RecoveryShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.2),_transparent_55%)]" aria-hidden="true" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-9">
        <Link href="/" className="mb-7 inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-violet-600">
          <span className="grid size-11 place-items-center rounded-xl bg-violet-700 text-sm font-extrabold tracking-wide text-white">CJ</span>
          <span className="leading-tight"><strong className="block text-sm font-bold tracking-wide text-slate-900">CEO JACK</strong><span className="text-xs font-medium tracking-[0.16em] text-slate-500">LEARNING HUB</span></span>
        </Link>
        <div>{children}</div>
      </section>
    </main>
  );
}

function getResetRedirectUrl() {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");
  const [resendNotice, setResendNotice] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function sendResetLink(event?: FormEvent<HTMLFormElement>, isResend = false) {
    event?.preventDefault();
    setError("");
    setResendNotice("");
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isSupabaseConfigured()) {
      setError("Password reset is unavailable right now. Please try again later.");
      return;
    }
    setSending(true);
    try {
      const { error: requestError } = await withAuthRequestTimeout(
        createClient().auth.resetPasswordForEmail(normalizedEmail, { redirectTo: getResetRedirectUrl() }),
      );
      if (requestError) throw requestError;
      setSent(true);
      setSecondsLeft(60);
      if (isResend) setResendNotice("Reset link resent! Check your inbox and spam.");
    } catch (caught) {
      setError(caught instanceof AuthRequestTimeoutError ? "The request took too long. Check your connection and try again." : caught instanceof Error ? caught.message : "We couldn’t send the reset link. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <RecoveryShell>
      {!sent ? <>
        <span className="text-xs font-bold tracking-[0.16em] text-violet-700">ACCOUNT SECURITY · STEP 1 OF 2</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Reset Your Password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter the email address on your account. We’ll email you a secure, one-time reset link.</p>
        <form className="mt-7 space-y-5" onSubmit={(event) => void sendResetLink(event)} noValidate>
          <label htmlFor="reset-email" className="block text-sm font-semibold text-slate-800">Email address
            <input id="reset-email" className={inputClass} type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          <button className={primaryButtonClass} type="submit" disabled={sending}>{sending ? "Sending..." : "Send Reset Link"}</button>
        </form>
      </> : <div className="mt-2" role="status">
        <span className="text-xs font-bold tracking-[0.16em] text-emerald-700">STEP 1 COMPLETE</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Check your email</h1>
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <p>If an account exists for <strong className="break-all">{email.trim()}</strong>, a password reset link is on its way. Check your inbox and spam folder.</p>
        </div>
        <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
          <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">1</span><span>Open the reset email in this browser and tap its secure link.</span></li>
          <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">2</span><span>Choose and confirm your new password on the next screen.</span></li>
        </ol>
        {resendNotice ? <p className="mt-4 text-sm font-medium text-emerald-700" role="status">{resendNotice}</p> : null}
        <button type="button" className="mt-6 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={sending || secondsLeft > 0} onClick={() => void sendResetLink(undefined, true)}>{sending ? "Sending..." : secondsLeft > 0 ? `Resend in ${secondsLeft}s...` : "Resend Reset Link"}</button>
        <button type="button" className="mt-3 min-h-10 w-full text-sm font-semibold text-violet-700 hover:text-violet-900" onClick={() => { setSent(false); setSecondsLeft(0); setResendNotice(""); setError(""); }}>Use a different email</button>
      </div>}
      {error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm leading-6 text-rose-700" role="alert">{error}</p> : null}
      <p className="mt-6 text-center text-sm text-slate-600"><Link className="font-semibold text-violet-700 hover:text-violet-900" href="/login">Back to login</Link></p>
    </RecoveryShell>
  );
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [linkReady, setLinkReady] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");
  const [resendNotice, setResendNotice] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const providerError = params.get("error_description") ?? params.get("error");
        if (providerError) throw new Error("This reset link is invalid or has expired. Request a new one below.");
        // The shared Supabase browser client processes PKCE codes during initialization.
        // Recovery links are routed through /auth/callback so the code is exchanged once
        // on the server before this page loads.
        const { data, error: userError } = await createClient().auth.getUser();
        if (userError) throw userError;
        if (!active) return;
        if (data.user) {
          setEmail(data.user.email ?? "");
          setLinkReady(true);
        } else {
          setError("This reset link is invalid or has expired. Request a new one below.");
        }
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "This reset link is invalid or has expired. Request a new one below.");
      } finally {
        if (active) setCheckingLink(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function resendResetLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResendNotice("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the email address for your account to request another reset link.");
      return;
    }
    setSending(true);
    try {
      const { error: requestError } = await withAuthRequestTimeout(createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: getResetRedirectUrl() }));
      if (requestError) throw requestError;
      setSecondsLeft(60);
      setResendNotice("Reset link resent! Check your inbox and spam.");
    } catch (caught) {
      setError(caught instanceof AuthRequestTimeoutError ? "The request took too long. Check your connection and try again." : caught instanceof Error ? caught.message : "We couldn’t send the reset link. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!isSupabaseConfigured()) {
      setError("Password updates are unavailable right now. Please try again later.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: updateError } = await withAuthRequestTimeout(createClient().auth.updateUser({ password }));
      if (updateError) throw updateError;
      if (data.user?.id) {
        // Profile tracking is best-effort: a missing row must not block a successful password reset.
        await createClient().from("profiles").update({ password_last_changed_at: new Date().toISOString() }).eq("id", data.user.id);
      }
      setSuccess(true);
    } catch (caught) {
      setError(caught instanceof AuthRequestTimeoutError ? "The request took too long. Check your connection and try again." : caught instanceof Error && /session|token|expired/i.test(caught.message) ? "This reset link has expired or was already used. Request a new reset link and try again." : caught instanceof Error ? caught.message : "We couldn’t update your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RecoveryShell>
      {success ? (
        <div className="py-4 text-center" role="status">
          <div className="success-check mx-auto grid size-24 place-items-center rounded-full bg-emerald-100 text-5xl font-bold text-emerald-600" aria-hidden="true">✓</div>
          <h1 className="mt-6 text-3xl font-bold text-slate-950">Success</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">Your password has been changed successfully.</p>
          <Link href="/login" className={`${primaryButtonClass} mt-7`}>Go to Login</Link>
        </div>
      ) : (
        <>
          <span className="text-xs font-bold tracking-[0.16em] text-violet-700">ACCOUNT SECURITY</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{checkingLink || linkReady ? "Choose a new password" : "This reset link can’t be used"}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{checkingLink || linkReady ? "Use at least 8 characters for your new password." : "The secure link may have expired or already been used. Request a fresh link below."}</p>
          {checkingLink ? <div className="mt-7 flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600" role="status"><span className="size-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-700" /> Verifying your reset link…</div> : null}
          {!checkingLink && linkReady ? <form className="mt-7 space-y-5" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <label htmlFor="new-password" className="block text-sm font-semibold text-slate-800">New Password
              <input id="new-password" className={inputClass} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
            </label>
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-800">Confirm New Password
              <input id="confirm-password" className={inputClass} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} />
            </label>
            <button className={primaryButtonClass} type="submit" disabled={submitting}>{submitting ? "Updating password…" : "Change Password"}</button>
          </form> : null}
          {error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm leading-6 text-rose-700" role="alert">{error}</p> : null}
          {!checkingLink && !linkReady ? <form className="mt-5 space-y-3" onSubmit={(event) => void resendResetLink(event)}>
            <label htmlFor="resend-email" className="block text-sm font-semibold text-slate-800">Email address
              <input id="resend-email" className={inputClass} type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </label>
            <button className="min-h-11 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={sending || secondsLeft > 0}>{sending ? "Sending…" : secondsLeft > 0 ? `Resend in ${secondsLeft}s...` : "Resend Reset Link"}</button>
          </form> : null}
          {linkReady ? <form className="mt-6 border-t border-slate-200 pt-5" onSubmit={(event) => void resendResetLink(event)}>
            <label htmlFor="resend-email" className="block text-xs font-medium text-slate-500">Need another reset link? Confirm your email below.
              <input id="resend-email" className={inputClass} type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <button type="submit" className="mt-3 min-h-11 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={sending || secondsLeft > 0}>{sending ? "Sending…" : secondsLeft > 0 ? `Resend in ${secondsLeft}s...` : "Resend Reset Link"}</button>
          </form> : null}
          {resendNotice ? <p className="mt-3 text-sm text-emerald-700" role="status">{resendNotice}</p> : null}
          <p className="mt-6 text-center text-sm text-slate-600"><Link className="font-semibold text-violet-700 hover:text-violet-900" href="/login">Back to login</Link></p>
        </>
      )}
      <style jsx>{`@keyframes success-pop { 0% { transform: scale(.5); opacity: 0 } 70% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1); opacity: 1 } } .success-check { animation: success-pop .45s ease-out both } @media (prefers-reduced-motion: reduce) { .success-check { animation: none } }`}</style>
    </RecoveryShell>
  );
}
