import Link from "next/link";

export const metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <main className="container section">
      <h1>Terms of Use</h1>
      <p className="muted">Use CEO JACK LEARNING HUB for learning, creating and developing. Respect other learners and keep your account details private.</p>
      <p><Link href="/">Back home</Link></p>
    </main>
  );
}
