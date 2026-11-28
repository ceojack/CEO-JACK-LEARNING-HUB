"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { isAdminEmail } from "@/src/utils/supabase/admin";

export function AccountSecurity() {
  const [enabled, setEnabled] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [confirmOff, setConfirmOff] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; email: string | null; full_name: string | null; mfa_enabled: boolean }>>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData.user) throw error ?? new Error("Sign in to manage account security.");
      const isAdmin = isAdminEmail(userData.user.email);
      const { data } = await supabase.from("profiles").select("mfa_enabled").eq("id", userData.user.id).maybeSingle();
      if (!cancelled) {
        setAdmin(isAdmin);
        setEnabled(isAdmin || data?.mfa_enabled === true);
        setLoading(false);
        if (isAdmin) {
          const response = await fetch("/api/admin/users", { cache: "no-store" });
          const result = await response.json() as { users?: typeof users; error?: string };
          if (!response.ok) throw new Error(result.error ?? "Learner accounts could not be loaded.");
          if (!cancelled) setUsers(result.users ?? []);
        }
      }
    }
    void load().catch((error: unknown) => {
      if (!cancelled) {
        setMessage(error instanceof Error ? error.message : "Account security could not be loaded.");
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  async function turnOff() {
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;
      const verified = factors.totp.find((factor) => factor.status === "verified");
      if (verified) {
        const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError) throw assuranceError;
        if (assurance?.currentLevel !== "aal2") {
          if (!code.trim()) {
            setConfirmOff(true);
            setMessage("Enter a current authenticator code to confirm turning off 2-Step Verification.");
            return;
          }
          const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: verified.id });
          if (challengeError) throw challengeError;
          const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: verified.id, challengeId: challenge.id, code: code.trim() });
          if (verifyError) throw verifyError;
        }
      }
      for (const factor of factors.all) {
        const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
        if (error) throw error;
      }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sign in again to update account security.");
      const { error: saveError } = await supabase.from("profiles").update({ mfa_enabled: false }).eq("id", userData.user.id);
      if (saveError) throw saveError;
      setEnabled(false);
      setConfirmOff(false);
      setCode("");
      setMessage("2-Step Verification is off.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "2-Step Verification could not be turned off.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-4" aria-labelledby="account-security-heading">
    <h3 id="account-security-heading" className="font-semibold text-slate-100">Account Security</h3>
    {loading ? <p className="mt-2 animate-pulse text-sm text-slate-300" role="status">Loading security settings…</p> : admin ? <>
      <p className="mt-2 text-sm text-slate-300">2-Step Verification: REQUIRED for the administrator account.</p>
      <Link className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white" href="/auth/mfa?next=%2Fprofile">Manage authenticator</Link>
    </> : <>
      <p className="mt-2 text-sm text-slate-300">2-Step Verification: {enabled ? "ON" : "OFF"}</p>
      {enabled ? <>
        {confirmOff ? <label className="mt-3 grid gap-2 text-sm text-slate-200">Authenticator code<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="min-h-11 rounded-lg border border-white/15 bg-slate-950 px-3 tracking-[.25em]" /></label> : null}
        <button type="button" onClick={() => void turnOff()} disabled={busy} className="mt-3 min-h-10 rounded-lg border border-white/15 px-4 text-sm font-semibold text-slate-100 disabled:opacity-60">{busy ? "Turning off…" : confirmOff ? "Confirm and turn off" : "Turn off 2-Step Verification"}</button>
      </> : <Link className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white" href="/auth/mfa?setup=1&next=%2Fprofile">Enable 2-Step Verification (Optional)</Link>}
    </>}
    {admin ? <div className="mt-5 border-t border-white/10 pt-4">
      <h4 className="font-semibold text-slate-100">Manage Learner 2-Step Verification</h4>
      {users.length ? <ul className="mt-3 grid gap-3">{users.map((learner) => <li key={learner.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
        <span className="min-w-0 text-sm text-slate-200">{learner.full_name || learner.email || "Learner"}<small className="block break-all text-xs text-slate-400">{learner.email}</small></span>
        <button type="button" disabled={busy} onClick={async () => {
          setBusy(true); setMessage("");
          try {
            const response = await fetch("/api/admin/mfa-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: learner.id }) });
            const result = await response.json() as { error?: string };
            if (!response.ok) throw new Error(result.error ?? "Learner MFA could not be reset.");
            setUsers((current) => current.map((item) => item.id === learner.id ? { ...item, mfa_enabled: false } : item));
            setMessage("Learner 2-Step Verification has been turned off.");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Learner MFA could not be reset.");
          } finally { setBusy(false); }
        }} className="min-h-10 rounded-lg border border-white/15 px-3 text-xs font-semibold text-slate-100 disabled:opacity-60">Turn OFF 2FA for this user</button>
      </li>)}</ul> : <p className="mt-2 text-sm text-slate-400">No learner profiles are available.</p>}
    </div> : null}
    {message ? <p className="mt-3 text-sm text-rose-200" role="status">{message}</p> : null}
  </section>;
}
