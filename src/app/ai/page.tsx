"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import "@/src/styles/ai.css";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Mode = "general" | "education" | "coding" | "business";
type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = { error: string };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function safeHref(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<]+)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${tokenIndex++}`;

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else {
      const markdownLink = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      const label = markdownLink?.[1] || token.replace(/[),.!?]+$/, "");
      const rawHref = markdownLink?.[2] || label;
      const href = safeHref(rawHref);
      const trailing = markdownLink ? "" : token.slice(label.length);
      nodes.push(href ? <a key={key} href={href} target="_blank" rel="noreferrer noopener">{label}</a> : label);
      if (trailing) nodes.push(trailing);
    }

    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderMessage(content: string) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let index = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(<p key={`p-${index++}`}>{paragraph.map((line, lineIndex) => <span key={lineIndex}>{renderInline(line, `p-${index}-${lineIndex}`)}{lineIndex < paragraph.length - 1 ? <br /> : null}</span>)}</p>);
    paragraph = [];
  };

  while (index < lines.length) {
    const line = lines[index];
    const fence = line.match(/^```([\w+-]*)\s*$/);
    if (fence) {
      flushParagraph();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) codeLines.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(<pre key={`code-${index}`}><code>{codeLines.join("\n")}</code></pre>);
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+["']([^"']*)["'])?\)\s*$/);
    if (image) {
      flushParagraph();
      const src = safeHref(image[2]);
      if (src) blocks.push(<figure className="ai-inline-image" key={`image-${index}`}><img src={src} alt={image[1] || "Illustration shared by CEO JACK AI"} loading="lazy" /><figcaption>{image[3] || image[1]}</figcaption></figure>);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const text = renderInline(heading[2], `heading-${index}`);
      const key = `heading-${index++}`;
      if (heading[1].length === 1) blocks.push(<h2 key={key}>{text}</h2>);
      else if (heading[1].length === 2) blocks.push(<h3 key={key}>{text}</h3>);
      else blocks.push(<h4 key={key}>{text}</h4>);
      continue;
    }

    const isList = /^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(line);
    if (isList) {
      flushParagraph();
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: string[] = [];
      while (index < lines.length && /^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(lines[index])) {
        items.push(lines[index++].replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/, ""));
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>)}</List>);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quoteLines.push(lines[index++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={`quote-${index}`}>{quoteLines.map((quote, quoteIndex) => <span key={quoteIndex}>{renderInline(quote, `quote-${index}-${quoteIndex}`)}{quoteIndex < quoteLines.length - 1 ? <br /> : null}</span>)}</blockquote>);
      continue;
    }

    if (!line.trim()) flushParagraph();
    else paragraph.push(line);
    index += 1;
  }

  flushParagraph();
  return blocks;
}

