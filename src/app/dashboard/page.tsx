"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";

type LearnerProfile = { level?: string; ageGroup?: string; interests?: string[]; goals?: string[] };

const paths = [
  { title: "Education Hub", eyebrow: "BUILD YOUR FOUNDATION", description: "Explore school subjects, choose your class, and strengthen what you learn every day.", href: "/education", icon: "▤", tone: "violet", action: "Explore subjects" },
  { title: "Digital Skills", eyebrow: "MAKE WITH TECHNOLOGY", description: "Learn practical digital skills, from programming to creating your first website.", href: "/digital-skills", icon: "</>", tone: "blue", action: "Build digital skills" },
  { title: "Entrepreneurship", eyebrow: "TURN IDEAS INTO ACTION", description: "Develop your business thinking and take your next idea from plan to practice.", href: "/entrepreneurship", icon: "↗", tone: "green", action: "Explore business" },
  { title: "CEO JACK AI", eyebrow: "LEARN WITH A GUIDE", description: "Ask questions, get clear explanations, and practice at your own pace.", href: "/ai", icon: "✦", tone: "orange", action: "Ask your AI tutor" },
];

const lessonKey = "ceoJackLesson:p7-maths-equivalent-fractions";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = window.localStorage.getItem("ceoJackOnboarding");
      if (storedProfile) setProfile(JSON.parse(storedProfile) as LearnerProfile);
      setLessonComplete(window.localStorage.getItem(lessonKey) === "complete");
    } catch {
      setProfile(null);
    }
  }, []);

  const recommendedPath = useMemo(() => {
    const interests = profile?.interests ?? [];
    if (interests.some((item) => /web|programming|design/i.test(item))) return paths[1];
    if (interests.some((item) => /business/i.test(item))) return paths[2];
    if (interests.some((item) => /ai/i.test(item))) return paths[3];
    return paths[0];
  }, [profile]);

  const levelQuery = profile?.level === "Secondary" ? "secondary" : "primary";
  const learnerName = "Jack";
  const completedCount = lessonComplete ? 1 : 0;

  return (
    <div className="learner-dashboard">
      {sidebarOpen ? <button className="dashboard-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={`dashboard-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <Link href="/" className="dashboard-brand" aria-label="CEO JACK Learning Hub home">
          <span className="dashboard-brand-mark">CJ</span>
          <span><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>
        <span className="dashboard-nav-label">YOUR LEARNING SPACE</span>
        <nav className="dashboard-nav" aria-label="Learning space">
          <Link href="/dashboard" className="dashboard-nav-link active" aria-current="page" onClick={() => setSidebarOpen(false)}><span>⌂</span>My dashboard</Link>
          <Link href={`/education?level=${levelQuery}`} className="dashboard-nav-link" onClick={() => setSidebarOpen(false)}><span>▤</span>Education Hub</Link>
          <Link href="/digital-skills" className="dashboard-nav-link" onClick={() => setSidebarOpen(false)}><span>&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className="dashboard-nav-link" onClick={() => setSidebarOpen(false)}><span>◈</span>Entrepreneurship</Link>
          <Link href="/ai" className="dashboard-nav-link" onClick={() => setSidebarOpen(false)}><span>✦</span>CEO JACK AI</Link>
        </nav>
        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-sidebar-card"><span>✦ YOUR NEXT STEP</span><strong>One lesson at a time.</strong><p>Keep exploring and build a learning routine that works for you.</p><Link href="/how-it-works">How the hub works <span>→</span></Link></div>
          <Link href="/" className="dashboard-site-link"><span>↗</span> Visit the main website</Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="dashboard-menu" type="button" aria-label={sidebarOpen ? "Close navigation" : "Open navigation"} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}><span /><span /><span /></button>
          <div className="dashboard-breadcrumb">Learning Space <span>/</span> My dashboard</div>
          <Link href="/ai" className="dashboard-top-action"><span>✦</span> Ask CEO JACK AI</Link>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-hero">
            <div className="dashboard-hero-copy">
              <div className="dashboard-eyebrow"><i /> YOUR LEARNING JOURNEY</div>
              <h1>Welcome to your learning hub<span> ✦</span></h1>
              <p>Your next big step starts with a small one. Pick up where you left off or explore something new.</p>
              <div className="dashboard-hero-actions">
                <Link href={lessonComplete ? `/education?level=${levelQuery}` : "/lesson"} className="dashboard-primary-cta">{lessonComplete ? "Choose your next lesson" : "Continue learning"}<span>→</span></Link>
                <Link href="#learning-paths" className="dashboard-text-cta">Explore learning areas <span>↓</span></Link>
              </div>
            </div>
            <div className="dashboard-hero-art" aria-hidden="true"><div className="dashboard-art-orbit orbit-a" /><div className="dashboard-art-orbit orbit-b" /><div className="dashboard-art-center">✦</div><span className="art-chip chip-book">▤</span><span className="art-chip chip-code">&lt;/&gt;</span><span className="art-chip chip-spark">✧</span></div>
          </section>

          <section className="dashboard-overview" aria-label="Your learning overview">
            <article className="overview-card overview-progress"><span className="overview-icon">◷</span><div><span className="overview-label">YOUR MOMENTUM</span><strong>{lessonComplete ? "1 lesson" : "Start today"}</strong><small>{lessonComplete ? "You’ve completed your first lesson" : "Your learning journey is ready"}</small></div></article>
            <article className="overview-card"><span className="overview-icon blue">▤</span><div><span className="overview-label">LEARNING AREAS</span><strong>4 paths</strong><small>Choose what you want to explore</small></div></article>
            <article className="overview-card"><span className="overview-icon green">◎</span><div><span className="overview-label">YOUR LEARNING LEVEL</span><strong>{profile?.level || "Choose your path"}</strong><small>{profile?.ageGroup ? `Age group ${profile.ageGroup}` : "Personalize your experience"}</small></div></article>
          </section>

          <section className="dashboard-next-section" aria-labelledby="next-lesson-title">
            <div className="dashboard-section-heading"><div><span className="section-kicker">PICK UP WHERE YOU LEFT OFF</span><h2 id="next-lesson-title">Your next step</h2></div><span className="dashboard-step-count">{completedCount ? "1 lesson completed" : "A great place to begin"}</span></div>
            <article className="next-lesson-card">
              <div className="next-lesson-symbol">∑</div>
              <div className="next-lesson-info"><span className="lesson-tag">P7 MATHEMATICS <i /> ABOUT 8 MIN</span><h3>Equivalent fractions</h3><p>Learn how fractions can look different and still represent the same amount.</p><div className="lesson-progress-row"><span className={`lesson-progress-track${lessonComplete ? " complete" : ""}`}><i /></span><span>{lessonComplete ? "Complete" : "Ready when you are"}</span></div></div>
              <Link href="/lesson" className="lesson-open-button">{lessonComplete ? "Review lesson" : "Start lesson"}<span>→</span></Link>
            </article>
          </section>

          <section className="dashboard-paths-section" id="learning-paths" aria-labelledby="learning-paths-title">
            <div className="dashboard-section-heading"><div><span className="section-kicker">LEARN. CREATE. DEVELOP.</span><h2 id="learning-paths-title">Explore your learning areas</h2><p>Follow what interests you, or try something completely new.</p></div><Link className="all-paths-link" href="/how-it-works">See how it works <span>→</span></Link></div>
            <div className="learning-path-grid">
              {paths.map((path) => (
                <Link key={path.title} href={path.href} className={`learning-path-card ${path.tone}${path.title === recommendedPath.title ? " recommended" : ""}`}>
                  <div className="path-card-top"><span className="path-icon">{path.icon}</span>{path.title === recommendedPath.title ? <span className="path-recommended">A good match for you</span> : <span className="path-arrow">↗</span>}</div>
                  <span className="path-eyebrow">{path.eyebrow}</span><h3>{path.title}</h3><p>{path.description}</p><span className="path-action">{path.action}<b>→</b></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="dashboard-personalize">
            <div className="personalize-mark">✦</div><div className="personalize-copy"><span className="section-kicker">MAKE IT YOURS</span><h2>{profile ? "Your learning path is set up" : "Get a learning path made for you"}</h2><p>{profile ? `Your interests: ${(profile.interests ?? []).join(", ") || "ready to explore"}. You can revisit your choices any time.` : "Tell us what you’re interested in and we’ll help you find a place to start."}</p></div><Link href="/onboarding" className="personalize-link">{profile ? "Update my path" : "Personalize my path"}<span>→</span></Link>
          </section>

          <footer className="dashboard-footer"><Link href="/">CEO JACK LEARNING HUB</Link><span>Learn. Create. Develop.</span><Link href="/contact">Need help? Contact us</Link></footer>
        </div>
      </main>
    </div>
  );
}
