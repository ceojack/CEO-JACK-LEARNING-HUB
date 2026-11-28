"use client";
import { useCallback, useEffect, useState } from "react";

type Row = {
  id: string;
  enrolled_at?: string;
  profile?: { full_name: string | null; email: string } | null;
  course?: { title: string } | null;
  course_title?: string;
  title?: string;
  order_num?: number;
  content?: string | null;
  video_url?: string | null;
};

function Listing({ kind }: { kind: "enrollments" | "content" }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);
  const [query, setQuery] = useState("");
  const load = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/${kind}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to load, tap to retry");
      setRows(result.rows ?? []);
      setMissing(!!result.missing);
      setError(result.error ?? "");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load");
    } finally { setBusy(false); }
  }, [kind]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const filtered = rows.filter((row) => `${row.profile?.full_name ?? ""} ${row.profile?.email ?? ""} ${row.course?.title ?? row.course_title ?? row.title ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const columns = kind === "enrollments" ? ["Learner", "Email", "Course", "Enrolled"] : ["Lesson", "Course", "Order", "Content"];

  return <section className="space-y-6 text-white">
    <header><p className="text-sm text-indigo-300">Learning activity</p><h1 className="mt-1 text-3xl font-bold">{kind === "enrollments" ? "Enrollments" : "Lesson content"}</h1><p className="mt-2 text-sm text-slate-400">{rows.length} {kind}</p></header>
    <input className="w-full rounded-xl border border-white/10 bg-[#10182a] px-4 py-3 text-sm outline-none focus:border-indigo-400 md:max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${kind}`} aria-label={`Search ${kind}`} />
    {busy ? <div className="animate-pulse rounded-2xl bg-[#10182a] p-8 text-slate-400">Loading {kind}…</div> : error ? <button className="rounded-xl border border-red-400/20 p-5 text-red-200" onClick={() => void load()}>{error} · Tap to retry</button> : missing ? <div className="rounded-2xl border border-white/10 bg-[#10182a] p-8 text-slate-300">The {kind} table is not available yet.</div> : <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#10182a]"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-white/[.035] text-xs uppercase text-slate-400"><tr>{columns.map((column) => <th key={column} className="px-5 py-4">{column}</th>)}</tr></thead><tbody className="divide-y divide-white/5">
      {filtered.map((row) => <tr key={row.id}>{kind === "enrollments" ? <><td className="px-5 py-4">{row.profile?.full_name || "—"}</td><td className="px-5 py-4 text-slate-300">{row.profile?.email || "—"}</td><td className="px-5 py-4">{row.course?.title || "Course"}</td><td className="px-5 py-4 text-slate-400">{row.enrolled_at ? new Date(row.enrolled_at).toLocaleDateString() : "—"}</td></> : <><td className="px-5 py-4 font-medium">{row.title}</td><td className="px-5 py-4">{row.course_title}</td><td className="px-5 py-4">{row.order_num}</td><td className="max-w-sm truncate px-5 py-4 text-slate-400">{row.content || row.video_url || "—"}</td></>}</tr>)}
    </tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-slate-400">No {kind} found.</p>}</div>}
  </section>;
}

export function EnrollmentList() { return <Listing kind="enrollments" />; }
