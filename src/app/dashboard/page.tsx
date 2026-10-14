"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/src/styles/dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("Learner");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ceoJackUser");
      if (raw) {
        const user = JSON.parse(raw) as { name?: string };
        if (user.name) setName(user.name);
      }
    } catch {
      setName("Learner");
    }
  }, []);

  function logout() {
    window.localStorage.removeItem("ceoJackUser");
    router.push("/");
  }

  return (
    <div className="app-shell">
      {sidebarOpen ? <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} /> : null}
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
          <section className="hub-shortcuts">
            <Link href="/education" className="hub-card">Education Hub</Link>
            <Link href="/digital-skills" className="hub-card">Digital Skills</Link>
            <Link href="/entrepreneurship" className="hub-card">Entrepreneurship</Link>
            <Link href="/ai" className="hub-card">CEO JACK AI</Link>
          </section>
        </div>
      </main>
    </div>
  );
}
