"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AcademicLevel,
  classes,
  primarySubjects,
  secondarySubjects,
} from "@/src/lib/education-data";
import "@/src/styles/education.css";

export default function EducationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [level, setLevel] = useState<AcademicLevel>("primary");
  const [selectedClass, setSelectedClass] = useState("P1");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const subjects = useMemo(() => {
    const source = level === "primary" ? primarySubjects : secondarySubjects;
    const term = query.trim().toLowerCase();
    return source.filter(
      (subject) =>
        subject.name.toLowerCase().includes(term) ||
        subject.description.toLowerCase().includes(term)
    );
  }, [level, query]);

  function selectClass(className: string) {
    setSelectedClass(className);
    setToast(`${className} selected successfully.`);
    window.setTimeout(() => setToast(""), 2800);
  }

  function switchLevel(nextLevel: AcademicLevel) {
    setLevel(nextLevel);
    setSelectedClass(classes[nextLevel][0]);
    setQuery("");
  }

  return (
    <div className="app">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`} id="sidebar">
        <Link href="/" className="brand">
          <div className="brand-icon">CJ</div>
          <div className="brand-copy">
            <strong>CEO JACK</strong>
            <span>LEARNING HUB</span>
          </div>
        </Link>
        <div className="sidebar-label">LEARNING SPACE</div>
        <nav className="navigation">
          <Link href="/dashboard" className="nav-link"><span className="nav-icon">⌂</span>Dashboard</Link>
          <Link href="/education" className="nav-link active"><span className="nav-icon">▤</span>Education Hub</Link>
          <Link href="/digital-skills" className="nav-link"><span className="nav-icon">&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className="nav-link"><span className="nav-icon">◈</span>Entrepreneurship</Link>
          <Link href="/ai" className="nav-link"><span className="nav-icon">✦</span>CEO JACK AI<span className="ai-tag">AI</span></Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>Keep growing</strong>
            <p>Build knowledge one lesson at a time.</p>
            <Link href="/ai">Explore AI Tutor →</Link>
          </div>
          <Link href="/dashboard" className="back-link">← Main Dashboard</Link>
        </div>
      </aside>
      {sidebarOpen ? <div className="mobile-overlay show" onClick={() => setSidebarOpen(false)} /> : null}

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <div className="breadcrumb">Learning Space / Education</div>
              <h1>Education Hub</h1>
            </div>
          </div>
          <div className="topbar-right">
            <Link href="/ai" className="ai-top-button"><span>✦</span><span>Ask AI</span></Link>
          </div>
        </header>

        <div className="page-content">
          <section className="hero">
            <div className="hero-content">
              <div className="hero-label"><span className="hero-dot" />YOUR ACADEMIC JOURNEY</div>
              <h2>Learn today.<br /><span>Lead tomorrow.</span></h2>
              <p>Discover lessons, strengthen your understanding, and build the knowledge that shapes your future.</p>
              <a href="#classSection" className="hero-button">Explore my classes <span>→</span></a>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-book">✦</div>
            </div>
          </section>

          <section className="section" id="classSection">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PERSONALIZE YOUR LEARNING</span>
                <h2>Choose your academic level</h2>
                <p>Select your class to discover relevant subjects.</p>
              </div>
              <div className="level-switch">
                <button className={`level-tab${level === "primary" ? " active" : ""}`} type="button" onClick={() => switchLevel("primary")}>Primary</button>
                <button className={`level-tab${level === "secondary" ? " active" : ""}`} type="button" onClick={() => switchLevel("secondary")}>Secondary</button>
              </div>
            </div>
            <div className="class-grid">
              {classes[level].map((className) => (
                <button
                  key={className}
                  className={`class-card${selectedClass === className ? " active" : ""}`}
                  type="button"
                  aria-pressed={selectedClass === className}
                  onClick={() => selectClass(className)}
                >
                  <strong>{className}</strong>
                  <span>{level === "primary" ? "Primary" : "Secondary"}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="section" id="subjectsSection">
            <div className="section-heading">
              <div>
                <span className="section-kicker">DISCOVER KNOWLEDGE</span>
                <h2>Explore subjects</h2>
                <p>Explore subjects for {selectedClass}.</p>
              </div>
              <label className="search-box">
                <span>⌕</span>
                <input type="search" placeholder="Search subjects..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>
            <div className="subject-grid">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={`/subject?name=${encodeURIComponent(subject.name)}&class=${encodeURIComponent(selectedClass)}`}
                  className="subject-card"
                >
                  <div className="subject-icon" style={{ backgroundColor: subject.color, color: subject.iconColor }}>
                    {subject.icon}
                  </div>
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                </Link>
              ))}
            </div>
            {subjects.length === 0 ? (
              <div className="empty-state">
                <span>⌕</span>
                <h3>No subjects found</h3>
                <p>Try another search term.</p>
              </div>
            ) : null}
          </section>

          <section className="ai-banner">
            <div className="ai-banner-icon">✦</div>
            <div className="ai-banner-copy">
              <span>YOUR PERSONAL LEARNING COMPANION</span>
              <h2>Confused about a topic?</h2>
              <p>Ask CEO JACK AI to explain difficult concepts, provide examples, and help you practice.</p>
            </div>
            <Link href="/ai" className="ai-banner-button">Ask CEO JACK AI →</Link>
          </section>
        </div>
      </main>
      <div className={`toast${toast ? " show" : ""}`} role="status">{toast}</div>
    </div>
  );
}
