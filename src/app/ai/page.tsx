"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/src/styles/ai.css";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Mode = "general" | "education" | "coding" | "business";

function AiChat() {
  const params = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("general");
  const [input, setInput] = useState(params.get("prompt") || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    const history = [...messages, { role: "user" as const, content: message }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          mode,
          history: history.map((item) => ({ role: item.role, content: item.content })),
        }),
      });
      const data = (await response.json()) as { reply?: string };
      setMessages([...history, { role: "assistant", content: data.reply || "No reply yet." }]);
    } catch {
      setMessages([...history, { role: "assistant", content: "The AI service is unavailable right now. Try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Link href="/" className="brand" aria-label="CEO JACK Home">
          <div className="brand-logo">CJ</div>
          <div>
            <strong>CEO JACK</strong>
            <span>LEARNING HUB</span>
          </div>
        </Link>
        <button className="new-chat" type="button" onClick={() => setMessages([])}>
          <span aria-hidden="true">＋</span> New conversation
        </button>
        <div className="sidebar-label">AI MODES</div>
        {(["general", "education", "coding", "business"] as const).map((item) => (
          <button key={item} className={`mode-link${mode === item ? " active" : ""}`} type="button" onClick={() => setMode(item)}>
            {item === "general" ? "✦ General Assistant" : item === "education" ? "📚 Education Mode" : item === "coding" ? "</> Coding Mode" : "◈ Business Mode"}
          </button>
        ))}
        <div className="sidebar-bottom">
          <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <button className="menu-btn" type="button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-title">
            <span className="eyebrow">YOUR AI COMPANION</span>
            <h1>CEO JACK AI</h1>
          </div>
        </header>
        <section className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="ai-orb" aria-hidden="true">✦</div>
              <p className="welcome-tag">LEARN. CREATE. DEVELOP.</p>
              <h2>What are we building<br />or learning today?</h2>
              <div className="prompt-grid">
                <button className="prompt-card" type="button" onClick={() => void send("Teach me HTML from the beginning with examples and a small exercise.")}>
                  <strong>Learn something</strong>
                  <small>Understand a topic step by step</small>
                </button>
                <button className="prompt-card" type="button" onClick={() => void send("Teach me JavaScript with a practical beginner project I can build today.")}>
                  <strong>Build with code</strong>
                  <small>Learn programming practically</small>
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((item, index) => (
                <article key={`${item.role}-${index}`} className={item.role === "user" ? "user-bubble" : "ai-bubble"}>
                  {item.content}
                </article>
              ))}
            </div>
          )}
        </section>
        <footer className="composer-wrap">
          <form className="composer" onSubmit={handleSubmit}>
            <textarea rows={1} maxLength={4000} placeholder="Message CEO JACK AI..." value={input} onChange={(event) => setInput(event.target.value)} aria-label="Your message" />
            <button type="submit" className="send-btn" aria-label="Send message" disabled={busy}>↑</button>
          </form>
        </footer>
      </main>
      {sidebarOpen ? <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} /> : null}
    </div>
  );
}

export default function AiPage() {
  return (
    <Suspense fallback={<p>Loading CEO JACK AI…</p>}>
      <AiChat />
    </Suspense>
  );
}
