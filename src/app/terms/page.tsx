import Link from "next/link";
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
        <p className="legal-lead">A few shared expectations help keep this a useful place to learn.</p>
        <div className="legal-copy">
          <p>Use CEO JACK LEARNING HUB for learning, creating and developing. Respect other learners and keep your account details private.</p>
        </div>
      </article>
    </main>
  );
}
