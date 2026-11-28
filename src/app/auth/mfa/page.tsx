"use client";

import QRCode from "qrcode";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { isAdminEmail } from "@/src/utils/supabase/admin";

type Factor = { id: string; status: string; friendly_name?: string | null };

function MfaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedNext = params.get("next") ?? "/dashboard";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
  const isSetup = params.get("setup") === "1";
  const [isAdmin, setIsAdmin] = useState(false);
  const [factor, setFactor] = useState<Factor | null>(null);
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.replace("/auth?mode=signin&next=%2Fdashboard");
        return;
      }
      const admin = isAdminEmail(userData.user.email);
      if (!cancelled) setIsAdmin(admin);
      const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const { data: profile } = await supabase.from("profiles").select("mfa_enabled, admin_mfa_enrolled").eq("id", userData.user.id).maybeSingle();
      if (!admin && (!isSetup && !profile?.mfa_enabled)) {
        router.replace(next);
        return;
      }
      if (admin && assurance?.currentLevel === "aal2") {
        router.replace(next);
        return;
      }

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;
      const verified = factorsData.totp.find((item) => item.status === "verified");
      if (verified) {
        if (!cancelled) setFactor(verified);
      } else {
        if (admin && profile?.admin_mfa_enrolled) {
          if (!cancelled) {
            setError("Your required authenticator is no longer enrolled. For security, administrator re-enrollment is locked. Contact the project owner to restore access.");
            setBusy(false);
          }
          return;
        }
        const unverified = factorsData.all.find((item) => item.factor_type === "totp" && item.status === "unverified");
        if (unverified) {
          const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId: unverified.id });
          if (removeError) throw removeError;
        }
        const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "CEO JACK Learning Hub admin" });
        if (enrollError) throw enrollError;
        const image = await QRCode.toDataURL(data.totp.uri);
        if (!cancelled) {
          setFactor({ id: data.id, status: "unverified" });
          setQr(image);
        }
      }
      if (!cancelled) setBusy(false);
    }
    void prepare().catch((cause: unknown) => {
      if (!cancelled) {
        setError(cause instanceof Error ? cause.message : "Could not prepare authenticator setup.");
        setBusy(false);
      }
    });
    return () => { cancelled = true; };
  }, [isSetup, next, router]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factor || code.trim().length !== 6) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challenge.id, code: code.trim() });
      if (verifyError) throw verifyError;
      if (!isAdmin && isSetup) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Sign in again to finish enabling 2-Step Verification.");
        const { error: saveError } = await supabase.from("profiles").update({ mfa_enabled: true }).eq("id", userData.user.id);
        if (saveError) throw saveError;
      }
      if (isAdmin) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Sign in again to finish administrator security setup.");
        const { error: saveError } = await supabase.from("profiles").update({ admin_mfa_enrolled: true }).eq("id", userData.user.id);
        if (saveError) throw saveError;
      }
      router.replace(next);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The code could not be verified. Try again.");
      setSubmitting(false);
    }
  }

  return <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-10 text-slate-100">
    <section className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl sm:p-9" aria-labelledby="mfa-title">
      <p className="text-xs font-bold tracking-[.18em] text-violet-300">ACCOUNT SECURITY</p>
      <h1 id="mfa-title" className="mt-3 text-2xl font-semibold">Connect your authenticator app</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">{isAdmin ? "This extra step is required for the administrator account." : "Verify the code to finish setting up optional 2-Step Verification."}</p>
      {busy ? <p className="mt-6 animate-pulse text-sm text-slate-300" role="status">Preparing secure sign-in…</p> : null}
      {qr ? <div className="mt-6 grid justify-items-center gap-3 rounded-xl bg-white p-4 text-center text-sm text-slate-900">
        <Image src={qr} alt="Authenticator app setup QR code" width={220} height={220} unoptimized />
        <p>Scan this code once, then enter the 6-digit code below to finish setup.</p>
      </div> : null}
      {!busy && factor ? <form className="mt-6 grid gap-3" onSubmit={verify}>
        <label htmlFor="totp-code" className="text-sm font-medium">Authenticator code</label>
        <input id="totp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="min-h-12 rounded-lg border border-white/15 bg-slate-950 px-4 text-lg tracking-[.3em]" aria-describedby={error ? "mfa-error" : undefined} />
        <button type="submit" disabled={submitting} className="mt-2 min-h-12 rounded-lg bg-violet-600 px-4 font-semibold text-white disabled:opacity-60">{submitting ? "Verifying…" : qr ? "Verify and finish setup" : "Verify and continue"}</button>
      </form> : null}
      {error ? <p id="mfa-error" className="mt-4 text-sm text-rose-300" role="alert">{error}</p> : null}
    </section>
  </main>;
}

export default function AdminMfaPage() {
  return <Suspense fallback={<main className="min-h-screen p-8 text-slate-200">Loading secure sign-in…</main>}><MfaForm /></Suspense>;
}
