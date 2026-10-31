"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "@/src/components/footer";
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
          <Image src="/assets/images/logo1.webp" alt="" className="brand-logo" width={40} height={40} priority />
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
          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link className="nav-cta get-started-button active" href="/get-started" aria-current="page">
            Get Started Free <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className="start-layout" aria-labelledby="page-title">
          <div className="intro-panel reveal">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              START HERE · FREE TO JOIN
            </p>
            <h1 id="page-title">
              Start learning.
              <span>Build your future.</span>
            </h1>
            <p className="intro-copy">
              Create a free account, choose what you want to learn, and keep your progress in one place. You can explore education, digital skills, and entrepreneurship.
            </p>
            <div className="journey-list" aria-label="Your journey in three steps">
              <div className="journey-step">
                <span className="step-index">01</span>
                <div>
                  <h2>Create your account</h2>
                  <p>Sign up with your name, email, and a password.</p>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-index">02</span>
                <div>
                  <h2>Choose a learning hub</h2>
                  <p>Start with Education, Digital Skills, or Entrepreneurship.</p>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-index">03</span>
                <div>
                  <h2>Learn at your pace</h2>
                  <p>Follow lessons, practise skills, and return to your progress.</p>
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
              <span className="card-kicker">YOUR FIRST STEP</span>
              <span className="free-label"><span /> FREE TO START</span>
            </div>
            <div className="card-symbol" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M10 24h27M26 13l11 11-11 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="choice-title">Choose how to continue</h2>
            <p className="card-description">New to CEO JACK? Create an account. Already joined? Sign in to continue.</p>
            <button className="action-option action-primary" type="button" onClick={() => goToAuth("signup")}>
              <span className="option-icon" aria-hidden="true">＋</span>
              <span className="option-copy">
                <strong>Create a free account</strong>
                <small>For new learners · Sign up with your name and email</small>
              </span>
              <span className="option-arrow" aria-hidden="true">↗</span>
            </button>
            <button className="action-option action-secondary" type="button" onClick={() => goToAuth("signin")}>
              <span className="option-icon" aria-hidden="true">↗</span>
              <span className="option-copy">
                <strong>Sign in to your account</strong>
                <small>For returning learners · Continue where you left off</small>
              </span>
              <span className="option-arrow" aria-hidden="true">→</span>
            </button>
            <div className="card-separator">
              <span /><small>OR</small><span />
            </div>
            <Link className="explore-link" href="/#hubs">
              Explore the learning hubs first <span aria-hidden="true">→</span>
            </Link>
            <p className="form-notice" role="status" aria-live="polite">{message}</p>
            <p className="privacy-note">
              <span aria-hidden="true">◇</span>
              Your account keeps your learning progress together. Use a password you don&apos;t use elsewhere.
            </p>
          </section>
        </section>

        <section className="bottom-note reveal" aria-label="Platform promise">
          <span className="bottom-note-line" />
          <p><strong>One platform.</strong> Three ways to grow.</p>
          <span className="bottom-note-line" />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
