"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import "@/src/styles/ai.css";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Mode = "general" | "education" | "coding" | "business";
type SavedConversation = { id: string; title: string; mode: Mode; messages: ChatMessage[]; updatedAt: number };
type PlanArea = "education" | "digital-skills" | "entrepreneurship" | "personal-growth";
type PlanTask = { id: string; title: string; detail: string; days: string; minutes: number; done: boolean };
type WorkPlan = { id: string; goal: string; area: PlanArea; duration: 7 | 14 | 30; hoursPerWeek: number; tasks: PlanTask[]; createdAt: number };
const CHAT_HISTORY_KEY = "ceojack-ai-conversations-v1";
const WORK_PLAN_KEY = "ceojack-ai-work-plan-v1";
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

const planSteps: Record<PlanArea, { title: string; detail: string }[]> = {
  education: [
    { title: "Set a clear learning target", detail: "Choose one topic and describe what you should be able to explain or solve by the end." },
    { title: "Find the gaps", detail: "Review your notes, try a short self quiz, and list the ideas that still feel unclear." },
    { title: "Learn in focused sessions", detail: "Work through one small section at a time, then close your notes and recall the key ideas." },
    { title: "Practise and check", detail: "Complete practice questions, mark mistakes, and revisit the reason behind each one." },
    { title: "Explain it in your own words", detail: "Create a short summary, worked example, or mini lesson that shows what you understand." },
    { title: "Review and choose the next step", detail: "Compare your result with the target, celebrate progress, and select the next topic to strengthen." },
  ],
  "digital-skills": [
    { title: "Choose a practical outcome", detail: "Pick a small thing to make, such as a web page, spreadsheet, digital poster, or organized file system." },
    { title: "Learn the essential tools", detail: "Gather the tools you need and learn the few core actions that support your outcome." },
    { title: "Follow a small example", detail: "Recreate a beginner example and note which steps or terms are new to you." },
    { title: "Build your first version", detail: "Create a simple version of your project. Keep the scope small enough to finish." },
    { title: "Test and improve", detail: "Try your project on another device or ask someone to use it, then fix the most important issue." },
    { title: "Share what you made", detail: "Save or publish your work, explain what you learned, and write down one improvement for version two." },
  ],
  entrepreneurship: [
    { title: "Describe the customer and problem", detail: "Write who you want to help, what problem they have, and how they solve it today." },
    { title: "Listen to potential customers", detail: "Talk with a few people who fit your customer group. Ask about their real experience and needs." },
    { title: "Shape one simple offer", detail: "Describe exactly what you will provide, how it works, and what the customer would pay." },
    { title: "Check the basic numbers", detail: "Estimate the direct cost, price, and time needed for a small test. Set a limit before spending." },
    { title: "Run a low-cost test", detail: "Offer a small batch or trial service and record responses, sales, costs, and questions." },
    { title: "Review evidence and decide", detail: "Use what customers did and said to improve the offer, test again, or choose a different direction." },
  ],
  "personal-growth": [
    { title: "Define what progress means", detail: "Turn your goal into a specific outcome you can notice or measure." },
    { title: "Check your starting point", detail: "Write down what is already working, what is getting in the way, and the support you can use." },
    { title: "Build a repeatable routine", detail: "Choose a small action and a regular time to practise it. Make the first step easy to start." },
    { title: "Practise and record progress", detail: "Use short sessions and keep a simple record of what you tried and what you learned." },
    { title: "Ask for useful feedback", detail: "Share your progress with someone you trust and ask one clear question about what to improve." },
    { title: "Reflect and set the next target", detail: "Review your progress without judging yourself, then choose one next action that feels achievable." },
  ],
};

