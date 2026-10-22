"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";
import "@/src/styles/contact.css";

const CONTACT_EMAIL = "hello@ceojacklearninghub.com";

export default function ContactPage() {
  useReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email.";
    if (!subject) nextErrors.subject = "Select a subject.";
    if (message.trim().length < 10) nextErrors.message = "Write at least 10 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("Please check the highlighted fields.");
      return;
    }

    const body = [`Name: ${name.trim()}`, `Email: ${email.trim()}`, "", message.trim()].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app should open with the message prepared.");
  }

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/contact" />
      <main>
        <section className="contact-hero section">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                GET IN TOUCH
              </span>
              <h1>
                Let&apos;s start a
                <span> conversation.</span>
              </h1>
              <p className="hero-lead">
                Have a question, suggestion, idea or feedback? We want to hear from you as CEO JACK LEARNING HUB grows.
              </p>
              <div className="contact-points">
                <a className="contact-point" href={`mailto:${CONTACT_EMAIL}`}>
                  <span className="point-icon" aria-hidden="true">@</span>
                  <span>
                    <strong>Email</strong>
                    <small>{CONTACT_EMAIL}</small>
                  </span>
                  <span className="point-arrow" aria-hidden="true">↗</span>
                </a>
                <div className="contact-point">
                  <span className="point-icon" aria-hidden="true">?</span>
                  <span>
                    <strong>Platform support</strong>
                    <small>Questions about learning or using the platform</small>
                  </span>
                </div>
                <div className="contact-point">
                  <span className="point-icon" aria-hidden="true">✦</span>
                  <span>
                    <strong>Ideas &amp; feedback</strong>
                    <small>Share ways we can make the experience better</small>
                  </span>
                </div>
              </div>
            </div>
            <div className="contact-visual reveal reveal-delay" aria-label="Connect, share ideas and start a conversation">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-orbit orbit-three" />
              <div className="visual-core">
                <span className="core-symbol">✦</span>
                <strong>CONNECT</strong>
                <small>START A CONVERSATION</small>
              </div>
              <span className="signal signal-one">MESSAGE</span>
              <span className="signal signal-two">IDEA</span>
              <span className="signal signal-three">FEEDBACK</span>
            </div>
          </div>
        </section>

        <section className="contact-section section" id="send-message">
          <div className="container contact-grid">
            <div className="form-column reveal">
              <div className="section-heading">
                <span className="section-label">SEND A MESSAGE</span>
                <h2>
                  Tell us what&apos;s
                  <span> on your mind.</span>
                </h2>
                <p>Complete the form and your email application will open with your message prepared.</p>
              </div>
              <form className="contact-form" noValidate onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className={`form-group${errors.name ? " invalid" : ""}`}>
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" type="text" placeholder="Enter your name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                    <small className="error-message">{errors.name}</small>
                  </div>
                  <div className={`form-group${errors.email ? " invalid" : ""}`}>
                    <label htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <small className="error-message">{errors.email}</small>
                  </div>
                </div>
                <div className={`form-group${errors.subject ? " invalid" : ""}`}>
                  <label htmlFor="subject">What is this about?</label>
                  <select id="subject" name="subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
                    <option value="">Select a subject</option>
                    <option value="General question">General question</option>
                    <option value="Technical support">Technical support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Partnership">Partnership or collaboration</option>
                    <option value="Suggestion or idea">Suggestion or idea</option>
                  </select>
                  <small className="error-message">{errors.subject}</small>
                </div>
                <div className={`form-group${errors.message ? " invalid" : ""}`}>
                  <div className="label-row">
                    <label htmlFor="message">Your message</label>
                    <span>{message.length} / 1000</span>
                  </div>
                  <textarea id="message" name="message" rows={7} maxLength={1000} placeholder="Tell us how we can help..." value={message} onChange={(event) => setMessage(event.target.value)} />
                  <small className="error-message">{errors.message}</small>
                </div>
                <button type="submit" className="submit-btn">
                  <span>Prepare email</span>
                  <span aria-hidden="true">→</span>
                </button>
                <p className="form-status" role="status" aria-live="polite">{status}</p>
                <p className="privacy-note">Please don&apos;t include passwords or other sensitive information.</p>
              </form>
            </div>
            <aside className="contact-sidebar reveal reveal-delay">
              <div className="side-card feature-card">
                <span className="section-label">CEO JACK LEARNING HUB</span>
                <h3>Good communication builds better experiences.</h3>
                <p>Your questions, suggestions and feedback help us understand what learners need as the platform develops.</p>
                <div className="mini-rule" />
                <p className="side-motto">Learn. Create. Develop.</p>
              </div>
              <div className="side-card quick-card">
                <span className="section-label">EXPLORE MORE</span>
                <Link href="/about"><span>Learn about us</span><span>↗</span></Link>
                <Link href="/services"><span>Explore our services</span><span>↗</span></Link>
                <Link href="/#hubs"><span>Discover the three hubs</span><span>↗</span></Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="cta-section section">
          <div className="container cta-box reveal">
            <span className="section-label">YOUR NEXT STEP</span>
            <h2>
              Learn. Create.
              <span> Develop.</span>
            </h2>
            <p>Your journey can begin today. Explore the platform and choose the path that fits your goals.</p>
            <Link href="/get-started" className="btn btn-primary">
              Get Started Free <span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
