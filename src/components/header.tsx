"use client";

import Link from "next/link";
import Image from "next/image";
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

export function SiteHeader({ active = "/" }: SiteHeaderProps) {
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
              key={item.href}
              href={item.href}
              className={active === item.href ? "active" : undefined}
              aria-current={active === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/get-started" className={`nav-cta${active === "/get-started" ? " active" : ""}`} aria-current={active === "/get-started" ? "page" : undefined}>
            Get Started Free <span>→</span>
          </Link>
        </nav>

        <nav
          className={`mobile-menu${menuOpen ? " active" : ""}`}
          id="mobileMenu"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={active === item.href ? "active" : undefined}
              aria-current={active === item.href ? "page" : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/get-started" className={`mobile-cta${active === "/get-started" ? " active" : ""}`} aria-current={active === "/get-started" ? "page" : undefined} onClick={closeMenu}>
            Get Started Free →
          </Link>
        </nav>
      </div>
    </header>
  );
}
