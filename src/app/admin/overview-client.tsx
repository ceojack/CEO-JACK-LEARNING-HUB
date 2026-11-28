"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LiveDuration } from "@/src/components/active-time";

type AdminUser = { id: string; full_name: string | null; email: string | null; role: string | null; created_at: string | null };
type OverviewData = {
  totals: { learners: number; admins: number; users: number; courses: number; enrollments: number; coursesAvailable: boolean; enrollmentsAvailable: boolean };
  recentUsers: AdminUser[];
  userGrowth: { label: string; count: number }[];
};
const cardStyle = "rounded-2xl border border-white/[.08] bg-[#10182a]/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,.12)]";
const buttonStyle = "inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[.04] px-3 text-xs font-semibold text-slate-200 transition hover:border-indigo-300/30 hover:bg-indigo-400/10 hover:text-white";

function dateLabel(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function AdminOverview({ adminName }: { adminName: string }) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [activeTime, setActiveTime] = useState<{ activeLearners: number; activeAdmins: number; todaySeconds: number; syncedAt: number } | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [changing, setChanging] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [response, usersResponse, activityResponse] = await Promise.all([
        fetch("/api/admin/overview", { cache: "no-store" }),
        fetch("/api/admin/users/manage", { cache: "no-store" }),
        fetch("/api/admin/activity/summary", { cache: "no-store" }),
      ]);
      const [result, usersResult, activityResult] = await Promise.all([response.json(), usersResponse.json(), activityResponse.ok ? activityResponse.json() : Promise.resolve(null)]) as [OverviewData & { error?: string }, { users?: AdminUser[]; error?: string }, { activeLearners: number; activeAdmins: number; todaySeconds: number } | null];
      if (!response.ok) throw new Error(result.error || "Failed to load, tap to retry");
      if (!usersResponse.ok) throw new Error(usersResult.error || "Users could not be loaded, tap to retry");
      setData(result);
      setAllUsers(usersResult.users ?? []);
      setActiveTime(activityResult ? { ...activityResult, syncedAt: Date.now() } : null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load, tap to retry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      void fetch("/api/admin/activity/summary", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((result) => { if (result) setActiveTime({ ...result, syncedAt: Date.now() }); }).catch(() => {});
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const maxGrowth = useMemo(() => Math.max(1, ...(data?.userGrowth.map((point) => point.count) ?? [])), [data]);
  const filteredUsers = useMemo(() => allUsers.filter((user) => `${user.full_name ?? ""} ${user.email ?? ""}`.toLowerCase().includes(userSearch.toLowerCase())), [allUsers, userSearch]);
  const cards = [
    { label: "Total learners", key: "learners", icon: "♙", tint: "text-indigo-200" },
    { label: "Total admins", key: "admins", icon: "◆", tint: "text-violet-200" },
    { label: "Total users", key: "users", icon: "◉", tint: "text-sky-200" },
    { label: "Total courses", key: "courses", icon: "▤", tint: "text-emerald-200" },
    { label: "Enrollments", key: "enrollments", icon: "⇄", tint: "text-amber-200" },
  ] as const;

  async function updateRole(user: AdminUser, role: "admin" | "learner") {
    if (user.role === "admin" && role === "admin") return;
    setChanging(user.id);
    setNotice("");
    try {
      const response = await fetch("/api/admin/users/manage", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, role }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "The user role could not be updated.");
      setNotice("User role updated.");
      await load();
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "The user role could not be updated.");
    } finally { setChanging(""); }
  }

  return <div className="grid gap-7">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-[10px] font-bold tracking-[.18em] text-indigo-300">ADMINISTRATION</p><h1 className="text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">Welcome, {adminName}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A clear view of your learning community, catalog, and activity.</p></div>
      <button className={buttonStyle} onClick={() => void load()} type="button">↻ Refresh overview</button>
    </section>
    <section className={cardStyle}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-base font-semibold text-white">All users</h2><p className="mt-1 text-xs text-slate-500">{allUsers.length} profiles</p></div><input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search name or email" aria-label="Search users" className="h-10 w-full rounded-lg border border-white/10 bg-white/[.035] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-indigo-300/50 sm:max-w-xs" /></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left text-xs"><thead><tr className="border-b border-white/[.07] text-[10px] uppercase tracking-wider text-slate-500"><th className="pb-3 pr-4 font-semibold">Name</th><th className="pb-3 pr-4 font-semibold">Email</th><th className="pb-3 pr-4 font-semibold">Role</th><th className="pb-3 pr-4 font-semibold">Joined</th><th className="pb-3 font-semibold">Role action</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={5} className="py-6 text-slate-500">Loading users…</td></tr> : filteredUsers.map((user) => <tr key={user.id} className="border-b border-white/[.05] last:border-0"><td className="py-4 pr-4 font-semibold text-slate-200">{user.full_name || "Learner"}</td><td className="py-4 pr-4 text-slate-400">{user.email || "—"}</td><td className="py-4 pr-4 capitalize text-slate-300">{user.role || "learner"}</td><td className="py-4 pr-4 text-slate-500">{dateLabel(user.created_at)}</td><td className="py-4">{user.role === "admin" && user.email?.toLowerCase() !== "adminjack1@gmail.com" ? <button type="button" className="font-semibold text-slate-300 hover:text-white disabled:opacity-40" disabled={changing === user.id} onClick={() => void updateRole(user, "learner")}>Make learner</button> : <button type="button" className="font-semibold text-slate-500" disabled title={user.role === "admin" ? "The designated administrator role is protected" : "Only Admin Jack can have the administrator role"}>{user.role === "admin" ? "Protected admin" : "Admin access reserved"}</button>}</td></tr>)}
        {!loading && filteredUsers.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-slate-500">No matching users.</td></tr> : null}
      </tbody></table></div>
    </section>
    {notice ? <p role="status" className="rounded-xl border border-indigo-300/15 bg-indigo-400/[.08] px-4 py-3 text-xs text-indigo-100">{notice}</p> : null}
    {error ? <div className="rounded-2xl border border-rose-300/20 bg-rose-400/[.07] p-5 text-sm text-rose-100"><p className="mb-3">{error}</p><button className={buttonStyle} onClick={() => void load()} type="button">Failed to load, tap to retry</button></div> : null}
    <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-5" aria-label="Platform statistics">
      {cards.map((card) => <article key={card.key} className={`${cardStyle} min-h-[136px]`}><div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-400">{card.label}</p><span className={`grid size-9 place-items-center rounded-xl bg-white/[.045] text-lg ${card.tint}`}>{card.icon}</span></div><p className="mt-4 text-3xl font-semibold tracking-tight text-white">{loading ? <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-white/10" aria-label="Loading" /> : data?.totals[card.key] ?? 0}</p></article>)}
    </section>
    <section className="grid gap-3 sm:grid-cols-2" aria-label="Live active time"><article className={`${cardStyle} flex items-center justify-between`}><div><p className="text-xs font-medium text-slate-400">Active learners · last 2 min</p><p className="mt-2 text-2xl font-semibold text-white">{activeTime?.activeLearners ?? "—"}</p></div><span className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-lg text-emerald-200">●</span></article><article className={`${cardStyle} flex items-center justify-between`}><div><p className="text-xs font-medium text-slate-400">Tracked learning time today (UTC)</p><p className="mt-2 text-2xl font-semibold text-white">{activeTime ? <LiveDuration key={activeTime.syncedAt} seconds={activeTime.todaySeconds} multiplier={activeTime.activeLearners + activeTime.activeAdmins} /> : "—"}</p><p className="mt-1 text-[10px] text-slate-500">Admin time today: {activeTime?.activeAdmins ?? "—"} active admins · live estimate</p></div><span className="grid size-10 place-items-center rounded-xl bg-violet-400/10 text-lg text-violet-200">◷</span></article></section>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,.8fr)]">
      <div className={cardStyle}>
        <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold text-white">Recent signups</h2><p className="mt-1 text-xs text-slate-500">The latest accounts added to the hub</p></div><Link className={buttonStyle} href="/admin/users">View all users</Link></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[610px] border-collapse text-left text-xs"><thead><tr className="border-b border-white/[.07] text-[10px] uppercase tracking-wider text-slate-500"><th className="pb-3 pr-4 font-semibold">Name</th><th className="pb-3 pr-4 font-semibold">Email</th><th className="pb-3 pr-4 font-semibold">Role</th><th className="pb-3 pr-4 font-semibold">Joined</th><th className="pb-3 font-semibold">Action</th></tr></thead><tbody>
          {loading ? Array.from({ length: 4 }, (_, i) => <tr key={i}><td className="py-4 pr-4"><span className="block h-4 w-24 animate-pulse rounded bg-white/10"/></td><td colSpan={4} className="py-4"><span className="block h-4 w-full animate-pulse rounded bg-white/[.05]"/></td></tr>) : null}
          {!loading && data?.recentUsers.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-slate-500">No users have signed up yet.</td></tr> : null}
          {!loading ? data?.recentUsers.map((user) => <tr key={user.id} className="border-b border-white/[.05] last:border-0"><td className="max-w-[160px] truncate py-4 pr-4 font-semibold text-slate-200">{user.full_name || "Learner"}</td><td className="max-w-[180px] truncate py-4 pr-4 text-slate-400">{user.email || "—"}</td><td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${user.role === "admin" ? "bg-violet-400/10 text-violet-200" : "bg-sky-400/10 text-sky-200"}`}>{user.role || "learner"}</span></td><td className="py-4 pr-4 text-slate-500">{dateLabel(user.created_at)}</td><td className="py-4"><button type="button" className="font-semibold text-indigo-200 hover:text-white" onClick={() => setSelected(user)}>View</button><span className="mx-2 text-slate-700">·</span>{user.role === "admin" ? <button type="button" className="font-semibold text-slate-400 hover:text-white disabled:opacity-40" disabled={changing === user.id} onClick={() => void updateRole(user, "learner")}>Make learner</button> : <button type="button" className="font-semibold text-slate-500" disabled title="Only Admin Jack can have the administrator role">Admin only</button>}</td></tr>) : null}
        </tbody></table></div>
      </div>
      <div className={cardStyle}>
        <div className="mb-5"><h2 className="text-base font-semibold text-white">User growth</h2><p className="mt-1 text-xs text-slate-500">New signups by month</p></div>
        <div className="grid h-[178px] grid-cols-6 items-end gap-3" aria-label="User growth chart">
          {(data?.userGrowth ?? Array.from({ length: 6 }, (_, i) => ({ label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i], count: 0 }))).map((point, index) => <div key={`${point.label}-${index}`} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-[9px] text-slate-500">{loading ? "" : point.count}</span><div className="flex h-[128px] w-full items-end rounded-md bg-white/[.025]"><div className="w-full rounded-md bg-gradient-to-t from-indigo-600 to-violet-300 transition-[height] duration-500" style={{ height: `${loading ? 6 : Math.max(6, (point.count / maxGrowth) * 100)}%` }} /></div><span className="text-[9px] text-slate-500">{point.label}</span></div>)}
        </div>
        {!loading && data?.userGrowth.every((point) => point.count === 0) ? <p className="mt-3 text-center text-[10px] text-slate-600">Signup activity will appear here as learners join.</p> : null}
      </div>
    </section>
    <section><div className="mb-3"><h2 className="text-base font-semibold text-white">Quick actions</h2><p className="mt-1 text-xs text-slate-500">Shortcuts to common tasks</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Link className={`${cardStyle} group flex min-h-24 items-center gap-3 transition hover:border-indigo-300/25`} href="/admin/courses?new=1"><span className="grid size-10 place-items-center rounded-xl bg-indigo-400/10 text-lg text-indigo-200">＋</span><span><strong className="block text-xs text-white">Add new course</strong><small className="mt-1 block text-[10px] text-slate-500">Create a catalog entry</small></span></Link><Link className={`${cardStyle} flex min-h-24 items-center gap-3 transition hover:border-indigo-300/25`} href="/admin/users?invite=1"><span className="grid size-10 place-items-center rounded-xl bg-sky-400/10 text-lg text-sky-200">♙</span><span><strong className="block text-xs text-white">Add new user</strong><small className="mt-1 block text-[10px] text-slate-500">Send an account invitation</small></span></Link><Link className={`${cardStyle} flex min-h-24 items-center gap-3 transition hover:border-indigo-300/25`} href="/admin/users"><span className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-lg text-emerald-200">◉</span><span><strong className="block text-xs text-white">View all users</strong><small className="mt-1 block text-[10px] text-slate-500">Search and manage profiles</small></span></Link><Link className={`${cardStyle} flex min-h-24 items-center gap-3 transition hover:border-indigo-300/25`} href="/admin/courses"><span className="grid size-10 place-items-center rounded-xl bg-amber-300/10 text-lg text-amber-100">▤</span><span><strong className="block text-xs text-white">Manage courses</strong><small className="mt-1 block text-[10px] text-slate-500">Review the learning catalog</small></span></Link></div></section>
    {selected ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-labelledby="user-details-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10182a] p-6 shadow-2xl"><div className="mb-5 flex items-start justify-between"><div><p className="text-[9px] font-bold tracking-widest text-indigo-300">USER PROFILE</p><h2 id="user-details-title" className="mt-2 text-xl font-semibold">{selected.full_name || "Learner"}</h2></div><button className={buttonStyle} onClick={() => setSelected(null)} type="button" aria-label="Close user details">×</button></div><dl className="grid gap-3 text-xs"><div><dt className="text-slate-500">Email</dt><dd className="mt-1 break-all text-slate-200">{selected.email || "—"}</dd></div><div><dt className="text-slate-500">Role</dt><dd className="mt-1 capitalize text-slate-200">{selected.role || "learner"}</dd></div><div><dt className="text-slate-500">Joined</dt><dd className="mt-1 text-slate-200">{dateLabel(selected.created_at)}</dd></div><div><dt className="text-slate-500">Profile ID</dt><dd className="mt-1 break-all font-mono text-[10px] text-slate-500">{selected.id}</dd></div></dl></section></div> : null}
  </div>;
}
