import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import "@/src/styles/legal.css";

export const metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <Link className="legal-back" href="/">← Back to home</Link>
        <span className="legal-kicker">CEO JACK LEARNING HUB</span>
        <h1>Terms of Use</h1>
        <p className="legal-lead">These terms explain how to use our learning website and what you can expect from it.</p>
        <p className="legal-updated">Last updated: <time dateTime="2026-10-28">28 October 2026</time></p>
        <div className="legal-copy">
          <section aria-labelledby="terms-acceptance">
            <h2 id="terms-acceptance">1. Using the Learning Hub</h2>
            <p>By visiting or using CEO JACK LEARNING HUB, you agree to these terms. If you do not agree, please stop using the website. “We,” “us” and “our” mean CEO JACK LEARNING HUB; “you” means a visitor or learner using the site.</p>
          </section>
          <section aria-labelledby="terms-service">
            <h2 id="terms-service">2. What the service provides</h2>
            <p>The site offers educational and informational content across Education, Digital Skills and Entrepreneurship, along with learning activities and an AI learning companion. Features may change as the service develops. Lessons and AI responses are general learning support, may contain mistakes, and are not a substitute for advice from a qualified teacher or professional.</p>
          </section>
          <section aria-labelledby="terms-account">
            <h2 id="terms-account">3. Accounts and learner information</h2>
            <p>Keep your sign-in details private and provide accurate information when using account forms. You are responsible for activity carried out through your account and should tell us if you think someone else has accessed it. Account sign-in and progress features are currently a prototype and may not provide secure, server-backed accounts or sync between devices.</p>
          </section>
          <section aria-labelledby="terms-young-learners">
            <h2 id="terms-young-learners">4. Children and young learners</h2>
            <p>If you are under 18, ask a parent or guardian to review these terms and supervise your use of the site. A parent or guardian must give permission before a child’s personal data is submitted. Do not share your home address, school, passwords, phone number, precise location or other sensitive details in lessons or AI chats.</p>
          </section>
          <section aria-labelledby="terms-acceptable-use">
            <h2 id="terms-acceptable-use">5. Acceptable use</h2>
            <p>Use the site lawfully and respectfully. Do not try to disrupt the service, access another person’s account or data, upload malicious code, misuse the AI feature, or copy and redistribute material in a way that violates someone’s rights.</p>
          </section>
          <section aria-labelledby="terms-content">
            <h2 id="terms-content">6. Content and ownership</h2>
            <p>Unless a page says otherwise, the site’s name, design and original learning materials belong to CEO JACK LEARNING HUB or the people who license them to us. You may use the materials for your own personal learning. Ask for permission before republishing or commercially reusing them. You keep ownership of original content you submit, while allowing us to process it only as needed to provide the feature you chose.</p>
          </section>
          <section aria-labelledby="terms-third-party">
            <h2 id="terms-third-party">7. External services</h2>
            <p>The site may link to third-party websites or send an AI prompt to an external AI provider when that feature is enabled. Those services have their own terms and privacy practices. Review them before sharing information, and do not include confidential or sensitive details in AI prompts.</p>
          </section>
          <section aria-labelledby="terms-availability">
            <h2 id="terms-availability">8. Availability and changes</h2>
            <p>We work to keep the site useful, but cannot promise it will always be available, uninterrupted or error-free. We may update features or these terms. When we make a significant change, we will update the date on this page. Continued use after the updated terms take effect means you accept the revised terms.</p>
          </section>
          <section aria-labelledby="terms-law">
            <h2 id="terms-law">9. Governing law</h2>
            <p>These terms are governed by the laws of Uganda, subject to any consumer protections that apply to you and cannot legally be excluded.</p>
          </section>
          <section aria-labelledby="terms-contact">
            <h2 id="terms-contact">10. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a> or use our <Link href="/contact">contact page</Link>.</p>
          </section>
          <p className="legal-related">See also our <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
