"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navGroups = [
  { title: "WORKSPACE", items: [
    { href: "/admin", label: "Overview", icon: "⌂" },
    { href: "/admin/users", label: "Users", icon: "♙" },
    { href: "/admin/courses", label: "Courses", icon: "▤" },
    { href: "/admin/enrollments", label: "Enrollments", icon: "⇄" },
    { href: "/admin/content", label: "Content", icon: "▣" },
  ] },
  { title: "SYSTEM", items: [{ href: "/admin/settings", label: "Settings", icon: "⚙" }] },
];

export function AdminShell({ children, adminName, adminEmail }: { children: React.ReactNode; adminName: string; adminEmail: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = adminName.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen overflow-x-clip bg-[#080d1b] text-slate-100 [background-image:radial-gradient(ellipse_at_75%_-15%,rgba(99,133,255,.15),transparent_38%)]">
      {menuOpen ? <button className="fixed inset-0 z-30 bg-black/60 min-[901px]:hidden" aria-label="Close admin navigation" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/[.07] bg-[#090f1e] px-4 py-5 transition-transform min-[901px]:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Link href="/admin" className="mb-9 flex items-center gap-3 rounded-xl px-2 py-1" onClick={() => setMenuOpen(false)}>
          <span className="grid size-10 place-items-center rounded-xl border border-indigo-300/25 bg-indigo-400/10 text-sm font-black text-indigo-200">CJ</span>
          <span className="grid leading-tight"><strong className="text-xs tracking-[.08em]">CEO JACK</strong><small className="mt-1 text-[8px] font-bold tracking-[.2em] text-slate-500">LEARNING HUB</small></span>
        </Link>
        {navGroups.map((group) => <nav key={group.title} aria-label={group.title} className="mb-7 grid gap-1">
          <p className="mb-2 px-3 text-[9px] font-bold tracking-[.17em] text-slate-600">{group.title}</p>
          {group.items.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 text-xs font-semibold transition ${active ? "border-indigo-300/20 bg-indigo-400/10 text-white" : "border-transparent text-slate-400 hover:bg-white/[.04] hover:text-white"}`}><span className="grid w-5 place-items-center text-base text-indigo-300">{item.icon}</span>{item.label}</Link>;
          })}
        </nav>)}
        <div className="mt-auto grid gap-2 border-t border-white/[.07] pt-4">
          <Link href="/" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs font-medium text-slate-400 hover:bg-white/[.04] hover:text-white"><span className="w-5 text-center">↗</span>Back to Site</Link>
          <form action="/auth/signout" method="post"><button className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs font-medium text-slate-400 hover:bg-rose-400/10 hover:text-rose-200" type="submit"><span className="w-5 text-center">⇥</span>Logout</button></form>
        </div>
      </aside>

      <div className="min-h-screen min-[901px]:pl-[260px]">
        <header className="sticky top-0 z-20 flex min-h-[68px] items-center gap-4 border-b border-white/[.07] bg-[#080d1b]/90 px-4 backdrop-blur-xl sm:px-7">
          <button className="grid size-10 shrink-0 place-content-center gap-1 rounded-lg border border-white/10 bg-white/[.03] min-[901px]:hidden" onClick={() => setMenuOpen(true)} type="button" aria-label="Open admin navigation" aria-expanded={menuOpen}><span className="h-0.5 w-4 bg-white"/><span className="h-0.5 w-4 bg-white"/><span className="h-0.5 w-4 bg-white"/></button>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-200 sm:text-sm">CEO JACK Learning Hub <span className="text-slate-600">/</span> Admin</p></div>
          <form action="/admin/users" className="hidden w-[min(290px,28vw)] sm:block"><label className="sr-only" htmlFor="admin-search">Search users</label><input id="admin-search" name="q" placeholder="Search users…" className="h-10 w-full rounded-xl border border-white/10 bg-white/[.035] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-indigo-300/50 focus:ring-2 focus:ring-indigo-400/10" /></form>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full border border-indigo-300/25 bg-indigo-400/10 text-xs font-bold text-indigo-100">{initial}</span><span className="hidden min-w-0 sm:grid"><strong className="max-w-[150px] truncate text-xs">{adminName}</strong><small className="max-w-[150px] truncate text-[10px] text-slate-500">{adminEmail}</small></span><form action="/auth/signout" method="post" className="hidden md:block"><button type="submit" className="min-h-9 rounded-lg border border-white/10 px-3 text-[11px] font-semibold text-slate-300 hover:bg-white/[.05] hover:text-white">Logout</button></form></div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] p-4 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
