"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";

type Profile = { full_name: string | null; email: string; role: string };
type Settings = {
  site: string;
  email: string;
  description: string;
  currency: "USD" | "CAD" | "GBP" | "EUR";
  defaultCategory: string;
  defaultStatus: "draft" | "published";
  retentionMonths: "12" | "24" | "36" | "0";
  alerts: { signups: boolean; enrollments: boolean; payments: boolean };
};
type AuditEvent = { id: string; action: string; target_type: string; target_id: string | null; details: Record<string, unknown>; created_at: string };
const defaults: Settings = {
  site: "CEO JACK Learning Hub",
  email: "info@ceojacklearninghub.com",
  description: "Practical learning for future-ready skills.",
  currency: "USD",
  defaultCategory: "",
  defaultStatus: "draft",
  retentionMonths: "24",
  alerts: { signups: true, enrollments: true, payments: false },
};
const input = "w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-400";
const panel = "space-y-5 rounded-2xl border border-white/10 bg-[#10182a] p-5 sm:p-7";
const primary = "rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400";
const secondary = "rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/[.04]";

function csvValue(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(name: string, headers: string[], rows: unknown[][]) {
  const content = [headers, ...rows].map((row) => row.map(csvValue).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SettingsClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [settings, setSettings] = useState(defaults);
  const [notice, setNotice] = useState("");
  const [health, setHealth] = useState<"unknown" | "checking" | "connected" | "degraded">("unknown");
  const [healthCheckedAt, setHealthCheckedAt] = useState("");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [activityError, setActivityError] = useState("");
  const [exporting, setExporting] = useState("");

  async function checkHealth() {
    setHealth("checking");
    try {
      const response = await fetch("/api/admin/health", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Health check failed");
      setHealth(result.database);
      setHealthCheckedAt(result.checkedAt);
    } catch {
      setHealth("degraded");
    }
  }

  async function loadActivity() {
    setActivityError("");
    try {
      const response = await fetch("/api/admin/activity", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load activity history");
      setEvents(result.events ?? []);
    } catch (cause) {
      setActivityError(cause instanceof Error ? cause.message : "Could not load activity history");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem("ceojack-admin-settings");
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<Settings>;
          setSettings({ ...defaults, ...parsed, alerts: { ...defaults.alerts, ...parsed.alerts } });
        }
      } catch { /* Ignore invalid browser preferences. */ }
      void checkHealth();
      void loadActivity();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem("ceojack-admin-settings", JSON.stringify(settings));
      setNotice("Settings saved in this browser.");
    } catch {
      setNotice("Settings could not be saved in this browser.");
    }
  }

  async function exportData(kind: "users" | "enrollments") {
    setExporting(kind);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/${kind === "users" ? "users/manage" : "enrollments"}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Could not export ${kind}`);
      if (kind === "users") {
        const users = result.users ?? [];
        downloadCsv("ceo-jack-users.csv", ["Name", "Email", "Role", "Joined"], users.map((user: { full_name: string | null; email: string; role: string; created_at: string }) => [user.full_name, user.email, user.role, user.created_at]));
      } else {
        const rows = result.rows ?? [];
        downloadCsv("ceo-jack-enrollments.csv", ["Learner", "Email", "Course", "Enrolled"], rows.map((row: { profile?: { full_name: string | null; email: string } | null; course?: { title: string } | null; enrolled_at: string }) => [row.profile?.full_name, row.profile?.email, row.course?.title, row.enrolled_at]));
      }
      setNotice(`${kind === "users" ? "User" : "Enrollment"} CSV exported.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : `Could not export ${kind}`);
    } finally {
      setExporting("");
    }
  }

  async function logoutAll() {
    if (!window.confirm("Sign out this account from all active sessions? You will need to sign in again.")) return;
    const { error } = await createClient().auth.signOut({ scope: "global" });
    if (error) { setNotice("Could not sign out all sessions. Please try again."); return; }
    router.replace("/login");
  }

  function clearLocalSettings() {
    localStorage.removeItem("ceojack-admin-settings");
    setSettings(defaults);
    setNotice("Local preferences cleared and restored to defaults.");
  }

  return <section className="mx-auto max-w-5xl space-y-6 text-white">
    <header><p className="text-sm text-indigo-300">Workspace</p><h1 className="mt-1 text-3xl font-bold">Admin settings</h1><p className="mt-2 text-sm text-slate-400">Manage platform preferences, security, and operations.</p></header>
    {notice && <p role="status" className="rounded-xl border border-indigo-300/15 bg-indigo-400/[.08] px-4 py-3 text-sm text-indigo-100">{notice}</p>}

    <form onSubmit={save} className={panel}>
      <div><h2 className="text-lg font-semibold">Site details</h2><p className="mt-1 text-sm text-slate-400">Saved in this browser for now; these values do not yet update public site content.</p></div>
      <label className="block space-y-2 text-sm text-slate-300">Site name<input className={input} value={settings.site} onChange={(event) => update("site", event.target.value)} required /></label>
      <label className="block space-y-2 text-sm text-slate-300">Support email<input className={input} type="email" value={settings.email} onChange={(event) => update("email", event.target.value)} required /></label>
      <label className="block space-y-2 text-sm text-slate-300">Site description<textarea className={input} rows={3} value={settings.description} onChange={(event) => update("description", event.target.value)} /></label>
      <button className={primary}>Save site details</button>
    </form>

    <form onSubmit={save} className={panel}>
      <div><h2 className="text-lg font-semibold">Course defaults</h2><p className="mt-1 text-sm text-slate-400">Used as starting values when you create a course.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">Default category<input className={input} value={settings.defaultCategory} onChange={(event) => update("defaultCategory", event.target.value)} placeholder="For example: Digital Skills" /></label>
        <label className="space-y-2 text-sm text-slate-300">Default status<select className={input} value={settings.defaultStatus} onChange={(event) => update("defaultStatus", event.target.value as Settings["defaultStatus"])}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label className="space-y-2 text-sm text-slate-300">Currency<select className={input} value={settings.currency} onChange={(event) => update("currency", event.target.value as Settings["currency"])}>{["USD", "CAD", "GBP", "EUR"].map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      </div>
      <p className="text-xs text-slate-500">Currency is a display preference; payment processing is not connected.</p>
      <button className={primary}>Save course defaults</button>
    </form>

    <section className={panel}>
      <div><h2 className="text-lg font-semibold">Notifications</h2><p className="mt-1 text-sm text-slate-400">These preferences are stored in this browser. Email delivery is not configured here.</p></div>
      {([ ["signups", "New learner signups"], ["enrollments", "Course enrollments"], ["payments", "Payment events"] ] as const).map(([key, label]) => <label key={key} className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-white/[.06] px-4 text-sm text-slate-200"><span>{label}</span><input type="checkbox" className="size-5 accent-indigo-400" checked={settings.alerts[key]} onChange={(event) => update("alerts", { ...settings.alerts, [key]: event.target.checked })} /></label>)}
      <button type="button" className={primary} onClick={() => { try { localStorage.setItem("ceojack-admin-settings", JSON.stringify(settings)); setNotice("Notification preferences saved in this browser."); } catch { setNotice("Could not save notification preferences."); } }}>Save notification preferences</button>
    </section>

    <section className={panel}>
      <div><h2 className="text-lg font-semibold">Account security</h2><p className="mt-1 text-sm text-slate-400">Administrator sign-in requires authenticator MFA.</p></div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[.05] p-4"><span className="text-sm">Admin MFA</span><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Required</span></div>
      <p className="text-sm text-slate-400">{profile.full_name || "Admin Jack"} · {profile.email} · {profile.role}</p>
      <button type="button" onClick={() => void logoutAll()} className="w-fit rounded-xl border border-red-400/25 px-4 py-2.5 text-sm text-red-200">Sign out all sessions</button>
    </section>

    <section className={panel}>
      <div><h2 className="text-lg font-semibold">Payments</h2><p className="mt-1 text-sm text-slate-400">No payment provider integration was found in the app, so payment controls are not active.</p></div>
      <div className="flex items-center justify-between rounded-xl border border-white/[.06] p-4"><span className="text-sm text-slate-300">Provider connection</span><span className="text-xs text-amber-200">Not configured</span></div>
      <p className="text-xs text-slate-500">Configure and verify a payment provider before accepting payments. Do not enter secret keys in this dashboard.</p>
    </section>

    <section className={panel}>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-semibold">Data exports</h2><p className="mt-1 text-sm text-slate-400">Download administrative CSV copies for reporting.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={!!exporting} onClick={() => void exportData("users")} className={secondary}>{exporting === "users" ? "Exporting…" : "Export users CSV"}</button><button type="button" disabled={!!exporting} onClick={() => void exportData("enrollments")} className={secondary}>{exporting === "enrollments" ? "Exporting…" : "Export enrollments CSV"}</button></div></div>
      <p className="text-xs text-slate-500">Exports include profile and enrollment information. Store downloaded files securely.</p>
      <label className="block max-w-sm space-y-2 text-sm text-slate-300">Retention policy preference<select className={input} value={settings.retentionMonths} onChange={(event) => update("retentionMonths", event.target.value as Settings["retentionMonths"])}><option value="12">Review inactive accounts after 12 months</option><option value="24">Review inactive accounts after 24 months</option><option value="36">Review inactive accounts after 36 months</option><option value="0">No review reminder</option></select></label>
      <button type="button" className={secondary} onClick={() => { try { localStorage.setItem("ceojack-admin-settings", JSON.stringify(settings)); setNotice("Data management preferences saved in this browser."); } catch { setNotice("Could not save data management preferences."); } }}>Save data preferences</button>
      <p className="text-xs text-slate-500">This is a review reminder preference only. It does not automatically delete accounts. Individual profile deletion remains available from Manage Users with confirmation.</p>
    </section>

    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Admin activity log</h2><p className="mt-1 text-sm text-slate-400">Recent user and course management actions.</p></div><button type="button" className={secondary} onClick={() => void loadActivity()}>Refresh</button></div>
      {activityError ? <p className="text-sm text-amber-200">{activityError}</p> : events.length === 0 ? <p className="text-sm text-slate-500">No admin actions recorded yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="text-xs uppercase text-slate-500"><th className="pb-3 pr-4">Action</th><th className="pb-3 pr-4">Target</th><th className="pb-3">When</th></tr></thead><tbody className="divide-y divide-white/[.06]">{events.map((item) => <tr key={item.id}><td className="py-3 pr-4 text-slate-200">{item.action.replaceAll("_", " ").replaceAll(".", " · ")}</td><td className="py-3 pr-4 text-slate-400">{item.target_type}{item.target_id ? ` · ${item.target_id.slice(0, 8)}` : ""}</td><td className="py-3 text-slate-500">{new Date(item.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>}
    </section>

    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Database health</h2><p className="mt-1 text-sm text-slate-400">Checks admin access to profiles, courses, and enrollments.</p></div><button type="button" className={secondary} onClick={() => void checkHealth()}>{health === "checking" ? "Checking…" : "Check connection"}</button></div>
      <p role="status" className={`text-sm ${health === "connected" ? "text-emerald-200" : health === "degraded" ? "text-amber-200" : "text-slate-400"}`}>Status: {health === "unknown" ? "Not checked" : health === "checking" ? "Checking" : health === "connected" ? "Connected" : "Degraded or unavailable"}{healthCheckedAt ? ` · ${new Date(healthCheckedAt).toLocaleString()}` : ""}</p>
    </section>

    <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[.04] p-5 sm:p-7"><h2 className="font-semibold text-amber-100">Maintenance</h2><p className="mt-2 text-sm text-slate-400">Clear only the locally saved admin preferences and restore their defaults.</p><button type="button" className="mt-4 rounded-xl border border-white/10 px-4 py-2.5 text-sm" onClick={clearLocalSettings}>Clear local preferences</button></section>
  </section>;
}
