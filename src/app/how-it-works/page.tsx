"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";
import "../homepage.css";

export default function HowItWorksPage() {
  useReveal();

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/how-it-works" />
      <main>
        <section className="section how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="section-label">HOW IT WORKS</span>
              <h2>Your journey starts simple.</h2>
              <p>Four steps from signing up to building your own path.</p>
            </div>
            <div className="steps">
              <article className="step reveal">
                <span>01</span>
                <div>
                  <h3>Create your account</h3>
                  <p>Start with a free account and enter your learning space.</p>
                </div>
              </article>
              <article className="step reveal reveal-delay">
                <span>02</span>
                <div>
                  <h3>Tell us your goals</h3>
                  <p>Choose your interests, level and the areas you want to develop.</p>
                </div>
              </article>
              <article className="step reveal reveal-delay-2">
                <span>03</span>
                <div>
                  <h3>Choose your path</h3>
                  <p>Explore Education, Digital Skills or Entrepreneurship — or combine them.</p>
                </div>
              </article>
              <article className="step reveal reveal-delay-3">
                <span>04</span>
                <div>
                  <h3>Keep developing</h3>
                  <p>Learn, practise, track progress and keep moving forward.</p>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="section final-section">
          <div className="container">
            <div className="final-card reveal">
              <span className="section-label">YOUR NEXT STEP</span>
              <h2>Ready to learn, create and develop?</h2>
              <p>Start free and build a learning journey around your goals.</p>
              <Link href="/get-started" className="btn btn-primary large">
                Get Started Free <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
