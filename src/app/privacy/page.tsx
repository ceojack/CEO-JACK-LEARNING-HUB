import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import "@/src/styles/legal.css";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <Link className="legal-back" href="/">← Back to home</Link>
        <span className="legal-kicker">CEO JACK LEARNING HUB</span>
        <h1>Privacy Policy</h1>
        <p className="legal-lead">This page explains what information the current Learning Hub prototype uses, why it is used, and what choices you have.</p>
        <p className="legal-updated">Last updated: <time dateTime="2026-10-28">28 October 2026</time></p>
        <div className="legal-copy">
          <section aria-labelledby="privacy-controller">
            <h2 id="privacy-controller">1. Who is responsible</h2>
            <p>CEO JACK LEARNING HUB operates this website. For privacy questions or requests, contact <a href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a>. We are based in Uganda and aim to handle personal information in line with applicable data protection law, including Uganda’s <a href="https://ict.go.ug/ims/public/site/documents/Data-Protection-and-Privacy-Act-2019.pdf" target="_blank" rel="noreferrer">Data Protection and Privacy Act, 2019</a>.</p>
          </section>
          <section aria-labelledby="privacy-information">
            <h2 id="privacy-information">2. Information the site uses</h2>
            <ul>
              <li><strong>Account form:</strong> your name and email address are saved in this browser to personalize the prototype. Passwords entered in the form are not saved as accounts or checked against a password database.</li>
              <li><strong>Onboarding:</strong> your learning level, age group, interests and goals are saved in this browser so the dashboard can suggest a learning path.</li>
              <li><strong>Lesson progress:</strong> completion for the sample lesson is saved in this browser.</li>
              <li><strong>AI companion:</strong> if live AI service is enabled, the message you send and up to the ten most recent chat messages may be sent to our server and then to Groq to generate a reply. Avoid sharing personal, sensitive or confidential information.</li>
              <li><strong>Voice input:</strong> dictation uses speech recognition provided by your browser or device. Its handling of audio or speech data is governed by that provider’s privacy terms.</li>
              <li><strong>Contact:</strong> the contact form prepares an email in your device’s mail application. The website does not submit or store that message itself.</li>
            </ul>
          </section>
          <section aria-labelledby="privacy-purpose">
            <h2 id="privacy-purpose">3. Why we use it</h2>
            <p>Information is used to display your selected profile and learning progress in the same browser, respond to AI requests when enabled, and help you contact us. The prototype does not currently use Supabase or another account database to sync this information between devices.</p>
          </section>
          <section aria-labelledby="privacy-storage">
            <h2 id="privacy-storage">4. Storage, providers and retention</h2>
            <p>Profile and lesson information is stored in your browser’s local storage. Anyone with access to the same browser profile may be able to see it. You can remove it by clearing this site’s browser storage. If live AI is enabled, your prompt is processed by Groq; the provider’s own policies apply to its processing. The website does not currently provide a server-side account deletion or data export feature. Website hosting may also process basic technical information needed to deliver and protect the service.</p>
          </section>
          <section aria-labelledby="privacy-sharing">
            <h2 id="privacy-sharing">5. When information is shared</h2>
            <p>We do not sell personal information. Information is shared only when needed to provide a feature you request (such as sending an AI prompt to Groq), to operate and secure the website through service providers, or when disclosure is required by law.</p>
          </section>
          <section aria-labelledby="privacy-children">
            <h2 id="privacy-children">6. Children and young learners</h2>
            <p>The site is intended for learners, including young people. A parent or guardian should review the site and give permission before a child’s personal information is submitted. Our current prototype does not verify a parent or guardian’s consent. Parents or guardians can contact us with questions or requests about a child’s information.</p>
          </section>
          <section aria-labelledby="privacy-rights">
            <h2 id="privacy-rights">7. Your choices and requests</h2>
            <p>You can clear profile and progress details from your browser storage. Under applicable law, you may ask about personal information held about you and request access, correction or deletion where those rights apply. Email <a href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a>. We may need to verify your identity before responding. You can also raise a concern with Uganda’s Personal Data Protection Office.</p>
          </section>
          <section aria-labelledby="privacy-security">
            <h2 id="privacy-security">8. Security</h2>
            <p>We take reasonable steps to protect the service, but no website or browser storage can be guaranteed completely secure. Do not use a shared device without signing out of your browser profile, and do not put passwords or sensitive personal information in contact messages or AI chats.</p>
          </section>
          <section aria-labelledby="privacy-changes">
            <h2 id="privacy-changes">9. Changes to this policy</h2>
            <p>We will update this page when the website’s data practices change. If we add server accounts, Supabase, Google sign-in, analytics or other data processing, we will revise this policy to describe the information involved and the choices available before relying on those features.</p>
          </section>
          <section aria-labelledby="privacy-contact">
            <h2 id="privacy-contact">10. Contact</h2>
            <p>For a privacy question or request, email <a href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a> or visit our <Link href="/contact">contact page</Link>. You may also contact Uganda’s <a href="https://pdpo.go.ug/" target="_blank" rel="noreferrer">Personal Data Protection Office</a>.</p>
          </section>
          <p className="legal-related">See also our <Link href="/terms">Terms of Use</Link>.</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