function isWorkPlan(value: unknown): value is WorkPlan {
  if (typeof value !== "object" || value === null) return false;
  const plan = value as Partial<WorkPlan>;
  const areas: PlanArea[] = ["education", "digital-skills", "entrepreneurship", "personal-growth"];
  return typeof plan.id === "string" && typeof plan.goal === "string" &&
    typeof plan.area === "string" && areas.includes(plan.area as PlanArea) &&
    (plan.duration === 7 || plan.duration === 14 || plan.duration === 30) &&
    typeof plan.hoursPerWeek === "number" && plan.hoursPerWeek >= 1 && plan.hoursPerWeek <= 20 &&
    typeof plan.createdAt === "number" && Array.isArray(plan.tasks) && plan.tasks.length > 0 &&
    plan.tasks.every((task: unknown): task is PlanTask => {
      if (typeof task !== "object" || task === null) return false;
      const item = task as Partial<PlanTask>;
      return typeof item.id === "string" && typeof item.title === "string" &&
        typeof item.detail === "string" && typeof item.days === "string" &&
        typeof item.minutes === "number" && typeof item.done === "boolean";
    });
}

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
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [historyReady, setHistoryReady] = useState(false);
  const [workPlan, setWorkPlan] = useState<WorkPlan | null>(null);
  const [planReady, setPlanReady] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [planGoal, setPlanGoal] = useState("");
  const [planArea, setPlanArea] = useState<PlanArea>("education");
  const [planDuration, setPlanDuration] = useState<7 | 14 | 30>(14);
  const [planHours, setPlanHours] = useState(5);
  const [busy, setBusy] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recognitionTranscriptRef = useRef("");
  const scrollRef = useRef<HTMLElement | null>(null);
  const followLatestRef = useRef(true);
  const programmaticScrollUntilRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const planGoalRef = useRef<HTMLInputElement | null>(null);
  const planDialogRef = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CHAT_HISTORY_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((item: unknown): item is SavedConversation => {
          if (typeof item !== "object" || item === null) return false;
          const candidate = item as Partial<SavedConversation>;
          return typeof candidate.id === "string" && typeof candidate.title === "string" &&
            typeof candidate.mode === "string" && ["general", "education", "coding", "business"].includes(candidate.mode) &&
            Array.isArray(candidate.messages) && candidate.messages.every((message: unknown) =>
              typeof message === "object" && message !== null &&
              "role" in message && (message.role === "user" || message.role === "assistant") &&
              "content" in message && typeof message.content === "string",
            ) && typeof candidate.updatedAt === "number";
        });
        setConversations(valid.slice(0, 20));
      }
    } catch {
      setConversations([]);
    } finally {
      setHistoryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!historyReady) return;
    try {
      window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversations.slice(0, 20)));
    } catch {
      setVoiceNotice("Chat history could not be saved in this browser.");
    }
  }, [conversations, historyReady]);

  useEffect(() => {
    if (!historyReady || !conversationId || !messages.length) return;
    const firstPrompt = messages.find((message) => message.role === "user")?.content || "New conversation";
    const conversation: SavedConversation = {
      id: conversationId,
      title: firstPrompt.replace(/\s+/g, " ").trim().slice(0, 48),
      mode,
      messages: messages.slice(-30),
      updatedAt: Date.now(),
    };
    const timer = window.setTimeout(() => {
      setConversations((current) => [conversation, ...current.filter((item) => item.id !== conversationId)].slice(0, 20));
    }, 450);
    return () => window.clearTimeout(timer);
  }, [messages, mode, conversationId, historyReady]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(WORK_PLAN_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (isWorkPlan(parsed)) {
        setWorkPlan(parsed);
        setPlanGoal(parsed.goal);
        setPlanArea(parsed.area);
        setPlanDuration(parsed.duration);
        setPlanHours(parsed.hoursPerWeek);
      }
    } catch {
      setWorkPlan(null);
    } finally {
      setPlanReady(true);
    }
  }, []);

  useEffect(() => {
    if (!planReady) return;
    try {
      if (workPlan) window.localStorage.setItem(WORK_PLAN_KEY, JSON.stringify(workPlan));
      else window.localStorage.removeItem(WORK_PLAN_KEY);
    } catch {
      setVoiceNotice("Your work plan could not be saved in this browser.");
    }
  }, [workPlan, planReady]);

  useEffect(() => {
    const chatArea = scrollRef.current;
    if (!chatArea || !followLatestRef.current) return;
    programmaticScrollUntilRef.current = Date.now() + 350;
    chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function handleChatScroll() {
    const chatArea = scrollRef.current;
    if (!chatArea || Date.now() < programmaticScrollUntilRef.current) return;
    followLatestRef.current = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < 100;
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, [input]);

  useEffect(() => () => {
    abortRef.current?.abort();
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!planOpen) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => planGoalRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlanOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = planDialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [planOpen]);

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

  async function send(text: string, history = messages) {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;
    const previousMessages = history;
    const nextMessages = [...previousMessages, { role: "user" as const, content: trimmed }];
    const assistantIndex = nextMessages.length;
    if (!conversationId) {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
      setConversationId(id);
    }
    setInput("");
    setVoiceNotice("");
    setBusy(true);
    busyRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    setMessages([...nextMessages, { role: "assistant", content: "" }]);

    const updateReply = (content: string) => {
      setMessages((current) => current.map((item, index) => index === assistantIndex ? { ...item, content } : item));
    };

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history: previousMessages.slice(-10),
        }),
        signal: controller.signal,
      });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = (await response.json()) as { reply?: string };
        const reply = data.reply || "I didn’t get a reply. Please try again.";
        updateReply(reply);
        if (voiceMode) speak(reply);
        return;
      }
      if (!response.ok) throw new Error("The AI service could not complete that request.");
      if (!response.body) throw new Error("The AI service returned an empty response.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let reply = "";
      let visibleReply = "";
      let queuedReply = "";
      let revealTask: Promise<void> | null = null;

      const revealQueuedReply = async (flush = false) => {
        while ((queuedReply.length >= 24 || (flush && queuedReply.length > 0)) && !controller.signal.aborted) {
          let chunkSize = Math.min(34, queuedReply.length);
          if (!flush && queuedReply.length > chunkSize) {
            const wordBreak = queuedReply.lastIndexOf(" ", chunkSize);
            if (wordBreak > 16) chunkSize = wordBreak + 1;
          }
          visibleReply += queuedReply.slice(0, chunkSize);
          queuedReply = queuedReply.slice(chunkSize);
          updateReply(visibleReply);
          await new Promise((resolve) => setTimeout(resolve, 70));
        }
      };

      const queueReply = (content: string) => {
        reply += content;
        queuedReply += content;
        if (!revealTask) {
          revealTask = revealQueuedReply().finally(() => {
            revealTask = null;
          });
        }
      };

      const readEvent = (event: string) => {
        for (const line of event.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const chunk = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) queueReply(content);
          } catch {
            // Ignore incomplete or non-content SSE frames.
          }
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";
        for (const event of events) readEvent(event);
      }
      buffer += decoder.decode();
      if (buffer.trim()) readEvent(buffer);
      if (revealTask) await revealTask;
      await revealQueuedReply(true);
      if (!reply) {
        reply = "I didn’t get a reply. Please try again.";
        updateReply(reply);
      }
      if (voiceMode) speak(reply);
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error && error.message !== "Failed to fetch"
        ? error.message
        : "I couldn’t reach the AI service. Check your connection and try again.";
      updateReply(message);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        busyRef.current = false;
        setBusy(false);
      }
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
    abortRef.current = null;
    busyRef.current = false;
    setBusy(false);
  }

  function startNewConversation() {
    stopGeneration();
    recognitionRef.current?.stop();
    setMessages([]);
    setConversationId(null);
    setMode("general");
    setInput("");
    setVoiceNotice("");
    setListening(false);
    setCopiedIndex(null);
  }

  function openConversation(conversation: SavedConversation) {
    stopGeneration();
    recognitionRef.current?.stop();
    setListening(false);
    setVoiceNotice("");
    setInput("");
    setConversationId(conversation.id);
    setMessages(conversation.messages);
    setMode(conversation.mode);
    setSidebarOpen(false);
  }

  function deleteConversation(id: string) {
    setConversations((current) => current.filter((item) => item.id !== id));
    if (conversationId === id) startNewConversation();
  }

  function createWorkPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const goal = planGoal.trim();
    if (!goal) return;
    const count = planDuration === 7 ? 4 : planDuration === 14 ? 5 : 6;
    const tasks = planSteps[planArea].slice(0, count).map((step, index) => {
      const startDay = Math.floor(index * planDuration / count) + 1;
      const endDay = Math.floor((index + 1) * planDuration / count);
      return {
        id: `${Date.now()}-${index}`,
        title: step.title,
        detail: step.detail,
        days: startDay === endDay ? `Day ${startDay}` : `Days ${startDay}–${endDay}`,
        minutes: Math.max(25, Math.round((planHours * 60 * planDuration / 7 / count) / 5) * 5),
        done: false,
      };
    });
    setWorkPlan({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      goal,
      area: planArea,
      duration: planDuration,
      hoursPerWeek: planHours,
      tasks,
      createdAt: Date.now(),
    });
  }

  function togglePlanTask(taskId: string) {
    setWorkPlan((current) => current ? {
      ...current,
      tasks: current.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task),
    } : current);
  }

  function askAiToCoachPlan() {
    if (!workPlan || busy) return;
    const areaName: Record<PlanArea, string> = {
      education: "Education",
      "digital-skills": "Digital Skills",
      entrepreneurship: "Entrepreneurship",
      "personal-growth": "Personal development",
    };
    const taskList = workPlan.tasks.map((task, index) => `${task.done ? "✓ DONE" : "○ NEXT"} ${index + 1}. ${task.days}: ${task.title} — ${task.detail}`).join("\n");
    setPlanOpen(false);
    const nextAction = workPlan.tasks.some((task) => !task.done)
      ? "Help me start with the next unfinished step."
      : "All steps are marked complete. Help me reflect on the outcome and choose a useful next goal.";
    void send(`Coach me through my ${workPlan.duration}-day ${areaName[workPlan.area]} work plan for this goal: ${workPlan.goal}. I can spend about ${workPlan.hoursPerWeek} hours each week. Here are the steps:\n${taskList}\n\n${nextAction} Ask only the most useful question if you need more context, and keep the advice practical for CEO JACK LEARNING HUB.`, messages);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function exportConversation() {
    if (!messages.length) return;
    const firstPrompt = messages.find((message) => message.role === "user")?.content || "CEO JACK AI conversation";
    const markdown = `# ${firstPrompt.slice(0, 72)}\n\n${messages.map((message) => `## ${message.role === "user" ? "You" : "CEO JACK AI"}\n\n${message.content}`).join("\n\n---\n\n")}\n`;
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ceojack-ai-chat-${new Date().toISOString().slice(0, 10)}.md`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function editMessage(index: number) {
    const message = messages[index];
    if (!message || message.role !== "user" || busy) return;
    setMessages(messages.slice(0, index));
    setInput(message.content);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function regenerateLatest() {
    if (busy) return;
    let userIndex = -1;
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "user") {
        userIndex = index;
        break;
      }
    }
    if (userIndex < 0) return;
    const prompt = messages[userIndex].content;
    const history = messages.slice(0, userIndex);
    setMessages(history);
    void send(prompt, history);
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
      {planOpen ? (
        <div className="workplan-scrim" onClick={(event) => { if (event.target === event.currentTarget) setPlanOpen(false); }}>
          <section ref={planDialogRef} className="workplan-dialog" role="dialog" aria-modal="true" aria-labelledby="workplan-title" aria-describedby="workplan-description">
            <header className="workplan-header">
              <div><span className="workplan-kicker">YOUR NEXT STEPS</span><h2 id="workplan-title">Work plan</h2></div>
              <button className="workplan-close" type="button" aria-label="Close work plan" onClick={() => setPlanOpen(false)}>×</button>
            </header>
            <p className="workplan-intro" id="workplan-description">Turn a goal into a realistic sequence of actions you can track. Your plan is saved on this device.</p>
            <form className="workplan-form" onSubmit={createWorkPlan}>
              <label className="workplan-field workplan-goal-field" htmlFor="workplan-goal">What do you want to achieve?</label>
              <input ref={planGoalRef} id="workplan-goal" maxLength={120} required value={planGoal} onChange={(event) => setPlanGoal(event.target.value)} placeholder="Example: Build a simple portfolio website" />
              <div className="workplan-form-grid">
                <label className="workplan-field" htmlFor="workplan-area">Learning area
                  <select id="workplan-area" value={planArea} onChange={(event) => setPlanArea(event.target.value as PlanArea)}>
                    <option value="education">Education</option>
                    <option value="digital-skills">Digital Skills</option>
                    <option value="entrepreneurship">Entrepreneurship</option>
                    <option value="personal-growth">Personal development</option>
                  </select>
                </label>
                <label className="workplan-field" htmlFor="workplan-duration">Timeframe
                  <select id="workplan-duration" value={planDuration} onChange={(event) => setPlanDuration(Number(event.target.value) as 7 | 14 | 30)}>
                    <option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option>
                  </select>
                </label>
              </div>
              <label className="workplan-field workplan-hours" htmlFor="workplan-hours">Time available each week <strong>{planHours} {planHours === 1 ? "hour" : "hours"}</strong>
                <input id="workplan-hours" type="range" min={1} max={20} value={planHours} onChange={(event) => setPlanHours(Number(event.target.value))} />
              </label>
              <div className="workplan-form-actions">
                <button className="workplan-generate" type="submit">{workPlan ? "Replace current plan" : "Create my work plan"}<span aria-hidden="true">→</span></button>
                {workPlan ? <span className="workplan-replace-note">Creating a new plan replaces this one.</span> : null}
              </div>
            </form>

            {workPlan ? (
              <section className="workplan-current" aria-labelledby="current-plan-title">
                <div className="workplan-summary">
                  <div><span className="workplan-kicker">{workPlan.duration}-DAY PLAN · {workPlan.area.replaceAll("-", " ").toUpperCase()}</span><h3 id="current-plan-title">{workPlan.goal}</h3></div>
                  <span className="workplan-progress-count">{workPlan.tasks.filter((task) => task.done).length}/{workPlan.tasks.length} done</span>
                </div>
                <div className="workplan-progress-track" role="progressbar" aria-label="Work plan progress" aria-valuemin={0} aria-valuemax={workPlan.tasks.length} aria-valuenow={workPlan.tasks.filter((task) => task.done).length}><span style={{ width: `${workPlan.tasks.filter((task) => task.done).length / workPlan.tasks.length * 100}%` }} /></div>
                <ol className="workplan-tasks">
                  {workPlan.tasks.map((task) => (
                    <li key={task.id} className={task.done ? "is-done" : undefined}>
                      <button type="button" className="workplan-task-toggle" aria-pressed={task.done} onClick={() => togglePlanTask(task.id)}><span aria-hidden="true">{task.done ? "✓" : ""}</span><span className="workplan-task-copy"><small>{task.days} · about {task.minutes} min</small><strong>{task.title}</strong><span>{task.detail}</span></span></button>
                    </li>
                  ))}
                </ol>
                {workPlan.tasks.every((task) => task.done) ? <p className="workplan-complete-note">All steps complete. Take a moment to review what you learned and choose what to build next.</p> : null}
                <div className="workplan-footer-actions">
                  <button className="workplan-coach" type="button" disabled={busy} onClick={askAiToCoachPlan}>Ask CEO JACK AI to coach me <span aria-hidden="true">→</span></button>
                  <button className="workplan-delete" type="button" onClick={() => setWorkPlan(null)}>Delete plan</button>
                </div>
              </section>
            ) : <div className="workplan-empty"><span aria-hidden="true">✦</span><strong>Your plan will appear here</strong><p>Choose a goal and time commitment to get a practical, step-by-step plan.</p></div>}
          </section>
        </div>
      ) : null}
      {sidebarOpen ? <button className="mobile-overlay show" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Link href="/" className="brand" aria-label="CEO JACK Home" onClick={() => setSidebarOpen(false)}>
          <div className="brand-logo">CJ</div>
          <div><strong>CEO JACK</strong><span>LEARNING HUB</span></div>
        </Link>
        <button className="new-chat" type="button" onClick={startNewConversation}><span aria-hidden="true">＋</span> New conversation</button>
        <button className="planner-open-button" type="button" onClick={() => { setSidebarOpen(false); setPlanOpen(true); }}><span aria-hidden="true">▦</span><span>{workPlan ? "Work plan" : "Build a work plan"}</span>{workPlan ? <small>{workPlan.tasks.filter((task) => task.done).length}/{workPlan.tasks.length}</small> : null}</button>
        <div className="sidebar-label recent-label">RECENT CONVERSATIONS</div>
        <p className="history-note">Saved on this device</p>
        <div className="conversation-history">
          {conversations.length ? conversations.map((conversation) => (
            <div className={`conversation-item${conversation.id === conversationId ? " active" : ""}`} key={conversation.id}>
              <button type="button" className="conversation-open" onClick={() => openConversation(conversation)} title={conversation.title}>{conversation.title}</button>
              <button type="button" className="conversation-delete" onClick={() => deleteConversation(conversation.id)} aria-label={`Delete ${conversation.title}`} title="Delete conversation">×</button>
            </div>
          )) : <p className="conversation-empty">Your chats will appear here.</p>}
        </div>
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
            <button className="export-chat-button" type="button" disabled={!messages.length} onClick={exportConversation} aria-label="Export conversation as Markdown" title="Export conversation"><span aria-hidden="true">⇩</span><span className="export-label">Export</span></button>
            <button className={`voice-mode-button${voiceMode ? " active" : ""}`} type="button" aria-pressed={voiceMode} onClick={() => { setVoiceMode((enabled) => !enabled); setVoiceNotice(voiceMode ? "Voice mode off." : "Voice mode on. Replies will be spoken aloud."); }}>
              <span aria-hidden="true">◖</span><span>{voiceMode ? "Voice on" : "Voice mode"}</span>
            </button>
          </div>
        </header>

        <section className="chat-area" ref={scrollRef} onScroll={handleChatScroll} aria-label="Conversation">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="ai-orb" aria-hidden="true">✦</div>
              <p className="welcome-tag">LEARN. CREATE. DEVELOP.</p>
              <h2>What are we building<br />or learning today?</h2>
              <p className="welcome-description">Ask a question, explore an idea, or use your voice to get started.</p>
              <div className="prompt-grid">
                <button className="prompt-card" type="button" onClick={() => void send("Teach me HTML from the beginning with examples and a small exercise.")}><span aria-hidden="true">▤</span><strong>Learn something</strong><small>Understand a topic step by step</small></button>
                <button className="prompt-card" type="button" onClick={() => void send("Teach me JavaScript with a practical beginner project I can build today.")}><span aria-hidden="true">⌘</span><strong>Build with code</strong><small>Learn programming practically</small></button>
                <button className="prompt-card" type="button" onClick={() => setPlanOpen(true)}><span aria-hidden="true">◷</span><strong>Make a work plan</strong><small>Turn a goal into trackable steps</small></button>
                <button className="prompt-card" type="button" onClick={() => void send("Help me test a small business idea by identifying a customer, a simple offer, and low-cost next steps.")}><span aria-hidden="true">↗</span><strong>Test a business idea</strong><small>Start small and learn from customers</small></button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
                  <div className="avatar" aria-hidden="true">{message.role === "assistant" ? "✦" : "Y"}</div>
                  <div className="message-content">
                    <div className="message-name">{message.role === "assistant" ? "CEO JACK AI" : "You"}</div>
                    <div className={`bubble${busy && index === messages.length - 1 && message.role === "assistant" ? " streaming" : ""}`}>
                      {message.content ? renderMessage(message.content) : busy ? <div className="typing" role="status" aria-label="CEO JACK AI is thinking"><span /><span /><span /></div> : null}
                      {busy && index === messages.length - 1 && message.role === "assistant" && message.content ? <span className="cursor" aria-hidden="true" /> : null}
                    </div>
                    {message.role === "assistant" && message.content ? (
                      <div className="message-actions">
                        <button type="button" onClick={() => void copyMessage(message.content, index)} aria-label="Copy response">{copiedIndex === index ? "✓ Copied" : "▢ Copy"}</button>
                        <button type="button" onClick={() => speak(message.content)} aria-label="Read response aloud">◖ Listen</button>
                        {index === messages.length - 1 ? <button type="button" onClick={regenerateLatest} disabled={busy} aria-label="Regenerate response">↻ Retry</button> : null}
                      </div>
                    ) : message.role === "user" ? (
                      <div className="message-actions user-actions"><button type="button" onClick={() => editMessage(index)} disabled={busy} aria-label="Edit message">✎ Edit</button></div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="composer-wrap">
          {voiceNotice ? <div className="voice-notice" role="status">{voiceNotice}</div> : null}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea ref={textareaRef} rows={1} maxLength={4000} placeholder={listening ? "Listening…" : "Message CEO JACK AI..."} aria-label="Your message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(input); } }} />
            <button className={`voice-input-btn${listening ? " listening" : ""}`} type="button" aria-label={listening ? "Stop voice input" : "Start voice input"} aria-pressed={listening} disabled={busy} onClick={toggleListening}>{listening ? "■" : "♩"}</button>
            {busy ? <button className="send-btn stop-btn" type="button" onClick={stopGeneration} aria-label="Stop generating">■</button> : <button className="send-btn" type="submit" disabled={!input.trim()} aria-label="Send message">↑</button>}
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
