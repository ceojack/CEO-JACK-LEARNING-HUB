"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";
import "@/src/styles/services.css";

export default function ServicesPage() {
  useReveal();

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/services" />
      <main>
        <section className="services-hero section">
          <div className="container services-hero-grid">
            <div className="hero-copy reveal">
              <span className="section-label">WHAT WE OFFER</span>
              <h1>
                Everything you need to
                <span> keep moving forward.</span>
              </h1>
              <p className="hero-lead">
                CEO JACK LEARNING HUB brings learning, practical digital skills, entrepreneurship and AI support together in one connected platform.
              </p>
              <div className="hero-actions">
                <Link href="/get-started" className="btn btn-primary get-started-button">
                  Get Started Free <span>→</span>
                </Link>
                <a href="#services" className="btn btn-secondary">
                  Explore Services
                </a>
              </div>
            </div>
            <div className="services-visual reveal reveal-delay">
              <div className="visual-card">
                <div className="visual-top">
                  <span>CEO JACK ECOSYSTEM</span>
                  <span className="status">
                    <b />
                    Learning in motion
                  </span>
                </div>
                <div className="service-orbit">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="orbit orbit-three" />
                  <div className="orbit-node node-education">EDU</div>
                  <div className="orbit-node node-skills">SKILLS</div>
                  <div className="orbit-node node-business">BUSINESS</div>
                  <div className="visual-core">
                    <strong>CJ</strong>
                    <small>LEARN</small>
                    <small>CREATE</small>
                    <small>DEVELOP</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="section-label">CORE SERVICES</span>
              <h2>
                Three pathways.
                <span> One ecosystem.</span>
              </h2>
              <p>Start with what you need today and grow into the other areas as your goals develop.</p>
            </div>
            <div className="service-grid">
              <article className="service-card education reveal">
                <div className="service-number">01</div>
                <div className="service-icon">▦</div>
                <span className="service-tag">LEARN</span>
                <h3>Education Hub</h3>
                <p>A structured learning environment for academic development, subjects, topics, lessons, practice and progress.</p>
                <ul>
                  <li>Class and subject pathways</li>
                  <li>Topic-based learning</li>
                  <li>Lessons and practice</li>
                  <li>Learning progress</li>
                </ul>
                <Link href="/education">Explore Education →</Link>
              </article>
              <article className="service-card skills reveal reveal-delay">
                <div className="service-number">02</div>
                <div className="service-icon">&lt;/&gt;</div>
                <span className="service-tag">CREATE</span>
                <h3>Digital Skills Hub</h3>
                <p>Practical technology learning designed to help learners move from consuming technology to creating with it.</p>
                <ul>
                  <li>Web development</li>
                  <li>Programming and coding</li>
                  <li>AI and digital tools</li>
                  <li>Practical projects</li>
                </ul>
                <Link href="/digital-skills">Explore Digital Skills →</Link>
              </article>
              <article className="service-card business reveal reveal-delay-2">
                <div className="service-number">03</div>
                <div className="service-icon">↗</div>
                <span className="service-tag">DEVELOP</span>
                <h3>Entrepreneurship Hub</h3>
                <p>Build business awareness and financial thinking while learning how ideas can become useful opportunities.</p>
                <ul>
                  <li>Business ideas</li>
                  <li>Financial literacy</li>
                  <li>Entrepreneurial thinking</li>
                  <li>Opportunity discovery</li>
                </ul>
                <Link href="/entrepreneurship">Explore Entrepreneurship →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section support-section">
          <div className="container">
            <div className="section-heading reveal">
              <span className="section-label">SUPPORTING SERVICES</span>
              <h2>
                More than lessons.
                <span> A complete learning experience.</span>
              </h2>
              <p>The three hubs are the foundation. Supporting tools help learners understand, practise, organize and continue their development.</p>
            </div>
            <div className="support-grid">
              <article className="support-card reveal">
                <div className="support-icon">✦</div>
                <div>
                  <h3>CEO JACK AI</h3>
                  <p>Ask questions, clarify concepts, explore ideas and get learning guidance.</p>
                  <Link href="/ai">Explore AI →</Link>
                </div>
              </article>
              <article className="support-card reveal reveal-delay">
                <div className="support-icon">✓</div>
                <div>
                  <h3>Progress & Goals</h3>
                  <p>Keep track of learning activity, completed work and development goals.</p>
                  <Link href="/get-started">Start Learning →</Link>
                </div>
              </article>
              <article className="support-card reveal reveal-delay-2">
                <div className="support-icon">⌘</div>
                <div>
                  <h3>Projects & Practice</h3>
                  <p>Turn knowledge into practical work through projects, exercises and creation.</p>
                  <Link href="/get-started">Build Something →</Link>
                </div>
              </article>
              <article className="support-card reveal">
                <div className="support-icon">◎</div>
                <div>
                  <h3>Personalized Journey</h3>
                  <p>Build an experience around your interests, goals and chosen learning path.</p>
                  <Link href="/get-started">Create Your Path →</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section journey-section">
          <div className="container journey-grid">
            <div className="journey-copy reveal">
              <span className="section-label">HOW THE SERVICES CONNECT</span>
              <h2>
                Learn something.
                <span> Use it. Build with it.</span>
              </h2>
              <p>
                CEO JACK is designed to make development feel connected. Academic knowledge can strengthen digital skills. Digital skills can support projects. Business thinking can help turn useful skills into opportunities.
              </p>
            </div>
            <div className="journey-steps reveal reveal-delay">
              <div className="journey-step">
                <span>01</span>
                <div>
                  <strong>Learn</strong>
                  <small>Build knowledge and understanding.</small>
                </div>
              </div>
              <div className="journey-step">
                <span>02</span>
                <div>
                  <strong>Create</strong>
                  <small>Practise and turn knowledge into something real.</small>
                </div>
              </div>
              <div className="journey-step">
                <span>03</span>
                <div>
                  <strong>Develop</strong>
                  <small>Grow your skills, thinking and future direction.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section cta-section">
          <div className="container cta-box reveal">
            <span className="section-label">YOUR NEXT STEP</span>
            <h2>
              Ready to start your
              <span> CEO JACK journey?</span>
            </h2>
            <p>Create your account and begin exploring the learning path that fits you.</p>
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
