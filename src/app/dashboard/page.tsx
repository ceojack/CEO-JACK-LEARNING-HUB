"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "./dashboard.css";

const courses = [
  { name: "Foundations of Mathematics", category: "Education · Primary", students: 248, progress: 82, status: "Published", tone: "violet", mark: "∑" },
  { name: "Web Development Essentials", category: "Digital Skills", students: 186, progress: 68, status: "Published", tone: "blue", mark: "</>" },
  { name: "Entrepreneurship Basics", category: "Business", students: 142, progress: 54, status: "In review", tone: "green", mark: "↗" },
  { name: "English Language & Writing", category: "Education · Secondary", students: 121, progress: 91, status: "Published", tone: "orange", mark: "Aa" },
  { name: "Introduction to Artificial Intelligence", category: "Digital Skills", students: 98, progress: 39, status: "Draft", tone: "pink", mark: "✦" },
];

const navigation = [
  { label: "Dashboard", href: "#overview", icon: "⌂" },
  { label: "Courses", href: "#courses", icon: "▤" },
  { label: "Students", href: "#students", icon: "♙" },
  { label: "Teachers", href: "#teachers", icon: "♧" },
  { label: "Settings", href: "#settings", icon: "⚙" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredCourses = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((course) =>
      `${course.name} ${course.category} ${course.status}`.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <div className="admin-shell" id="overview">
      {sidebarOpen ? (
        <button className="admin-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <aside className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <Link href="/" className="admin-brand" aria-label="CEO JACK Learning Hub home">
          <span className="admin-brand-mark">CJ</span>
          <span className="admin-brand-copy"><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>

        <div className="admin-nav-label">WORKSPACE</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map((item, index) => (
            <a
              key={item.label}
              className={`admin-nav-item${index === 0 ? " is-active" : ""}`}
              href={item.href}
              aria-current={index === 0 ? "page" : undefined}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === "Courses" ? <span className="admin-nav-count">24</span> : null}
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-help-card">
            <span className="admin-help-spark" aria-hidden="true">✦</span>
            <strong>Need a hand?</strong>
            <p>Visit the learning hub to explore your platform.</p>
            <Link href="/how-it-works">Explore the hub <span aria-hidden="true">→</span></Link>
          </div>
          <Link className="admin-back-link" href="/"><span aria-hidden="true">↗</span> View learning site</Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            type="button"
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
          <label className="admin-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, students..."
              aria-label="Search courses"
            />
            <kbd>⌘ K</kbd>
          </label>
          <div className="admin-top-actions">
            <button className="admin-icon-button" type="button" aria-label="Notifications">
              ♧<i aria-hidden="true" />
            </button>
            <span className="admin-top-divider" />
            <button className="admin-profile" type="button" aria-label="Admin profile">
              <span className="admin-avatar">CJ</span>
              <span className="admin-profile-copy"><strong>CEO JACK</strong><small>Administrator</small></span>
              <span className="admin-profile-chevron" aria-hidden="true">⌄</span>
            </button>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-welcome">
            <div>
              <div className="admin-eyebrow"><span /> YOUR LEARNING PLATFORM</div>
              <h1>Good morning, Jack <span aria-hidden="true">✦</span></h1>
              <p>Here’s what’s happening across CEO JACK LEARNING HUB today.</p>
            </div>
            <Link className="admin-primary-button" href="/education"><span aria-hidden="true">＋</span> Create a course</Link>
          </section>

          <section className="admin-stats" aria-label="Platform overview">
            <article className="admin-stat-card" id="courses">
              <div className="admin-stat-top"><span>Total Courses</span><span className="admin-stat-icon violet" aria-hidden="true">▤</span></div>
              <div className="admin-stat-value">24 <span className="admin-trend positive">↗ 12%</span></div>
              <div className="admin-stat-foot"><span>Compared with last month</span><span className="admin-sparkline spark-violet" aria-hidden="true">▁▂▁▃▂▅▄▆</span></div>
            </article>
            <article className="admin-stat-card" id="students">
              <div className="admin-stat-top"><span>Total Students</span><span className="admin-stat-icon blue" aria-hidden="true">♙</span></div>
              <div className="admin-stat-value">1,284 <span className="admin-trend positive">↗ 8.4%</span></div>
              <div className="admin-stat-foot"><span>Compared with last month</span><span className="admin-sparkline spark-blue" aria-hidden="true">▁▂▃▂▄▃▅▆</span></div>
            </article>
            <article className="admin-stat-card">
              <div className="admin-stat-top"><span>Revenue</span><span className="admin-stat-icon green" aria-hidden="true">＄</span></div>
              <div className="admin-stat-value">$8,420 <span className="admin-trend positive">↗ 6.2%</span></div>
              <div className="admin-stat-foot"><span>Compared with last month</span><span className="admin-sparkline spark-green" aria-hidden="true">▁▃▂▂▄▃▅▆</span></div>
            </article>
            <article className="admin-stat-card" id="teachers">
              <div className="admin-stat-top"><span>Active Teachers</span><span className="admin-stat-icon orange" aria-hidden="true">♧</span></div>
              <div className="admin-stat-value">18 <span className="admin-trend neutral">12 online</span></div>
              <div className="admin-stat-foot"><span>Across all learning hubs</span><span className="admin-teacher-dots" aria-hidden="true"><i /><i /><i /><b>+15</b></span></div>
            </article>
          </section>

          <section className="admin-insight-row" aria-label="Platform insights">
            <div className="admin-insight-copy">
              <span className="admin-insight-icon" aria-hidden="true">✦</span>
              <div><strong>Your learning community is growing</strong><p>Student enrollment is up 8.4% this month. Keep the momentum going.</p></div>
            </div>
            <a href="#courses">View insights <span aria-hidden="true">→</span></a>
          </section>

          <section className="admin-courses-section">
            <div className="admin-section-heading">
              <div><span className="admin-section-kicker">CONTENT LIBRARY</span><h2>Recent courses</h2><p>Keep track of your most recently updated learning content.</p></div>
              <Link href="/education" className="admin-secondary-button">Manage courses <span aria-hidden="true">→</span></Link>
            </div>

            <div className="admin-course-table-wrap">
              <table className="admin-course-table">
                <thead><tr><th>COURSE</th><th>ENROLLED</th><th>COMPLETION</th><th>STATUS</th><th><span className="sr-only">Open course</span></th></tr></thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.name}>
                      <td><div className="admin-course-name"><span className={`admin-course-mark ${course.tone}`}>{course.mark}</span><span><strong>{course.name}</strong><small>{course.category}</small></span></div></td>
                      <td><span className="admin-enrolled">{course.students}<small> students</small></span></td>
                      <td><div className="admin-completion"><div className="admin-progress-track"><span style={{ width: `${course.progress}%` }} /></div><small>{course.progress}%</small></div></td>
                      <td><span className={`admin-status ${course.status === "Published" ? "published" : course.status === "In review" ? "review" : "draft"}`}><i />{course.status}</span></td>
                      <td><button className="admin-row-action" type="button" aria-label={`Open ${course.name}`}>↗</button></td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 ? <tr><td className="admin-empty-state" colSpan={5}>No courses match “{query}”. Try another search.</td></tr> : null}
                </tbody>
              </table>
            </div>
            <div className="admin-table-footer"><span>Showing {filteredCourses.length} of 24 courses</span><Link href="/education">View all courses <span aria-hidden="true">→</span></Link></div>
          </section>

          <footer className="admin-footer" id="settings">
            <span>© {new Date().getFullYear()} CEO JACK LEARNING HUB</span>
            <span>Learn. Create. Develop.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
