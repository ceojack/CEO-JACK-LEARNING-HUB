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
        <p className="legal-lead">This page explains what information the Learning Hub uses, why it is used, and what choices you have.</p>
        <p className="legal-updated">Last updated: <time dateTime="2026-11-01">1 November 2026</time></p>
        <div className="legal-copy">
          <section aria-labelledby="privacy-controller">
            <h2 id="privacy-controller">1. Who is responsible</h2>
            <p>CEO JACK LEARNING HUB operates this website. For privacy questions or requests, contact <a href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a>. We are based in Uganda and aim to handle personal information in line with applicable data protection law, including Uganda’s <a href="https://ict.go.ug/ims/public/site/documents/Data-Protection-and-Privacy-Act-2019.pdf" target="_blank" rel="noreferrer">Data Protection and Privacy Act, 2019</a>.</p>
          </section>
          <section aria-labelledby="privacy-information">
            <h2 id="privacy-information">2. Information the site uses</h2>
            <ul>
              <li><strong>Account:</strong> when Supabase is configured, your email address and the name you provide are processed by Supabase Auth to create and secure your account. The website does not store your raw password. Account access is disabled when the service is not configured.</li>
              <li><strong>Onboarding:</strong> when Supabase is configured, your learning level, broad age group, interests and goals are saved to your account in the Learning Hub database. Without Supabase, these choices are saved in this browser for the local demo.</li>
              <li><strong>Lesson progress:</strong> when Supabase is configured, your sample lesson completion and score are saved to your account. Without Supabase, completion is saved in this browser.</li>
              <li><strong>AI companion:</strong> if live AI service is enabled, the message you send and up to the ten most recent chat messages may be sent to our server and then to Groq to generate a reply. Avoid sharing personal, sensitive or confidential information.</li>
              <li><strong>AI chat history and work plans:</strong> recent conversations and your current work plan are saved in local browser storage on the device you use. They are not synced to an account and remain there until you delete them or clear that browser’s site data.</li>
              <li><strong>Voice input:</strong> dictation uses speech recognition provided by your browser or device. Its handling of audio or speech data is governed by that provider’s privacy terms.</li>
              <li><strong>Contact:</strong> the contact form prepares an email in your device’s mail application. The website does not submit or store that message itself.</li>
            </ul>
          </section>
          <section aria-labelledby="privacy-purpose">
            <h2 id="privacy-purpose">3. Why we use it</h2>
            <p>Information is used to authenticate you, display your selected learning path and progress, respond to AI requests when enabled, and help you contact us. With Supabase configured, your profile and lesson progress are associated with your account and can be loaded on another device after you sign in.</p>
          </section>
          <section aria-labelledby="privacy-storage">
            <h2 id="privacy-storage">4. Storage, providers and retention</h2>
            <p>When Supabase is configured, Supabase Auth processes account credentials and the Learning Hub database stores your profile and lesson progress. Supabase may process this information on our behalf under its service terms. When Supabase is not configured, profile and lesson details use this browser’s local storage. AI conversation history and work plans remain in local storage in either mode. If live AI is enabled, your prompt is sent to our server and Groq to generate a reply. Website hosting may also process basic technical information needed to deliver and protect the service. Contact us to request account-data access or deletion; self-service account deletion and data export are not yet available.</p>
          </section>
          <section aria-labelledby="privacy-sharing">
            <h2 id="privacy-sharing">5. When information is shared</h2>
            <p>We do not sell personal information. Information is shared only when needed to provide a feature you request (such as sending an AI prompt to Groq), to operate and secure the website through service providers, or when disclosure is required by law.</p>
          </section>
          <section aria-labelledby="privacy-children">
            <h2 id="privacy-children">6. Children and young learners</h2>
            <p>The site is intended for learners, including young people. A parent or guardian should review the site and give permission before a child’s personal information is submitted. The Learning Hub does not currently verify a parent or guardian’s consent. Do not create an account or submit a child’s personal information until the required parent or guardian permission has been obtained. Parents or guardians can contact us with questions or requests about a child’s information.</p>
          </section>
          <section aria-labelledby="privacy-rights">
            <h2 id="privacy-rights">7. Your choices and requests</h2>
            <p>You can delete individual AI conversations and your work plan in CEO JACK AI. In local-demo mode, clear profile and progress from your browser storage. For account profile and progress data, or to request account deletion, email <a href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a>. Under applicable law, you may request access, correction or deletion where those rights apply. We may need to verify your identity before responding. You can also raise a concern with Uganda’s Personal Data Protection Office.</p>
          </section>
          <section aria-labelledby="privacy-security">
            <h2 id="privacy-security">8. Security</h2>
            <p>We take reasonable steps to protect the service, but no website or browser storage can be guaranteed completely secure. Do not use a shared device without signing out of your browser profile, and do not put passwords or sensitive personal information in contact messages or AI chats.</p>
          </section>
          <section aria-labelledby="privacy-changes">
            <h2 id="privacy-changes">9. Changes to this policy</h2>
            <p>We will update this page when the website’s data practices change, including when new account, analytics or other data services are enabled.</p>
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
