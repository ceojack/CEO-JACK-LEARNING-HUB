"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import "@/src/styles/dashboard.css";

function subscribe() {
  return () => {};
}

function getUserName() {
  try {
    const stored = window.localStorage.getItem("ceoJackUser");
    if (!stored) return "Learner";
    const parsed = JSON.parse(stored) as { name?: string };
    return parsed.name || "Learner";
  } catch {
    return "Learner";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const name = useSyncExternalStore(subscribe, getUserName, () => "Learner");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function logout() {
    window.localStorage.removeItem("ceoJackUser");
    router.push("/");
  }

  return (
    <div className="app-shell">
      {sidebarOpen ? <div className="sidebar-overlay show" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">CJ</div>
          <div className="brand-text">
            <strong>CEO JACK</strong>
            <span>LEARNING HUB</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-label">MAIN</span>
            <Link href="/dashboard" className="nav-item active"><span className="nav-icon">⌂</span><span>Dashboard</span></Link>
            <Link href="/education" className="nav-item"><span className="nav-icon">📚</span><span>Education Hub</span></Link>
            <Link href="/digital-skills" className="nav-item"><span className="nav-icon">💻</span><span>Digital Skills</span></Link>
            <Link href="/entrepreneurship" className="nav-item"><span className="nav-icon">🚀</span><span>Entrepreneurship</span></Link>
            <Link href="/ai" className="nav-item"><span className="nav-icon">✦</span><span>CEO JACK AI</span></Link>
          </div>
        </nav>
        <div className="sidebar-bottom">
          <button type="button" className="logout-btn" onClick={logout}>
            <span>↪</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-btn" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-search">
            <span className="search-icon">⌕</span>
            <input type="search" placeholder="Search courses, subjects, skills..." />
          </div>
        </header>
        <div className="dashboard-page">
          <section className="welcome-section">
            <div>
              <span className="eyebrow">YOUR LEARNING SPACE</span>
              <h1>Welcome back, {name} 👋</h1>
              <p>Continue learning, build new skills, and develop your future.</p>
            </div>
            <Link href="/education" className="primary-btn">
              Continue Learning <span>→</span>
            </Link>
          </section>
          <section className="hub-cards">
            <Link href="/education" className="hub-card">
              <h2>Education</h2>
              <p>Classes, subjects and topics.</p>
            </Link>
            <Link href="/digital-skills" className="hub-card">
              <h2>Digital Skills</h2>
              <p>Build with technology.</p>
            </Link>
            <Link href="/entrepreneurship" className="hub-card">
              <h2>Entrepreneurship</h2>
              <p>Turn ideas into action.</p>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
