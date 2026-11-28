"use client";

import { useEffect, useRef, useState } from "react";

function duration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours ? `${hours}:${pad(minutes)}:${pad(remainingSeconds)}` : `${pad(minutes)}:${pad(remainingSeconds)}`;
}

export function LiveDuration({ seconds, multiplier = 1 }: { seconds: number; multiplier?: number }) {
  const [elapsed, setElapsed] = useState(0);
  const lastInteraction = useRef(0);

  useEffect(() => {
    lastInteraction.current = Date.now();
    const touch = () => { lastInteraction.current = Date.now(); };
    const visibilityChanged = () => { if (document.visibilityState === "visible") touch(); };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, touch, { passive: true }));
    window.addEventListener("focus", touch);
    document.addEventListener("visibilitychange", visibilityChanged);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - lastInteraction.current <= 60_000) {
        setElapsed((value) => value + multiplier);
      }
    }, 1000);
    return () => {
      window.clearInterval(timer);
      events.forEach((event) => window.removeEventListener(event, touch));
      window.removeEventListener("focus", touch);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [multiplier]);

  return <>{duration(seconds + elapsed)}</>;
}

export function ActiveTimeTracker({ userId }: { userId: string }) {
  const lastInteraction = useRef(0);

  useEffect(() => {
    let stopped = false;
    lastInteraction.current = Date.now();
    const touch = () => { lastInteraction.current = Date.now(); };
    const heartbeat = async () => {
      if (stopped || document.visibilityState !== "visible" || Date.now() - lastInteraction.current > 60_000) return;
      try {
        await fetch("/api/activity/heartbeat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ timezoneOffset: new Date().getTimezoneOffset() }), cache: "no-store", keepalive: true });
      } catch { /* A later heartbeat will retry. */ }
    };
    const resume = () => { touch(); void heartbeat(); };
    const visibilityChanged = () => { if (document.visibilityState === "visible") resume(); };
    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, touch, { passive: true }));
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("focus", resume);
    const timer = window.setInterval(() => void heartbeat(), 30_000);
    void heartbeat();
    return () => {
      stopped = true;
      window.clearInterval(timer);
      activityEvents.forEach((event) => window.removeEventListener(event, touch));
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("focus", resume);
    };
  }, [userId]);

  return null;
}

export function LearnerActiveTimeCard() {
  const [summary, setSummary] = useState<{ todaySeconds: number; totalSeconds: number; syncedAt: number } | null>(null);

  useEffect(() => {
    let stopped = false;
    const load = async () => {
      try {
        const response = await fetch(`/api/activity/summary?timezoneOffset=${new Date().getTimezoneOffset()}`, { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json();
        if (!stopped) setSummary({ ...result, syncedAt: Date.now() });
      } catch { /* Keep the dashboard available when activity stats are offline. */ }
    };
    const timer = window.setTimeout(() => { void load(); }, 0);
    const refresh = window.setInterval(() => { void load(); }, 30_000);
    return () => { stopped = true; window.clearTimeout(timer); window.clearInterval(refresh); };
  }, []);

  return <section aria-label="Your active learning time" className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-300/10 bg-gradient-to-r from-[#111a31] to-[#131b36] px-5 py-4 text-slate-100">
    <div><p className="text-[9px] font-extrabold tracking-[.16em] text-violet-300">YOUR LEARNING TIME</p><p className="mt-1 text-xs text-slate-400">Counted while this page is visible and recently active.</p></div>
    <div className="flex gap-6"><div><p className="text-[9px] text-slate-500">Today</p><p className="text-sm font-semibold">{summary ? <LiveDuration key={`${summary.syncedAt}-today`} seconds={summary.todaySeconds} /> : "—"}</p></div><div><p className="text-[9px] text-slate-500">Total</p><p className="text-sm font-semibold">{summary ? <LiveDuration key={`${summary.syncedAt}-total`} seconds={summary.totalSeconds} /> : "—"}</p></div></div>
  </section>;
}
