import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, textAlign: "center" }}>
      <div>
        <p style={{ color: "#bac6cd", letterSpacing: "0.12em", fontSize: 12 }}>404</p>
        <h1 style={{ fontSize: 42, margin: "12px 0 16px" }}>This page is still being built.</h1>
        <p style={{ color: "#bac6cd", maxWidth: 480, margin: "0 auto 28px" }}>
          The route you opened is not available yet. Head back to the Learning Hub and continue from there.
        </p>
        <Link href="/" className="primary-button">
          Back to home
        </Link>
      </div>
    </main>
  );
}
