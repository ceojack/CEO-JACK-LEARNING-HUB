"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";
import "@/src/styles/about.css";

export default function AboutPage() {
  useReveal();

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/about" />
      <main>
        <section className="about-hero section">
          <div className="container about-hero-grid">
            <div className="hero-copy reveal">
              <span className="section-label">ABOUT CEO JACK</span>
              <h1>
                Built for people
                <span> building their future.</span>
              </h1>
              <p className="hero-lead">
                CEO JACK LEARNING HUB is a connected learning platform built around one simple philosophy:{" "}
                <strong>Learn. Create. Develop.</strong>
              </p>
              <p className="hero-support">
                We bring education, digital skills and entrepreneurship into one experience so learning can move from knowledge to practical action.
              </p>
              <div className="hero-actions">
                <Link href="/get-started" className="btn btn-primary get-started-button">
                  Get Started Free <span>→</span>
                </Link>
                <Link href="/" className="btn btn-secondary">
                  Explore the Hubs
                </Link>
              </div>
            </div>
            <div className="about-visual reveal reveal-delay">
              <div className="visual-card">
                <div className="visual-top">
                  <span>CEO JACK LEARNING HUB</span>
                  <span className="status">
                    <b />
                    Connected
                  </span>
                </div>
                <div className="visual-center">
                  <div className="center-ring ring-one" />
                  <div className="center-ring ring-two" />
                  <div className="center-core">
                    <strong>CJ</strong>
                    <small>LEARN</small>
                    <small>CREATE</small>
                    <small>DEVELOP</small>
                  </div>
                </div>
                <div className="visual-labels">
                  <span>Education</span>
                  <span>Digital Skills</span>
                  <span>Entrepreneurship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section purpose-section">
          <div className="container">
            <div className="section-heading reveal">
              <span className="section-label">WHY CEO JACK EXISTS</span>
              <h2>
                Learning should lead
                <span> somewhere.</span>
              </h2>
              <p>The goal is not simply to finish another lesson. It is to understand something, use it, build confidence and take the next step.</p>
            </div>
            <div className="purpose-grid">
              <article className="purpose-card reveal">
                <span className="card-number">01</span>
                <div className="card-icon">◎</div>
                <h3>Learn with purpose</h3>
                <p>Build strong foundations through structured learning, useful explanations and guided progress.</p>
              </article>
              <article className="purpose-card featured reveal reveal-delay">
                <span className="card-number">02</span>
                <div className="card-icon">&lt;/&gt;</div>
                <h3>Turn knowledge into action</h3>
                <p>Practise what you learn through digital skills, projects, problem-solving and experimentation.</p>
              </article>
              <article className="purpose-card reveal reveal-delay-2">
                <span className="card-number">03</span>
                <div className="card-icon">↗</div>
                <h3>Develop your future</h3>
                <p>Grow your thinking, confidence, creativity and awareness of opportunities around you.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section story-section">
          <div className="container story-grid">
            <div className="story-copy reveal">
              <span className="section-label">OUR STORY</span>
              <h2>
                Why CEO JACK
                <span> exists.</span>
              </h2>
              <p>Technology is changing how people learn, work, create businesses and solve problems.</p>
              <p>CEO JACK LEARNING HUB was designed to bring learning, practical creation, digital skills and personal development into one connected experience.</p>
              <p>Instead of learning something and stopping there, the platform encourages learners to turn knowledge into action.</p>
            </div>
            <aside className="story-card reveal reveal-delay">
              <span className="quote-mark">“</span>
              <h3>
                Learn something.
                <br />
                Create something.
                <br />
                Develop yourself.
              </h3>
              <p>Progress becomes more meaningful when knowledge can be applied.</p>
              <span className="story-line">CEO JACK LEARNING HUB</span>
            </aside>
          </div>
        </section>

        <section className="section hubs-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="section-label">THE PRODUCT</span>
              <h2>
                Three hubs.
                <span> One journey.</span>
              </h2>
              <p>Each hub solves a different part of learner development while the experience remains connected.</p>
            </div>
            <div className="hub-grid">
              <article className="hub-card education reveal">
                <div className="hub-top">
                  <span>01</span>
                  <b>LEARN</b>
                </div>
                <div className="hub-icon">▦</div>
                <h3>Education Hub</h3>
                <p>Structured academic learning through classes, subjects, topics, lessons, practice and progress.</p>
                <Link href="/education">Explore Education →</Link>
              </article>
              <article className="hub-card skills reveal reveal-delay">
                <div className="hub-top">
                  <span>02</span>
                  <b>CREATE</b>
                </div>
                <div className="hub-icon">&lt;/&gt;</div>
                <h3>Digital Skills Hub</h3>
                <p>Practical technology learning through coding, web development, programming, AI and projects.</p>
                <Link href="/digital-skills">Explore Digital Skills →</Link>
              </article>
              <article className="hub-card business reveal reveal-delay-2">
                <div className="hub-top">
                  <span>03</span>
                  <b>DEVELOP</b>
                </div>
                <div className="hub-icon">↗</div>
                <h3>Entrepreneurship Hub</h3>
                <p>Business thinking, financial literacy and opportunity-focused development for the future.</p>
                <Link href="/entrepreneurship">Explore Entrepreneurship →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section ecosystem-section">
          <div className="container ecosystem-grid">
            <div className="ecosystem-copy reveal">
              <span className="section-label">THE ECOSYSTEM</span>
              <h2>
                One account.
                <span> Many possibilities.</span>
              </h2>
              <p>CEO JACK is designed as a connected ecosystem rather than a collection of unrelated pages.</p>
              <p>As the platform grows, a learner&apos;s experience can become more personalized around their interests, goals and stage of development.</p>
              <div className="ecosystem-points">
                <div>
                  <b>01</b>
                  <span>Personalized learning</span>
                </div>
                <div>
                  <b>02</b>
                  <span>Practical digital skills</span>
                </div>
                <div>
                  <b>03</b>
                  <span>Project and creative development</span>
                </div>
                <div>
                  <b>04</b>
                  <span>Entrepreneurship and financial thinking</span>
                </div>
              </div>
            </div>
            <div className="ecosystem-map reveal reveal-delay">
              <div className="map-line line-one" />
              <div className="map-line line-two" />
              <div className="map-line line-three" />
              <div className="map-node node-center">
                <strong>CJ</strong>
                <small>LEARNER</small>
              </div>
              <div className="map-node node-education">
                <strong>01</strong>
                <small>EDUCATION</small>
              </div>
              <div className="map-node node-skills">
                <strong>02</strong>
                <small>SKILLS</small>
              </div>
              <div className="map-node node-business">
                <strong>03</strong>
                <small>BUSINESS</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section ai-role-section">
          <div className="container ai-role-panel reveal">
            <div className="ai-role-icon">✦</div>
            <div className="ai-role-copy">
              <span className="section-label">CEO JACK AI</span>
              <h2>A companion across the journey.</h2>
              <p>CEO JACK AI can help learners understand concepts, ask questions, explore ideas and get guidance while they move through the platform.</p>
            </div>
            <Link href="/ai" className="btn btn-light">
              Explore CEO JACK AI →
            </Link>
          </div>
        </section>

        <section className="section vision-section">
          <div className="container vision-box reveal">
            <span className="section-label">OUR VISION</span>
            <h2>
              Building people who don&apos;t just consume technology —
              <span> they create with it.</span>
            </h2>
            <p>The long-term vision of CEO JACK LEARNING HUB is to become a place where learners can acquire knowledge, develop practical skills, experiment with ideas and build things that matter.</p>
            <Link href="/get-started" className="btn btn-primary get-started-button">
              Get Started Free <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
