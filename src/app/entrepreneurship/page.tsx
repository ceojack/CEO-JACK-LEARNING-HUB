"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { useState } from "react";
import { entrepreneurshipTracks } from "@/src/utils/education-data";
import "@/src/styles/education.css";

export default function EntrepreneurshipPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    <div className="app">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Link href="/" className="brand">
          <div className="brand-icon">CJ</div>
          <div className="brand-copy">
            <strong>CEO JACK</strong>
            <span>LEARNING HUB</span>
          </div>
        </Link>
        <nav className="navigation">
          <Link href="/dashboard" className="nav-link"><span className="nav-icon">⌂</span>Dashboard</Link>
          <Link href="/education" className="nav-link"><span className="nav-icon">▤</span>Education Hub</Link>
          <Link href="/digital-skills" className="nav-link"><span className="nav-icon">&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className="nav-link active"><span className="nav-icon">◈</span>Entrepreneurship</Link>
          <Link href="/ai" className="nav-link"><span className="nav-icon">✦</span>CEO JACK AI</Link>
        </nav>
      </aside>
      {sidebarOpen ? <div className="mobile-overlay show" onClick={() => setSidebarOpen(false)} /> : null}
      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <div className="breadcrumb">Learning Space / Entrepreneurship</div>
              <h1>Entrepreneurship Hub</h1>
            </div>
          </div>
        </header>
        <div className="page-content">
          <section className="hero">
            <div className="hero-content">
              <div className="hero-label"><span className="hero-dot" />DEVELOP YOUR FUTURE</div>
              <h2>Turn ideas into<br /><span>opportunities.</span></h2>
              <p>Build business thinking, financial literacy and practical next steps you can try in the real world.</p>
              <Link href="/ai" className="hero-button">Explore business with AI <span>→</span></Link>
            </div>
          </section>
          <section className="hub-journey" aria-label="How to use the Entrepreneurship Hub">
            <div className="hub-journey-intro"><span className="section-kicker">IDEA TO ACTION</span><h2>Build a business mindset</h2><p>Explore practical foundations for turning useful ideas into small, thoughtful experiments.</p></div>
            <div className="hub-journey-grid">
              <article><span className="hub-journey-number">01</span><div><strong>Notice a need</strong><p>Look for everyday problems people want solved.</p></div></article>
              <article><span className="hub-journey-number">02</span><div><strong>Plan the basics</strong><p>Think about customers, costs, and what makes your idea useful.</p></div></article>
              <article><span className="hub-journey-number">03</span><div><strong>Try a small test</strong><p>Get feedback, learn from it, and improve your next step.</p></div></article>
            </div>
          </section>
          <section className="section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">GROWTH PATHS</span>
                <h2>Choose a business learning path</h2>
                <p>Explore a foundation, then use CEO JACK AI to plan a beginner-friendly activity.</p>
              </div>
            </div>
            <div className="subject-grid">
              {entrepreneurshipTracks.map((track) => (
                <Link key={track.name} href={`/ai?prompt=${encodeURIComponent(`Help me explore ${track.name}. ${track.description} Give me a practical beginner activity and clear next steps.`)}`} className="subject-card track-link">
                  <div className="subject-icon">{track.icon}</div>
                  <h3>{track.name}</h3>
                  <p>{track.description}</p>
                  <span className="track-action">Explore this path <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
