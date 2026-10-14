
"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";
import "./homepage.css";

export default function HomePage() {
  useReveal();

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="home" />

      <main>
        <section className="hero section" id="home">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span />A learning platform built for the future</div>
              <h1>Learn.<br /><em>Create.</em><br />Develop.</h1>
              <p className="hero-lead">
                One platform to learn, build practical skills, discover opportunities, and prepare for your future.
              </p>
              <div className="hero-actions">
                <Link href="/get-started" className="btn btn-primary">Get Started Free <span>→</span></Link>
                <a href="#hubs" className="btn btn-secondary">Explore the Hubs</a>
              </div>
              <div className="trust-row">
                <span>✓ Education</span>
                <span>✓ Digital Skills</span>
                <span>✓ Entrepreneurship</span>
              </div>
            </div>

            <div className="hero-product reveal reveal-delay">
              <div className="product-window">
                <div className="window-top">
                  <div className="window-dots"><i /><i /><i /></div>
                  <span>CEO JACK LEARNING HUB</span>
                  <span className="online"><b />Learning</span>
                </div>
                <div className="product-body">
                  <div className="preview-heading">
                    <small>YOUR LEARNING JOURNEY</small>
                    <h2>What will you develop today?</h2>
                  </div>
                  <div className="preview-grid">
                    <Link href="/education" className="preview-card education">
                      <div className="preview-icon">▦</div>
                      <div><strong>Education Hub</strong><p>Learn by class, subject and topic.</p></div>
                      <span>→</span>
                    </Link>
                    <Link href="/digital-skills" className="preview-card skills">
                      <div className="preview-icon">&lt;/&gt;</div>
                      <div><strong>Digital Skills</strong><p>Build practical technology skills.</p></div>
                      <span>→</span>
                    </Link>
                    <Link href="/entrepreneurship" className="preview-card business">
                      <div className="preview-icon">↗</div>
                      <div><strong>Entrepreneurship</strong><p>Turn ideas into opportunities.</p></div>
                      <span>→</span>
                    </Link>
                  </div>
                  <Link href="/ai" className="ai-preview">
                    <div className="ai-symbol">✦</div>
                    <div><small>CEO JACK AI</small><strong>Your learning companion</strong></div>
                    <span>Ask AI →</span>
                  </Link>
                </div>
              </div>
              <div className="floating-note note-one">Personalized learning</div>
              <div className="floating-note note-two">Learn • Build • Grow</div>
            </div>
          </div>
        </section>

        <section className="section why-section" id="about">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="section-label">WHY CEO JACK?</span>
              <h2>More than a place to study.</h2>
              <p>CEO JACK connects learning, practical skills and future-focused development in one clear journey.</p>
            </div>
            <div className="journey-grid">
              <article className="journey-card reveal">
                <div className="step-number">01</div><div className="journey-icon">◎</div>
                <h3>Learn with purpose</h3>
                <p>Build strong foundations through structured lessons, subjects and guided learning.</p>
              </article>
              <article className="journey-card featured reveal reveal-delay">
                <div className="step-number">02</div><div className="journey-icon">&lt;/&gt;</div>
                <h3>Build practical skills</h3>
                <p>Move beyond theory with digital skills, projects, coding and practical creation.</p>
              </article>
              <article className="journey-card reveal reveal-delay-2">
                <div className="step-number">03</div><div className="journey-icon">↗</div>
                <h3>Develop your future</h3>
                <p>Explore entrepreneurship, opportunities, personal growth and the skills that matter next.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section hubs-section" id="hubs">
          <div className="container">
            <div className="section-heading reveal">
              <span className="section-label">THE THREE HUBS</span>
              <h2>One platform.<br /><span>Three ways to grow.</span></h2>
              <p>Start where you are. Move between the hubs as your goals change. Your learning journey stays connected.</p>
            </div>
            <div className="hub-grid">
              <article className="hub-card hub-education reveal">
                <div className="hub-number">01</div><div className="hub-icon">▦</div>
                <span className="hub-tag">LEARN</span><h3>Education Hub</h3>
                <p>Structured learning for students from primary through secondary levels, with lessons, topics, practice and progress.</p>
                <Link href="/education">Explore Education <span>→</span></Link>
              </article>
              <article className="hub-card hub-skills reveal reveal-delay">
                <div className="hub-number">02</div><div className="hub-icon">&lt;/&gt;</div>
                <span className="hub-tag">CREATE</span><h3>Digital Skills Hub</h3>
                <p>Learn web development, programming, AI and other practical digital skills by building real things.</p>
                <Link href="/digital-skills">Build Digital Skills <span>→</span></Link>
              </article>
              <article className="hub-card hub-business reveal reveal-delay-2">
                <div className="hub-number">03</div><div className="hub-icon">↗</div>
                <span className="hub-tag">DEVELOP</span><h3>Entrepreneurship Hub</h3>
                <p>Develop business thinking, financial literacy and practical ideas that can grow into opportunities.</p>
                <Link href="/entrepreneurship">Explore Entrepreneurship <span>→</span></Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="section-label">HOW IT WORKS</span>
              <h2>Your journey starts simple.</h2>
              <p>Four steps from signing up to building your own path.</p>
            </div>
            <div className="steps">
              <article className="step reveal"><span>01</span><div><h3>Create your account</h3><p>Start with a free account and enter your learning space.</p></div></article>
              <article className="step reveal reveal-delay"><span>02</span><div><h3>Tell us your goals</h3><p>Choose your interests, level and the areas you want to develop.</p></div></article>
              <article className="step reveal reveal-delay-2"><span>03</span><div><h3>Choose your path</h3><p>Explore Education, Digital Skills or Entrepreneurship — or combine them.</p></div></article>
              <article className="step reveal reveal-delay-3"><span>04</span><div><h3>Keep developing</h3><p>Learn, practise, track progress and keep moving forward.</p></div></article>
            </div>
          </div>
        </section>

        <section className="section ai-section">
          <div className="container">
            <div className="ai-panel reveal">
              <div className="ai-copy">
                <span className="section-label">MEET CEO JACK AI</span>
                <h2>Stuck? Ask.<br />Curious? Explore.</h2>
                <p>CEO JACK AI is your learning companion. Ask questions, get explanations, explore ideas and receive help while you learn.</p>
                <Link href="/ai" className="btn btn-light">Explore CEO JACK AI →</Link>
              </div>
              <div className="ai-orb" aria-hidden="true">
                <div className="orb-ring ring-a" /><div className="orb-ring ring-b" /><div className="orb-core">✦</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section outcomes-section">
          <div className="container outcomes-grid">
            <div className="outcomes-copy reveal">
              <span className="section-label">THE CEO JACK PHILOSOPHY</span>
              <h2>Learn something.<br />Create something.<br />Develop yourself.</h2>
              <p>Education should not end when the lesson ends. Use what you learn, turn knowledge into skills, and use those skills to shape your future.</p>
              <Link href="/get-started" className="text-link">Start your journey <span>→</span></Link>
            </div>
            <div className="outcome-list reveal reveal-delay">
              <div><b>01</b><strong>Knowledge</strong><span>Understand the foundations.</span></div>
              <div><b>02</b><strong>Skills</strong><span>Practise and build.</span></div>
              <div><b>03</b><strong>Confidence</strong><span>Apply what you know.</span></div>
              <div><b>04</b><strong>Opportunity</strong><span>Develop your next step.</span></div>
            </div>
          </div>
        </section>

        <section className="section final-section" id="contact">
          <div className="container">
            <div className="final-card reveal">
              <span className="section-label">YOUR NEXT STEP</span>
              <h2>Ready to learn, create and develop?</h2>
              <p>Start free and build a learning journey around your goals.</p>
              <Link href="/get-started" className="btn btn-primary large">Get Started Free <span>→</span></Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
