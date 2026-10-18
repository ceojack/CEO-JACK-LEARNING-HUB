"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", id: "home" },
  { href: "/how-it-works", label: "How It Works", id: "how-it-works" },
  { href: "/about", label: "About", id: "about" },
  { href: "/services", label: "Services", id: "services" },
  { href: "/contact", label: "Contact", id: "contact" },
] as const;

type SiteHeaderProps = {
  active?: (typeof navItems)[number]["id"] | "get-started";
};

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="CEO JACK Learning Hub home" onClick={closeMenu}>
          <Image src="/assets/images/logo1.webp" alt="CEO JACK Learning Hub" className="brand-logo" width={40} height={40} priority />
          <span className="brand-copy">
            <strong>CEO JACK</strong>
            <small>LEARNING HUB</small>
          </span>
        </Link>

        <button
          className="menu-btn"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={active === item.id ? "active" : undefined}
              aria-current={active === item.id ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/get-started" className="nav-cta">
            Get Started Free <span>→</span>
          </Link>
        </nav>

        <nav
          className={`mobile-menu${menuOpen ? " active" : ""}`}
          id="mobileMenu"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <Link href="/get-started" className="mobile-cta" onClick={closeMenu}>
            Get Started Free →
          </Link>
        </nav>
      </div>
    </header>
  );
}
