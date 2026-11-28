"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#hubs", label: "Hubs" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

type SiteHeaderProps = {
  active?: (typeof navItems)[number]["href"] | "/get-started";
};

const actionLink = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-indigo-300/40 bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300";

export function SiteHeader({ active = "/" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-[1000] border-b border-white/[.07] bg-[#080d1b]/95 text-[#f5f7ff] shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-[min(1320px,calc(100%-2rem))] items-center justify-between gap-4 max-[600px]:min-h-[68px] max-[600px]:w-[calc(100%-1.25rem)]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="CEO JACK Learning Hub home" onClick={closeMenu}>
          <Image src="/assets/images/logo1.webp" alt="" className="size-10 rounded-xl object-contain" width={40} height={40} priority />
          <span className="grid gap-1 leading-none">
            <strong className="text-[13px] font-bold tracking-[.08em]">CEO JACK</strong>
            <small className="text-[8px] font-bold tracking-[.2em] text-slate-400">LEARNING HUB</small>
          </span>
        </Link>

        <button
          className="grid size-11 shrink-0 place-content-center gap-[5px] rounded-xl border border-white/10 bg-white/[.035] min-[901px]:hidden"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`h-0.5 w-[18px] rounded bg-slate-100 transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-0.5 w-[18px] rounded bg-slate-100 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-[18px] rounded bg-slate-100 transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>

        <nav className="hidden items-center gap-[clamp(12px,1.5vw,22px)] min-[901px]:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const selected = active === item.href;
            return <Link key={item.href} href={item.href} className={`relative inline-flex min-h-10 items-center text-[12px] font-medium transition-colors hover:text-white ${selected ? "text-white after:absolute after:inset-x-0 after:-bottom-[18px] after:h-0.5 after:bg-indigo-300 after:content-['']" : "text-slate-300"}`} aria-current={selected ? "page" : undefined}>{item.label}</Link>;
          })}
          <Link href="/auth?mode=signin" className="inline-flex min-h-10 items-center rounded-lg border border-white/20 px-3.5 text-xs font-semibold text-slate-100 transition hover:border-indigo-300/50 hover:bg-indigo-400/10">Log in</Link>
          <Link href="/get-started" className={actionLink} aria-current={active === "/get-started" ? "page" : undefined}>Get Started Free <span aria-hidden="true">→</span></Link>
        </nav>

        <nav
          className={`absolute left-3 right-3 top-[calc(100%+8px)] z-20 flex-col gap-1 rounded-2xl border border-white/10 bg-[#0b1020]/[.99] p-3 shadow-2xl shadow-black/40 min-[901px]:hidden ${menuOpen ? "flex" : "hidden"}`}
          id="mobileMenu"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => {
            const selected = active === item.href;
            return <Link key={item.href} href={item.href} className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium ${selected ? "border-l-[3px] border-indigo-300 bg-indigo-400/10 text-white" : "text-slate-200 hover:bg-white/5"}`} aria-current={selected ? "page" : undefined} onClick={closeMenu}>{item.label}</Link>;
          })}
          <Link href="/auth?mode=signin" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:bg-white/5" onClick={closeMenu}>Log in</Link>
          <Link href="/get-started" className={`${actionLink} mt-1 w-full`} aria-current={active === "/get-started" ? "page" : undefined} onClick={closeMenu}>Get Started Free <span aria-hidden="true">→</span></Link>
        </nav>
      </div>
    </header>
  );
}
