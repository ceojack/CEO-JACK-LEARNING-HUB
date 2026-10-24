import Link from "next/link";
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
        <p className="legal-lead">Your privacy matters while you learn, create, and develop.</p>
        <div className="legal-copy">
          <p>CEO JACK LEARNING HUB collects account details you provide so we can personalize learning. Do not share passwords in contact forms.</p>
        </div>
      </article>
    </main>
  );
}
