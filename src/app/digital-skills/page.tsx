"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { useState } from "react";
import { digitalTracks } from "@/src/lib/education-data";
import "@/src/styles/education.css";

export default function DigitalSkillsPage() {
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
          <Link href="/digital-skills" className="nav-link active"><span className="nav-icon">&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className="nav-link"><span className="nav-icon">◈</span>Entrepreneurship</Link>
          <Link href="/ai" className="nav-link"><span className="nav-icon">✦</span>CEO JACK AI</Link>
        </nav>
      </aside>
      {sidebarOpen ? <div className="mobile-overlay show" onClick={() => setSidebarOpen(false)} /> : null}
      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <div className="breadcrumb">Learning Space / Digital Skills</div>
              <h1>Digital Skills Hub</h1>
            </div>
          </div>
        </header>
        <div className="page-content">
          <section className="hero">
            <div className="hero-content">
              <div className="hero-label"><span className="hero-dot" />CREATE WITH TECHNOLOGY</div>
              <h2>Build practical skills.<br /><span>Make something real.</span></h2>
              <p>Learn web development, programming, AI tools and projects by doing, not only watching.</p>
              <Link href="/ai" className="hero-button">Ask CEO JACK AI <span>→</span></Link>
            </div>
          </section>
          <section className="section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">LEARNING TRACKS</span>
                <h2>Start creating</h2>
                <p>Choose a track and continue into practice.</p>
              </div>
            </div>
            <div className="subject-grid">
              {digitalTracks.map((track) => (
                <Link key={track.name} href={`/ai?prompt=${encodeURIComponent(`Help me get started with ${track.name}. ${track.description} Give me a beginner-friendly activity and clear next steps.`)}`} className="subject-card track-link">
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
