import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="container section">
      <h1>Privacy Policy</h1>
      <p className="muted">CEO JACK LEARNING HUB collects account details you provide so we can personalize learning. Do not share passwords in contact forms.</p>
      <p><Link href="/">Back home</Link></p>
    </main>
  );
}
