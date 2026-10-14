"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useReveal } from "@/src/hooks/use-reveal";
import "@/src/styles/get-started.css";

export default function GetStartedPage() {
  useReveal();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  function goToAuth(mode: "signup" | "signin") {
    setMessage(mode === "signup" ? "Taking you to account creation…" : "Taking you to sign in…");
    router.push(`/auth?mode=${mode}`);
  }

  return (
    <>
      <div className="site-background" aria-hidden="true">
        <div className="background-grid" />
        <div className="background-glow glow-blue" />
        <div className="background-glow glow-purple" />
      </div>

      <header className="site-header">
        <Link className="brand" href="/" aria-label="CEO JACK Learning Hub home">
          <img src="/assets/images/logo1.webp" alt="" className="brand-logo" />
          <span className="brand-lockup">
            <strong>CEO JACK</strong>
            <small>LEARNING HUB</small>
          </span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
        <nav className={`primary-navigation${menuOpen ? " is-open" : ""}`} id="primary-navigation" aria-label="Main navigation">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/#hubs" onClick={() => setMenuOpen(false)}>Hubs</Link>
          <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link className="nav-cta active" href="/get-started" aria-current="page">
            Get Started Free <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className="start-layout" aria-labelledby="page-title">
          <div className="intro-panel reveal">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR NEXT CHAPTER STARTS HERE
            </p>
            <h1 id="page-title">
              Your future is built
              <span> one step at a time.</span>
            </h1>
            <p className="intro-copy">
              Create one account for your learning journey. Explore new knowledge, build practical skills, and turn what you learn into something meaningful.
            </p>
            <div className="journey-list" aria-label="Your journey in three steps">
              <div className="journey-step">
                <span className="step-index">01</span>
                <div>
                  <h2>Start with one account</h2>
                  <p>Keep your learning journey connected in one place.</p>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-index">02</span>
                <div>
                  <h2>Make it yours</h2>
                  <p>Choose your interests and the goals you want to work toward.</p>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-index">03</span>
                <div>
                  <h2>Keep moving forward</h2>
                  <p>Explore the hubs, practise your skills, and track your progress.</p>
                </div>
              </div>
            </div>
            <div className="principle-strip">
              <span>LEARN</span>
              <span className="principle-arrow">→</span>
              <span>CREATE</span>
              <span className="principle-arrow">→</span>
              <span>DEVELOP</span>
            </div>
          </div>

          <section className="choice-card reveal" aria-labelledby="choice-title">
            <div className="card-topline">
              <span className="card-kicker">CEO JACK LEARNING HUB</span>
              <span className="free-label"><span /> FREE TO START</span>
            </div>
            <div className="card-symbol" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M10 24h27M26 13l11 11-11 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="choice-title">How would you like to begin?</h2>
            <p className="card-description">Choose an option to continue. Your learning journey can grow with you.</p>
            <button className="action-option action-primary" type="button" onClick={() => goToAuth("signup")}>
              <span className="option-icon" aria-hidden="true">＋</span>
              <span className="option-copy">
                <strong>Create an account</strong>
                <small>I&apos;m new here</small>
              </span>
              <span className="option-arrow" aria-hidden="true">↗</span>
            </button>
            <button className="action-option action-secondary" type="button" onClick={() => goToAuth("signin")}>
              <span className="option-icon" aria-hidden="true">↗</span>
              <span className="option-copy">
                <strong>Sign in</strong>
                <small>I already have an account</small>
              </span>
              <span className="option-arrow" aria-hidden="true">→</span>
            </button>
            <div className="card-separator">
              <span /><small>OR</small><span />
            </div>
            <Link className="explore-link" href="/#hubs" onClick={() => setMessage("You can explore the hubs without creating an account.")}>
              Explore the learning hubs first <span aria-hidden="true">→</span>
            </Link>
            <p className="form-notice" role="status" aria-live="polite">{message}</p>
            <p className="privacy-note">
              <span aria-hidden="true">◇</span>
              Your account should be protected by secure authentication.
            </p>
          </section>
        </section>

        <section className="bottom-note reveal" aria-label="Platform promise">
          <span className="bottom-note-line" />
          <p><strong>One platform.</strong> Three ways to grow.</p>
          <span className="bottom-note-line" />
        </section>
      </main>

      <footer className="site-footer">
        <Link className="footer-brand" href="/">
          CEO JACK <span>LEARNING HUB</span>
        </Link>
        <p>Learn. Create. Develop.</p>
        <Link href="/contact">Need help? Contact us <span>↗</span></Link>
      </footer>
    </>
  );
}
