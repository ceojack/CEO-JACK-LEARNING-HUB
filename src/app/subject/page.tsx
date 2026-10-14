"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import "@/src/styles/subject.css";

function SubjectContent() {
  const params = useSearchParams();
  const name = params.get("name") || "Mathematics";
  const className = params.get("class") || "P1";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {sidebarOpen ? <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">CJ</div>
          <div className="brand-text">
            <h2>CEO JACK</h2>
            <span>LEARNING HUB</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-label">MAIN</span>
            <Link href="/dashboard" className="nav-item"><span className="nav-icon">⌂</span><span>Dashboard</span></Link>
            <Link href="/education" className="nav-item active"><span className="nav-icon">🎓</span><span>Education Hub</span></Link>
            <Link href="/digital-skills" className="nav-item"><span className="nav-icon">💻</span><span>Digital Skills</span></Link>
            <Link href="/entrepreneurship" className="nav-item"><span className="nav-icon">🚀</span><span>Entrepreneurship</span></Link>
            <Link href="/ai" className="nav-item"><span className="nav-icon">✦</span><span>CEO JACK AI</span></Link>
          </div>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn" type="button" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-left">
            <Link href="/education" className="back-btn">← Back to Education</Link>
          </div>
        </header>
        <section className="subject-hero">
          <span className="eyebrow">{className} · SUBJECT</span>
          <h1>{name}</h1>
          <p>Start with the foundations, then practise and ask CEO JACK AI when you get stuck.</p>
          <Link href={`/ai?prompt=${encodeURIComponent(`Help me learn ${name} for ${className}.`)}`} className="primary-btn">
            Ask CEO JACK AI →
          </Link>
        </section>
      </main>
    </>
  );
}

export default function SubjectPage() {
  return (
    <Suspense fallback={<p>Loading subject…</p>}>
      <SubjectContent />
    </Suspense>
  );
}