function AiChat() {
  const params = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("general");
  const [input, setInput] = useState(params.get("prompt") || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recognitionTranscriptRef = useRef("");
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setVoiceNotice("Spoken replies are not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/```[\s\S]*?```/g, "Code example omitted."));
    utterance.lang = navigator.language || "en-US";
    utterance.onstart = () => setVoiceNotice("CEO JACK AI is speaking…");
    utterance.onend = () => setVoiceNotice("");
    utterance.onerror = () => setVoiceNotice("I couldn’t play that reply. Try again.");
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const speechWindow = window as WindowWithSpeechRecognition;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceNotice("Voice input is not available in this browser. Try a current Chrome or Edge browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionTranscriptRef.current = "";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join("").trim();
      if (transcript) {
        recognitionTranscriptRef.current = transcript;
        setInput(transcript);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      setVoiceNotice(event.error === "not-allowed" ? "Allow microphone access to use voice input." : "I couldn’t hear that. Please try again.");
    };
    recognition.onend = () => {
      setListening(false);
      if (voiceMode && recognitionTranscriptRef.current) void send(recognitionTranscriptRef.current);
    };
    recognitionRef.current = recognition;
    setVoiceNotice("Listening… speak now.");
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceNotice("Voice input could not start. Please try again.");
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const previousMessages = messages;
    const nextMessages = [...previousMessages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setVoiceNotice("");
    setBusy(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history: previousMessages.slice(-10),
        }),
      });
      const data = (await response.json()) as { reply?: string };
      const reply = data.reply || "I didn’t get a reply. Please try again.";
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
      if (voiceMode) speak(reply);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I couldn’t reach the AI service. Check your connection and try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function copyMessage(content: string, index: number) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      setVoiceNotice("Copy isn’t available here. Select the reply text to copy it.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="app-shell">
      {sidebarOpen ? <button className="mobile-overlay show" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Link href="/" className="brand" aria-label="CEO JACK Home" onClick={() => setSidebarOpen(false)}>
          <div className="brand-logo">CJ</div>
          <div><strong>CEO JACK</strong><span>LEARNING HUB</span></div>
        </Link>
        <button className="new-chat" type="button" onClick={() => { setMessages([]); setVoiceNotice(""); }}><span aria-hidden="true">＋</span> New conversation</button>
        <div className="sidebar-label">AI MODES</div>
        {(["general", "education", "coding", "business"] as const).map((item) => (
          <button key={item} className={`mode-link${mode === item ? " active" : ""}`} type="button" onClick={() => setMode(item)}>
            {item === "general" ? "✦ General Assistant" : item === "education" ? "▤ Education Mode" : item === "coding" ? "</> Coding Mode" : "◈ Business Mode"}
          </button>
        ))}
        <div className="sidebar-bottom">
          <p className="sidebar-note"><span className="online-dot" />Ready to help you learn</p>
          <Link href="/dashboard" className="back-link" onClick={() => setSidebarOpen(false)}>← Back to Dashboard</Link>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="menu-btn" type="button" aria-label={sidebarOpen ? "Close menu" : "Open menu"} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}>☰</button>
          <div className="topbar-title"><span className="eyebrow">YOUR AI COMPANION</span><h1>CEO JACK AI</h1></div>
          <div className="topbar-tools">
            <span className="connection-status"><i />AI chat</span>
            <button className={`voice-mode-button${voiceMode ? " active" : ""}`} type="button" aria-pressed={voiceMode} onClick={() => { setVoiceMode((enabled) => !enabled); setVoiceNotice(voiceMode ? "Voice mode off." : "Voice mode on. Replies will be spoken aloud."); }}>
              <span aria-hidden="true">◖</span><span>{voiceMode ? "Voice on" : "Voice mode"}</span>
            </button>
          </div>
        </header>

        <section className="chat-area" ref={scrollRef} aria-label="Conversation">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="ai-orb" aria-hidden="true">✦</div>
              <p className="welcome-tag">LEARN. CREATE. DEVELOP.</p>
              <h2>What are we building<br />or learning today?</h2>
              <p className="welcome-description">Ask a question, explore an idea, or use your voice to get started.</p>
              <div className="prompt-grid">
                <button className="prompt-card" type="button" onClick={() => void send("Teach me HTML from the beginning with examples and a small exercise.")}><span aria-hidden="true">▤</span><strong>Learn something</strong><small>Understand a topic step by step</small></button>
                <button className="prompt-card" type="button" onClick={() => void send("Teach me JavaScript with a practical beginner project I can build today.")}><span aria-hidden="true">⌘</span><strong>Build with code</strong><small>Learn programming practically</small></button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
                  <div className="avatar" aria-hidden="true">{message.role === "assistant" ? "✦" : "Y"}</div>
                  <div className="message-content">
                    <div className="message-name">{message.role === "assistant" ? "CEO JACK AI" : "You"}</div>
                    <div className="bubble">{renderMessage(message.content)}</div>
                    {message.role === "assistant" ? <div className="message-actions"><button type="button" onClick={() => void copyMessage(message.content, index)} aria-label="Copy response">{copiedIndex === index ? "✓ Copied" : "▢ Copy"}</button><button type="button" onClick={() => speak(message.content)} aria-label="Read response aloud">◖ Listen</button></div> : null}
                  </div>
                </article>
              ))}
              {busy ? <div className="message assistant"><div className="avatar" aria-hidden="true">✦</div><div className="message-content"><div className="message-name">CEO JACK AI</div><div className="typing" aria-label="CEO JACK AI is thinking"><span /><span /><span /></div></div></div> : null}
            </div>
          )}
        </section>

        <footer className="composer-wrap">
          {voiceNotice ? <div className="voice-notice" role="status">{voiceNotice}</div> : null}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea rows={1} maxLength={4000} placeholder={listening ? "Listening…" : "Message CEO JACK AI..."} aria-label="Your message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(input); } }} />
            <button className={`voice-input-btn${listening ? " listening" : ""}`} type="button" aria-label={listening ? "Stop voice input" : "Start voice input"} aria-pressed={listening} disabled={busy} onClick={toggleListening}>{listening ? "■" : "♩"}</button>
            <button className="send-btn" type="submit" disabled={busy || !input.trim()} aria-label="Send message">↑</button>
          </form>
          <div className="composer-meta"><span>Enter to send · Shift + Enter for a new line</span><span>AI can make mistakes. Check important information.</span></div>
        </footer>
      </main>
    </div>
  );
}

export default function AiPage() {
  return <Suspense fallback={<p>Loading CEO JACK AI…</p>}><AiChat /></Suspense>;
}
