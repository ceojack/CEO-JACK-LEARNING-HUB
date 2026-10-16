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
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history: nextMessages.slice(-10).map((item) => ({
            role: item.role === "assistant" ? "assistant" : "user",
            content: item.content,
          })),
        }),
      });
      const data = (await response.json()) as { reply?: string };
      setMessages((current) => [...current, { role: "assistant", content: data.reply || "No reply yet." }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I could not reach the AI service. Check your connection and try again." },
      ]);
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
          <button
            key={item}
            className={`mode-link${mode === item ? " active" : ""}`}
            type="button"
            onClick={() => setMode(item)}
          >
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
              {messages.map((message, index) => (
                <article key={`${message.role}-${index}`} className={message.role === "assistant" ? "ai-bubble" : "user-bubble"}>
                  {message.content}
                </article>
              ))}
            </div>
          )}
        </section>
        <footer className="composer-wrap">
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              rows={1}
              maxLength={4000}
              placeholder="Message CEO JACK AI..."
              aria-label="Your message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="send-btn" type="submit" disabled={busy} aria-label="Send message">↑</button>
          </form>
        </footer>
      </main>
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
