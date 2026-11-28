"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { UserAvatar } from "@/src/components/user-avatar";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { createClient } from "@/src/utils/supabase/client";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Mode = "general" | "education" | "coding" | "business";
type SavedConversation = { id: string; title: string; mode: Mode; messages: ChatMessage[]; updatedAt: number };
type PlanArea = "education" | "digital-skills" | "entrepreneurship" | "personal-growth";
type PlanTask = { id: string; title: string; detail: string; days: string; minutes: number; done: boolean };
type WorkPlan = { id: string; goal: string; area: PlanArea; duration: 7 | 14 | 30; hoursPerWeek: number; tasks: PlanTask[]; createdAt: number };
type AiLearnerProfile = { displayName: string; hobby: string; level: string; interests: string[]; goals: string[]; memory: string; avatarUrl: string };
const defaultAiProfile: AiLearnerProfile = { displayName: "Friend", hobby: "", level: "Beginner", interests: [], goals: [], memory: "", avatarUrl: "" };
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
      if (src) blocks.push(<figure className={"ai-inline-image [width:min(100%,320px)] [margin:14px_0_16px] [overflow:hidden] [border:1px_solid_var(--border)] [border-radius:13px] [background:var(--panel)] [&_img]:[display:block] [&_img]:[width:100%] [&_img]:[max-height:210px] [&_img]:[object-fit:cover] [&_figcaption]:[padding:8px_10px] [&_figcaption]:[color:var(--muted)] [&_figcaption]:[font-size:10px] max-[480px]:[width:min(100%,260px)]"} key={`image-${index}`}><img src={src} alt={image[1] || "Illustration shared by CEO JACK AI"} loading="lazy" /><figcaption>{image[3] || image[1]}</figcaption></figure>);
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
  const initialPrompt = params.get("prompt") || "";
  const autoPromptSentRef = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(params.get("mode") === "education" ? "education" : "general");
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [learnerProfile, setLearnerProfile] = useState<AiLearnerProfile>(defaultAiProfile);
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
    let cancelled = false;
    async function loadLearnerProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) return;
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) throw new Error(`Profile request failed (${response.status}).`);
        const result = await response.json() as {
          user?: { fullName?: string; avatarUrl?: string };
          profile?: { displayName?: string; hobby?: string; level?: string; learningLevel?: string; interests?: string[]; goals?: string[]; jackAiMemory?: string; avatarUrl?: string } | null;
        };
        if (cancelled) return;
        const profile = result.profile;
        setLearnerProfile({
          displayName: profile?.displayName?.trim() || result.user?.fullName?.trim() || "Friend",
          hobby: profile?.hobby ?? "",
          level: profile?.level || profile?.learningLevel || "Beginner",
          interests: Array.isArray(profile?.interests) ? profile.interests : [],
          goals: Array.isArray(profile?.goals) ? profile.goals : [],
          memory: profile?.jackAiMemory ?? "",
          avatarUrl: result.user?.avatarUrl || profile?.avatarUrl || "",
        });
      } catch (error) {
        console.error("JACK AI will use its default learner profile:", error);
        if (!cancelled) setLearnerProfile(defaultAiProfile);
      }
    }
    void loadLearnerProfile();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
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
        console.error("Saved CEO JACK AI conversations could not be read.");
      } finally {
        setHistoryReady(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!historyReady || !initialPrompt || autoPromptSentRef.current) return;
    autoPromptSentRef.current = true;
    void send(initialPrompt);
  }, [historyReady, initialPrompt, send]);

  useEffect(() => {
    if (!historyReady) return;
    try {
      window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversations.slice(0, 20)));
    } catch {
      console.error("CEO JACK AI conversation history could not be saved in this browser.");
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
    const frame = window.requestAnimationFrame(() => {
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
        console.error("Saved CEO JACK AI work plan could not be read.");
      } finally {
        setPlanReady(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!planReady) return;
    try {
      if (workPlan) window.localStorage.setItem(WORK_PLAN_KEY, JSON.stringify(workPlan));
      else window.localStorage.removeItem(WORK_PLAN_KEY);
    } catch {
      console.error("CEO JACK AI work plan could not be saved in this browser.");
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

  function saveChatMemory(userMessage: string, assistantReply: string) {
    const summary = `Learner ${learnerProfile.displayName || "Friend"} (${learnerProfile.level || "Beginner"}${learnerProfile.hobby ? `, hobby: ${learnerProfile.hobby}` : ""}) asked about: ${userMessage.replace(/\s+/g, " ").trim().slice(0, 220)}. JACK AI discussed: ${assistantReply.replace(/\s+/g, " ").trim().slice(0, 420)}`;
    setLearnerProfile((current) => ({ ...current, memory: summary }));
    void fetch("/api/ai/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary }),
    }).then((response) => {
      if (!response.ok) console.error("JACK AI conversation memory could not be saved.", response.status);
    }).catch((error) => console.error("JACK AI conversation memory could not be saved:", error));
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
          profile: learnerProfile,
        }),
        signal: controller.signal,
      });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = (await response.json()) as { reply?: string };
        const reply = data.reply || "I didn’t get a reply. Please try again.";
        updateReply(reply);
        if (response.ok) saveChatMemory(trimmed, reply);
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
      if (response.ok && !controller.signal.aborted) saveChatMemory(trimmed, reply);
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
    <div className={"app-shell [display:flex] [height:100dvh] [overflow:hidden]"}>
      {planOpen ? (
        <div className={"workplan-scrim [position:fixed] [z-index:100] [inset:0] [display:grid] [place-items:center] [padding:24px] [background:rgba(3,7,15,.76)] [backdrop-filter:blur(8px)] max-[560px]:[padding:8px]"} onClick={(event) => { if (event.target === event.currentTarget) setPlanOpen(false); }}>
          <section ref={planDialogRef} className={"workplan-dialog [width:min(760px,100%)] [max-height:min(92dvh,900px)] [overflow:auto] [padding:clamp(20px,4vw,34px)] [border:1px_solid_rgba(140,200,169,.2)] [border-radius:22px] [background:linear-gradient(145deg,#111d2b,#0d1422_65%)] [box-shadow:0_30px_90px_rgba(0,0,0,.5)] max-[560px]:[max-height:96dvh] max-[560px]:[padding:19px_15px] max-[560px]:[border-radius:17px]"} role="dialog" aria-modal="true" aria-labelledby="workplan-title" aria-describedby="workplan-description">
            <header className={"workplan-header [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:16px] [&_h2]:[margin:5px_0_0] [&_h2]:[color:#f4f7fb] [&_h2]:[font-family:'Space_Grotesk',sans-serif] [&_h2]:[font-size:27px] [&_h2]:[letter-spacing:-.035em]"}>
              <div><span className={"workplan-kicker [color:#9bc9b0] [font-size:9px] [font-weight:800] [letter-spacing:.16em]"}>YOUR NEXT STEPS</span><h2 id="workplan-title">Work plan</h2></div>
              <button className={"workplan-close [display:grid] [width:38px] [height:38px] [place-items:center] [border:1px_solid_var(--border)] [border-radius:10px] [background:rgba(255,255,255,.04)] [color:#bdc8d8] [font-size:22px] [&:hover]:[background:rgba(255,255,255,.1)] [&:hover]:[color:#fff]"} type="button" aria-label="Close work plan" onClick={() => setPlanOpen(false)}>×</button>
            </header>
            <p className={"workplan-intro [max-width:620px] [margin:10px_0_22px] [color:#a7b4c7] [font-size:13px] [line-height:1.65]"} id="workplan-description">Turn a goal into a realistic sequence of actions you can track. Your plan is saved on this device.</p>
            <form className={"workplan-form [display:grid] [gap:12px] [padding:18px] [border:1px_solid_rgba(255,255,255,.08)] [border-radius:15px] [background:rgba(255,255,255,.025)] [&_input:not([type=range])]:[width:100%] [&_input:not([type=range])]:[min-height:46px] [&_input:not([type=range])]:[padding:0_12px] [&_input:not([type=range])]:[border:1px_solid_rgba(173,190,225,.36)] [&_input:not([type=range])]:[border-radius:9px] [&_input:not([type=range])]:[outline:none] [&_input:not([type=range])]:[background:#eaf0f8] [&_input:not([type=range])]:[color:#1d2940] [&_input:not([type=range])]:[font-size:15px] [&_input:not([type=range])]:[color-scheme:light] [&_input:focus]:[border-color:#78ae92] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(140,200,169,.18)] max-[560px]:[padding:13px]"} onSubmit={createWorkPlan}>
              <label className={"workplan-field workplan-goal-field [display:grid] [gap:7px] [color:#ecf1f8] [font-size:13px] [font-weight:700] [&_select]:[width:100%] [&_select]:[min-height:46px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(173,190,225,.36)] [&_select]:[border-radius:9px] [&_select]:[outline:none] [&_select]:[background:#eaf0f8] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[color-scheme:light] [&_select:focus]:[border-color:#78ae92] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(140,200,169,.18)]"} htmlFor="workplan-goal">What do you want to achieve?</label>
              <input ref={planGoalRef} id="workplan-goal" maxLength={120} required value={planGoal} onChange={(event) => setPlanGoal(event.target.value)} placeholder="Example: Build a simple portfolio website" />
              <div className={"workplan-form-grid [display:grid] [grid-template-columns:1fr_1fr] [gap:12px] max-[560px]:[grid-template-columns:1fr]"}>
                <label className={"workplan-field [display:grid] [gap:7px] [color:#ecf1f8] [font-size:13px] [font-weight:700] [&_select]:[width:100%] [&_select]:[min-height:46px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(173,190,225,.36)] [&_select]:[border-radius:9px] [&_select]:[outline:none] [&_select]:[background:#eaf0f8] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[color-scheme:light] [&_select:focus]:[border-color:#78ae92] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(140,200,169,.18)]"} htmlFor="workplan-area">Learning area
                  <select id="workplan-area" value={planArea} onChange={(event) => setPlanArea(event.target.value as PlanArea)}>
                    <option value="education">Education</option>
                    <option value="digital-skills">Digital Skills</option>
                    <option value="entrepreneurship">Entrepreneurship</option>
                    <option value="personal-growth">Personal development</option>
                  </select>
                </label>
                <label className={"workplan-field [display:grid] [gap:7px] [color:#ecf1f8] [font-size:13px] [font-weight:700] [&_select]:[width:100%] [&_select]:[min-height:46px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(173,190,225,.36)] [&_select]:[border-radius:9px] [&_select]:[outline:none] [&_select]:[background:#eaf0f8] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[color-scheme:light] [&_select:focus]:[border-color:#78ae92] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(140,200,169,.18)]"} htmlFor="workplan-duration">Timeframe
                  <select id="workplan-duration" value={planDuration} onChange={(event) => setPlanDuration(Number(event.target.value) as 7 | 14 | 30)}>
                    <option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option>
                  </select>
                </label>
              </div>
              <label className={"workplan-field workplan-hours [display:grid] [gap:7px] [color:#ecf1f8] [font-size:13px] [font-weight:700] [&_select]:[width:100%] [&_select]:[min-height:46px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(173,190,225,.36)] [&_select]:[border-radius:9px] [&_select]:[outline:none] [&_select]:[background:#eaf0f8] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[color-scheme:light] [&_select:focus]:[border-color:#78ae92] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(140,200,169,.18)] [grid-template-columns:1fr_auto] [align-items:center] [&_strong]:[color:#a9d0b8] [&_strong]:[font-size:12px] [&_input[type=range]]:[grid-column:1/-1] [&_input[type=range]]:[width:100%] [&_input[type=range]]:[accent-color:#8cc8a9]"} htmlFor="workplan-hours">Time available each week <strong>{planHours} {planHours === 1 ? "hour" : "hours"}</strong>
                <input id="workplan-hours" type="range" min={1} max={20} value={planHours} onChange={(event) => setPlanHours(Number(event.target.value))} />
              </label>
              <div className={"workplan-form-actions [display:flex] [align-items:center] [flex-wrap:wrap] [gap:11px] [margin-top:2px]"}>
                <button className={"workplan-generate [display:inline-flex] [min-height:42px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(140,200,169,.35)] [border-radius:10px] [background:linear-gradient(120deg,rgba(57,129,99,.65),rgba(50,102,111,.65))] [color:#f5fbf7] [font-size:12px] [font-weight:700] [transition:transform_.18s,filter_.18s] [&:hover]:[transform:translateY(-1px)] [&:hover]:[filter:brightness(1.12)]"} type="submit">{workPlan ? "Replace current plan" : "Create my work plan"}<span aria-hidden="true">→</span></button>
                {workPlan ? <span className={"workplan-replace-note [color:#718097] [font-size:10px]"}>Creating a new plan replaces this one.</span> : null}
              </div>
            </form>

            {workPlan ? (
              <section className={"workplan-current [margin-top:22px] [padding-top:20px] [border-top:1px_solid_rgba(255,255,255,.08)]"} aria-labelledby="current-plan-title">
                <div className={"workplan-summary [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:16px] [&_h3]:[max-width:520px] [&_h3]:[margin:5px_0_0] [&_h3]:[color:#f5f7fa] [&_h3]:[font-family:'Space_Grotesk',sans-serif] [&_h3]:[font-size:19px] [&_h3]:[line-height:1.35] [&_h3]:[overflow-wrap:anywhere] max-[560px]:[align-items:flex-start] max-[560px]:[flex-direction:column] max-[560px]:[gap:7px]"}>
                  <div><span className={"workplan-kicker [color:#9bc9b0] [font-size:9px] [font-weight:800] [letter-spacing:.16em]"}>{workPlan.duration}-DAY PLAN · {workPlan.area.replaceAll("-", " ").toUpperCase()}</span><h3 id="current-plan-title">{workPlan.goal}</h3></div>
                  <span className={"workplan-progress-count [flex:0_0_auto] [color:#a9d0b8] [font-size:11px] [font-weight:700]"}>{workPlan.tasks.filter((task) => task.done).length}/{workPlan.tasks.length} done</span>
                </div>
                <div className={"workplan-progress-track [height:6px] [overflow:hidden] [margin:13px_0_15px] [border-radius:99px] [background:rgba(255,255,255,.08)] [&_span]:[display:block] [&_span]:[height:100%] [&_span]:[border-radius:inherit] [&_span]:[background:linear-gradient(90deg,#60b986,#a2d5aa)] [&_span]:[transition:width_.2s_ease]"} role="progressbar" aria-label="Work plan progress" aria-valuemin={0} aria-valuemax={workPlan.tasks.length} aria-valuenow={workPlan.tasks.filter((task) => task.done).length}><span style={{ width: `${workPlan.tasks.filter((task) => task.done).length / workPlan.tasks.length * 100}%` }} /></div>
                <ol className={"workplan-tasks [display:grid] [gap:8px] [margin:0] [padding:0] [list-style:none]"}>
                  {workPlan.tasks.map((task) => (
                    <li key={task.id} className={task.done ? "is-done" : undefined}>
                      <button type="button" className={"workplan-task-toggle [display:flex] [width:100%] [align-items:flex-start] [gap:12px] [padding:12px] [border:1px_solid_rgba(255,255,255,.075)] [border-radius:11px] [background:rgba(140,200,169,.04)] [color:inherit] [text-align:left] [transition:border-color_.18s,background_.18s] [&:hover]:[border-color:rgba(140,200,169,.3)] [&:hover]:[background:rgba(140,200,169,.045)] [&>span:first-child]:[display:grid] [&>span:first-child]:[width:20px] [&>span:first-child]:[height:20px] [&>span:first-child]:[flex:0_0_20px] [&>span:first-child]:[place-items:center] [&>span:first-child]:[margin-top:2px] [&>span:first-child]:[border:1px_solid_rgba(255,255,255,.2)] [&>span:first-child]:[border-radius:6px] [&>span:first-child]:[color:#e5fff0] [&>span:first-child]:[font-size:13px] [border-color:rgba(140,200,169,.16)] [&>span:first-child]:[border-color:#70b78d] [&>span:first-child]:[background:#458a66]"} aria-pressed={task.done} onClick={() => togglePlanTask(task.id)}><span aria-hidden="true">{task.done ? "✓" : ""}</span><span className={"workplan-task-copy [display:grid] [gap:4px] [&_small]:[color:#9bc9b0] [&_small]:[font-size:9px] [&_small]:[font-weight:700] [&_small]:[letter-spacing:.04em] [&_strong]:[color:#a5b5aa] [&_strong]:[font-size:12px] [&>span]:[color:#96a3b7] [&>span]:[font-size:11px] [&>span]:[line-height:1.55] [&_strong]:[text-decoration:line-through] [&_strong]:[text-decoration-color:#829b8b]"}><small>{task.days} · about {task.minutes} min</small><strong>{task.title}</strong><span>{task.detail}</span></span></button>
                    </li>
                  ))}
                </ol>
                {workPlan.tasks.every((task) => task.done) ? <p className={"workplan-complete-note [margin:12px_2px_0] [padding:10px_12px] [border:1px_solid_rgba(140,200,169,.18)] [border-radius:9px] [background:rgba(140,200,169,.055)] [color:#b5d5c1] [font-size:11px] [line-height:1.5]"}>All steps complete. Take a moment to review what you learned and choose what to build next.</p> : null}
                <div className={"workplan-footer-actions [display:flex] [align-items:center] [justify-content:space-between] [gap:12px] [margin-top:14px] max-[560px]:[align-items:stretch] max-[560px]:[flex-direction:column]"}>
                  <button className={"workplan-coach [display:inline-flex] [min-height:42px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(140,200,169,.35)] [border-radius:10px] [background:linear-gradient(120deg,#6385ff,#785fff)] [color:#f5fbf7] [font-size:12px] [font-weight:700] [transition:transform_.18s,filter_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[filter:brightness(1.12)] [border-color:rgba(155,173,255,.55)] [&:disabled]:[opacity:.45] [&:disabled]:[cursor:not-allowed]"} type="button" disabled={busy} onClick={askAiToCoachPlan}>Ask CEO JACK AI to coach me <span aria-hidden="true">→</span></button>
                  <button className={"workplan-delete [padding:9px] [border:0] [background:transparent] [color:#8794a8] [font-size:10px] [&:hover]:[color:#ff9bac] max-[560px]:[text-align:center]"} type="button" onClick={() => setWorkPlan(null)}>Delete plan</button>
                </div>
              </section>
            ) : <div className={"workplan-empty [display:grid] [justify-items:center] [gap:7px] [padding:27px_14px_4px] [text-align:center] [&>span]:[color:#9bc9b0] [&>span]:[font-size:23px] [&_strong]:[color:#e8edf4] [&_strong]:[font-size:13px] [&_p]:[max-width:360px] [&_p]:[color:#8693a9] [&_p]:[font-size:11px] [&_p]:[line-height:1.55]"}><span aria-hidden="true">✦</span><strong>Your plan will appear here</strong><p>Choose a goal and time commitment to get a practical, step-by-step plan.</p></div>}
          </section>
        </div>
      ) : null}
      {sidebarOpen ? <button className={"mobile-overlay show [display:none] max-[860px]:[display:block] max-[860px]:[position:fixed] max-[860px]:[inset:0] max-[860px]:[background:rgba(0,0,0,.6)] max-[860px]:[z-index:55] [width:100%] [height:100%] [padding:0] [border:0]"} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={(`sidebar [width:270px] [flex-shrink:0] [background:var(--sidebar)] [border-right:1px_solid_var(--border)] [padding:25px_17px] [display:flex] [flex-direction:column] [z-index:20] [overflow-y:auto] max-[860px]:[position:fixed] max-[860px]:[inset:0_auto_0_0] max-[860px]:[width:280px] max-[860px]:[transform:translateX(-100%)] max-[860px]:[transition:transform_.25s_ease] max-[860px]:[z-index:60]${sidebarOpen ? "open max-[860px]:[transform:translateX(0)]" : ""}`)}>
        <Link href="/" className={"brand [display:flex] [align-items:center] [gap:12px] [text-decoration:none] [color:var(--text)] [margin:0_5px_32px] [&_strong]:[display:block] [&_strong]:[font-size:14px] [&_strong]:[letter-spacing:.5px] [&_span]:[display:block] [&_span]:[color:var(--muted)] [&_span]:[font-size:9px] [&_span]:[letter-spacing:1.5px] [&_span]:[margin-top:3px]"} aria-label="CEO JACK Home" onClick={() => setSidebarOpen(false)}>
          <SiteLogoMark className={"brand-logo [width:43px] [height:43px] [display:block] [object-fit:cover] [border-radius:13px] [background:linear-gradient(135deg,var(--accent),var(--accent-2))]"} width={86} height={86} alt="CEO JACK Learning Hub logo" />
          <div><strong>CEO JACK</strong><span>LEARNING HUB</span></div>
        </Link>
        <nav className={"workspace-nav [display:grid] [gap:5px] [margin:0_0_18px] [&_a]:[display:flex] [&_a]:[min-height:42px] [&_a]:[align-items:center] [&_a]:[gap:11px] [&_a]:[padding:0_11px] [&_a]:[border:1px_solid_transparent] [&_a]:[border-radius:10px] [&_a]:[color:#a7b1c7] [&_a]:[text-decoration:none] [&_a]:[font-size:11px] [&_a]:[font-weight:600] [&_a]:[transition:background_.18s,border-color_.18s,color_.18s] [&_a_span]:[display:grid] [&_a_span]:[width:20px] [&_a_span]:[place-items:center] [&_a_span]:[color:#8a9eff] [&_a_span]:[font-size:14px] [&_a:hover]:[border-color:rgba(255,255,255,.07)] [&_a:hover]:[background:rgba(255,255,255,.045)] [&_a:hover]:[color:#fff]"} aria-label="Learning space">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}><span>⌂</span>My dashboard</Link>
          <Link href="/education" onClick={() => setSidebarOpen(false)}><span>▤</span>Education Hub</Link>
          <Link href="/digital-skills" onClick={() => setSidebarOpen(false)}><span>&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" onClick={() => setSidebarOpen(false)}><span>◈</span>Entrepreneurship</Link>
          <Link href="/ai" className={"active [border-color:rgba(99,133,255,.42)] [background:rgba(99,133,255,.13)] [color:#fff]"} aria-current="page" onClick={() => setSidebarOpen(false)}><span>✦</span>CEO JACK AI</Link>
        </nav>
        <button className={"new-chat [width:100%] [padding:13px] [border:1px_solid_rgba(99,133,255,.35)] [border-radius:12px] [background:rgba(99,133,255,.10)] [color:var(--text)] [text-align:left] [font-weight:600] [transition:.2s] [&:hover]:[background:rgba(99,133,255,.2)] [&_span]:[margin-right:8px] [&_span]:[font-size:19px]"} type="button" onClick={startNewConversation}><span aria-hidden="true">＋</span> New conversation</button>
        <button className={"planner-open-button [width:100%] [display:flex] [align-items:center] [gap:10px] [margin-top:9px] [padding:11px_12px] [border:1px_solid_rgba(140,200,169,.18)] [border-radius:11px] [background:rgba(140,200,169,.06)] [color:#d2e7dc] [text-align:left] [font-size:12px] [font-weight:600] [transition:background_.18s,border-color_.18s] [&:hover]:[border-color:rgba(140,200,169,.38)] [&:hover]:[background:rgba(140,200,169,.12)] [&>span:first-child]:[color:var(--success)] [&>span:first-child]:[font-size:16px] [&>span:nth-child(2)]:[flex:1] [&_small]:[color:#94b8a5] [&_small]:[font-size:10px]"} type="button" onClick={() => { setSidebarOpen(false); setPlanOpen(true); }}><span aria-hidden="true">▦</span><span>{workPlan ? "Work plan" : "Build a work plan"}</span>{workPlan ? <small>{workPlan.tasks.filter((task) => task.done).length}/{workPlan.tasks.length}</small> : null}</button>
        <div className={"sidebar-label recent-label [color:#697791] [font-size:10px] [font-weight:700] [letter-spacing:1.5px] [margin:32px_10px_12px] [margin-top:26px] [margin-bottom:9px]"}>RECENT CONVERSATIONS</div>
        <p className={"history-note [margin:-5px_10px_9px] [color:#718097] [font-size:10px]"}>Saved on this device</p>
        <div className={"conversation-history [display:grid] [gap:4px] [max-height:min(34vh,320px)] [overflow:auto] [margin:0_-3px] [padding:0_3px]"}>
          {conversations.length ? conversations.map((conversation) => (
            <div className={(`conversation-item [display:flex] [align-items:center] [gap:4px] [min-width:0] [border-radius:9px] [transition:background_.18s] [&:hover]:[background:var(--panel-light)]${conversation.id === conversationId ? "active [border-color:rgba(99,133,255,.42)] [background:rgba(99,133,255,.13)] [color:#fff]" : ""}`)} key={conversation.id}>
              <button type="button" className={"conversation-open [flex:1] [min-width:0] [overflow:hidden] [padding:10px_9px] [border:0] [background:transparent] [color:white] [text-align:left] [text-overflow:ellipsis] [white-space:nowrap] [font-size:12px] [&:hover]:[color:white]"} onClick={() => openConversation(conversation)} title={conversation.title}>{conversation.title}</button>
              <button type="button" className={"conversation-delete [width:30px] [height:30px] [flex:0_0_30px] [border:0] [border-radius:7px] [background:transparent] [color:#78859b] [font-size:18px] [opacity:1] [transition:opacity_.18s,background_.18s,color_.18s] [&:focus-visible]:[opacity:1] [&:hover]:[background:rgba(255,105,125,.14)] [&:hover]:[color:#ff9bac] max-[480px]:[opacity:1] [@media_(hover:none)]:[opacity:1]"} onClick={() => deleteConversation(conversation.id)} aria-label={`Delete ${conversation.title}`} title="Delete conversation">×</button>
            </div>
          )) : <p className={"conversation-empty [margin:0] [padding:6px_10px] [color:#718097] [font-size:11px] [line-height:1.5]"}>Your chats will appear here.</p>}
        </div>
        <div className={"sidebar-label [color:#697791] [font-size:10px] [font-weight:700] [letter-spacing:1.5px] [margin:32px_10px_12px]"}>AI MODES</div>
        {(["general", "education", "coding", "business"] as const).map((item) => (
          <button key={item} className={(`mode-link [width:100%] [padding:13px_12px] [border:0] [border-radius:10px] [background:transparent] [color:#aebbd0] [text-align:left] [margin-bottom:5px] [transition:.2s] [&_span]:[display:inline-block] [&_span]:[width:27px] [&_span]:[color:var(--accent)] [&:hover]:[background:var(--panel-light)] [&:hover]:[color:white]${mode === item ? "active [border-color:rgba(99,133,255,.42)] [background:rgba(99,133,255,.13)] [color:#fff]" : ""}`)} type="button" onClick={() => setMode(item)}>
            {item === "general" ? "✦ General Assistant" : item === "education" ? "▤ Education Mode" : item === "coding" ? "</> Coding Mode" : "◈ Business Mode"}
          </button>
        ))}
        <div className={"sidebar-bottom [margin-top:auto] [padding:15px_8px_0]"}>
          <p className={"sidebar-note [color:var(--muted)] [font-size:12px] [margin-bottom:20px]"}><span className={"online-dot [display:inline-block] [width:8px] [height:8px] [background:var(--success)] [border-radius:50%] [margin-right:7px] [box-shadow:0_0_10px_rgba(140,200,169,.5)]"} />Ready to help you learn</p>
          <Link href="/dashboard" className={"back-link [color:var(--muted)] [font-size:13px] [text-decoration:none] [&:hover]:[color:white]"} onClick={() => setSidebarOpen(false)}>← Back to Dashboard</Link>
        </div>
      </aside>

      <main className={"main-panel [flex:1] [min-width:0] [display:flex] [flex-direction:column] [height:100dvh] [overflow:hidden] [position:relative] [background:var(--bg)]"}>
        <header className={"topbar [height:70px] [flex-shrink:0] [padding:0_24px] [display:flex] [align-items:center] [justify-content:space-between] [border-bottom:1px_solid_var(--border)] [background:rgba(17,26,39,.95)] [backdrop-filter:blur(10px)] [z-index:5] max-[860px]:[height:62px] max-[860px]:[padding:0_14px] max-[860px]:[gap:10px] max-[860px]:[justify-content:flex-start] max-[480px]:[height:58px] max-[480px]:[padding-inline:10px] max-[480px]:[gap:8px]"}>
          <button className={"menu-btn [display:none] [border:0] [color:white] [background:transparent] [font-size:23px] max-[860px]:[display:block]"} type="button" aria-label={sidebarOpen ? "Close menu" : "Open menu"} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}>☰</button>
          <div className={"topbar-title [&_h1]:[font-family:'Space_Grotesk',sans-serif] [&_h1]:[font-size:17px] [&_h1]:[margin-top:3px] max-[860px]:[&_h1]:[font-size:15px] max-[480px]:[&_h1]:[font-size:14px]"}><span className={"eyebrow [color:var(--accent)] [font-size:9px] [letter-spacing:2px] [font-weight:700] max-[480px]:[font-size:8px] max-[480px]:[letter-spacing:1.4px]"}>YOUR AI COMPANION</span><h1>CEO JACK AI</h1></div>
          <div className={"topbar-tools [display:flex] [align-items:center] [gap:14px] max-[860px]:[margin-left:auto] max-[860px]:[gap:9px] max-[480px]:[gap:5px]"}>
            <Link href="/profile" className={"ai-profile-link [display:inline-flex] [width:38px] [height:38px] [align-items:center] [justify-content:center] [border-radius:50%] [outline-offset:3px]"} aria-label={`Open profile for ${learnerProfile.displayName}`}><UserAvatar src={learnerProfile.avatarUrl} className={"ai-profile-avatar [position:relative] [display:grid] [width:36px] [height:36px] [overflow:hidden] [place-items:center] [border:1px_solid_rgba(206,193,255,.42)] [border-radius:50%] [background:linear-gradient(145deg,#718fff,#9b7bff)] [box-shadow:0_5px_15px_rgba(99,117,255,.23)] [&_img]:[position:absolute] [&_img]:[inset:0] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[border-radius:inherit] [&_img]:[object-fit:cover]"} /></Link>
            <span className={"connection-status [display:inline-flex] [align-items:center] [gap:7px] [color:#a7b1c7] [font-size:10px] [font-weight:600] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:50%] [&_i]:[background:var(--success)] [&_i]:[box-shadow:0_0_10px_rgba(140,200,169,.55)] max-[860px]:[display:none]"}><i />AI chat</span>
            <button className={"export-chat-button [display:inline-flex] [min-height:38px] [align-items:center] [justify-content:center] [gap:6px] [padding:0_10px] [border:1px_solid_var(--border)] [border-radius:10px] [background:rgba(255,255,255,.035)] [color:#b9c4d8] [font-size:10px] [font-weight:700] [transition:.2s] [&:hover:not(:disabled)]:[border-color:rgba(99,133,255,.42)] [&:hover:not(:disabled)]:[background:rgba(99,133,255,.13)] [&:hover:not(:disabled)]:[color:#fff] [&:disabled]:[opacity:.38] [&:disabled]:[cursor:not-allowed] [&>span:first-child]:[font-size:15px] [&>span:first-child]:[color:#a69aff] max-[860px]:[width:38px] max-[860px]:[padding:0]"} type="button" disabled={!messages.length} onClick={exportConversation} aria-label="Export conversation as Markdown" title="Export conversation"><span aria-hidden="true">⇩</span><span className={"export-label max-[860px]:[display:none]"}>Export</span></button>
            <button className={(`voice-mode-button [display:inline-flex] [align-items:center] [gap:7px] [padding:9px_12px] [border:1px_solid_var(--border)] [border-radius:10px] [background:rgba(255,255,255,.035)] [color:#b9c4d8] [font-size:10px] [font-weight:700] [transition:.2s] [&:hover]:[border-color:rgba(99,133,255,.42)] [&:hover]:[background:rgba(99,133,255,.13)] [&:hover]:[color:#fff] [&>span:first-child]:[font-size:15px] [&>span:first-child]:[color:#a69aff] max-[860px]:[padding:8px_9px] max-[480px]:[min-height:42px] max-[480px]:[gap:5px] max-[480px]:[padding:8px_9px] max-[480px]:[font-size:9px] max-[480px]:[&>span:first-child]:[font-size:13px]${voiceMode ? "active [border-color:rgba(99,133,255,.42)] [background:rgba(99,133,255,.13)] [color:#fff]" : ""}`)} type="button" aria-pressed={voiceMode} onClick={() => { setVoiceMode((enabled) => !enabled); setVoiceNotice(voiceMode ? "Voice mode off." : "Voice mode on. Replies will be spoken aloud."); }}>
              <span aria-hidden="true">◖</span><span>{voiceMode ? "Voice on" : "Voice mode"}</span>
            </button>
          </div>
        </header>

        <section className={"chat-area [flex:1] [overflow-y:auto] [overflow-x:hidden] [padding:24px_20px] [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:[width:5px] [&::-webkit-scrollbar-thumb]:[background:#1e293b] [&::-webkit-scrollbar-thumb]:[border-radius:10px] max-[860px]:[padding:16px_14px] max-[380px]:[padding:12px_10px]"} ref={scrollRef} onScroll={handleChatScroll} aria-label="Conversation">
          {messages.length === 0 ? (
            <div className={"welcome-screen [width:100%] [max-width:760px] [margin:auto] [text-align:center] [padding:30px_0] [&_h2]:[font-family:'Space_Grotesk',sans-serif] [&_h2]:[font-size:clamp(28px,4vw,38px)] [&_h2]:[line-height:1.15] [&_h2]:[letter-spacing:-1px] max-[480px]:[padding:14px_0] max-[480px]:[&_h2]:[font-size:clamp(27px,8vw,34px)]"}>
              <div className={"ai-orb [width:65px] [height:65px] [margin:0_auto_20px] [display:grid] [place-items:center] [font-size:30px] [border-radius:22px] [background:linear-gradient(135deg,#6385ff,#3197e9)] [box-shadow:0_0_45px_rgba(99,133,255,.25)] max-[480px]:[width:54px] max-[480px]:[height:54px] max-[480px]:[margin-bottom:14px] max-[480px]:[font-size:25px] max-[480px]:[border-radius:18px]"} aria-hidden="true">✦</div>
              <p className={"welcome-tag [color:var(--accent)] [font-size:10px] [font-weight:700] [letter-spacing:2px] [margin-bottom:13px]"}>LEARN. CREATE. DEVELOP.</p>
              <h2>What are we building<br />or learning today?</h2>
              <p className={"welcome-description [max-width:500px] [margin:15px_auto_30px] [color:var(--muted)] [font-size:14px] [line-height:1.7] max-[480px]:[margin:10px_auto_18px] max-[480px]:[font-size:13px] max-[480px]:[line-height:1.55]"}>Ask a question, explore an idea, or use your voice to get started.</p>
              <div className={"prompt-grid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:12px] [text-align:left] max-[860px]:[grid-template-columns:1fr] max-[380px]:[grid-template-columns:1fr] max-[380px]:[gap:9px] [@media_(min-width:381px)_and_(max-width:480px)]:[grid-template-columns:repeat(2,minmax(0,1fr))] [@media_(min-width:381px)_and_(max-width:480px)]:[gap:9px]"}>
                <button className={"prompt-card [min-height:105px] [padding:17px] [border:1px_solid_var(--border)] [border-radius:14px] [background:var(--panel)] [color:var(--text)] [transition:.2s] [cursor:pointer] [&:hover]:[border-color:rgba(99,133,255,.6)] [&:hover]:[transform:translateY(-2px)] [&:hover]:[background:var(--panel-light)] [&>span]:[display:block] [&>span]:[color:var(--accent)] [&>span]:[font-size:19px] [&>span]:[margin-bottom:9px] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_small]:[display:block] [&_small]:[color:var(--muted)] [&_small]:[font-size:11px] [&_small]:[margin-top:5px] max-[480px]:[min-height:96px] max-[480px]:[padding:13px] max-[480px]:[&>span]:[margin-bottom:6px] max-[380px]:[min-height:74px] max-[380px]:[padding:12px] max-[380px]:[&>span]:[display:none] max-[380px]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[min-height:104px] [@media_(min-width:381px)_and_(max-width:480px)]:[padding:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[font-size:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[line-height:1.35] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[line-height:1.4]"} type="button" onClick={() => void send("Teach me HTML from the beginning with examples and a small exercise.")}><span aria-hidden="true">▤</span><strong>Learn something</strong><small>Understand a topic step by step</small></button>
                <button className={"prompt-card [min-height:105px] [padding:17px] [border:1px_solid_var(--border)] [border-radius:14px] [background:var(--panel)] [color:var(--text)] [transition:.2s] [cursor:pointer] [&:hover]:[border-color:rgba(99,133,255,.6)] [&:hover]:[transform:translateY(-2px)] [&:hover]:[background:var(--panel-light)] [&>span]:[display:block] [&>span]:[color:var(--accent)] [&>span]:[font-size:19px] [&>span]:[margin-bottom:9px] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_small]:[display:block] [&_small]:[color:var(--muted)] [&_small]:[font-size:11px] [&_small]:[margin-top:5px] max-[480px]:[min-height:96px] max-[480px]:[padding:13px] max-[480px]:[&>span]:[margin-bottom:6px] max-[380px]:[min-height:74px] max-[380px]:[padding:12px] max-[380px]:[&>span]:[display:none] max-[380px]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[min-height:104px] [@media_(min-width:381px)_and_(max-width:480px)]:[padding:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[font-size:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[line-height:1.35] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[line-height:1.4]"} type="button" onClick={() => void send("Teach me JavaScript with a practical beginner project I can build today.")}><span aria-hidden="true">⌘</span><strong>Build with code</strong><small>Learn programming practically</small></button>
                <button className={"prompt-card [min-height:105px] [padding:17px] [border:1px_solid_var(--border)] [border-radius:14px] [background:var(--panel)] [color:var(--text)] [transition:.2s] [cursor:pointer] [&:hover]:[border-color:rgba(99,133,255,.6)] [&:hover]:[transform:translateY(-2px)] [&:hover]:[background:var(--panel-light)] [&>span]:[display:block] [&>span]:[color:var(--accent)] [&>span]:[font-size:19px] [&>span]:[margin-bottom:9px] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_small]:[display:block] [&_small]:[color:var(--muted)] [&_small]:[font-size:11px] [&_small]:[margin-top:5px] max-[480px]:[min-height:96px] max-[480px]:[padding:13px] max-[480px]:[&>span]:[margin-bottom:6px] max-[380px]:[min-height:74px] max-[380px]:[padding:12px] max-[380px]:[&>span]:[display:none] max-[380px]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[min-height:104px] [@media_(min-width:381px)_and_(max-width:480px)]:[padding:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[font-size:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[line-height:1.35] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[line-height:1.4]"} type="button" onClick={() => setPlanOpen(true)}><span aria-hidden="true">◷</span><strong>Make a work plan</strong><small>Turn a goal into trackable steps</small></button>
                <button className={"prompt-card [min-height:105px] [padding:17px] [border:1px_solid_var(--border)] [border-radius:14px] [background:var(--panel)] [color:var(--text)] [transition:.2s] [cursor:pointer] [&:hover]:[border-color:rgba(99,133,255,.6)] [&:hover]:[transform:translateY(-2px)] [&:hover]:[background:var(--panel-light)] [&>span]:[display:block] [&>span]:[color:var(--accent)] [&>span]:[font-size:19px] [&>span]:[margin-bottom:9px] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_small]:[display:block] [&_small]:[color:var(--muted)] [&_small]:[font-size:11px] [&_small]:[margin-top:5px] max-[480px]:[min-height:96px] max-[480px]:[padding:13px] max-[480px]:[&>span]:[margin-bottom:6px] max-[380px]:[min-height:74px] max-[380px]:[padding:12px] max-[380px]:[&>span]:[display:none] max-[380px]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[min-height:104px] [@media_(min-width:381px)_and_(max-width:480px)]:[padding:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[font-size:12px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_strong]:[line-height:1.35] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[font-size:10px] [@media_(min-width:381px)_and_(max-width:480px)]:[&_small]:[line-height:1.4]"} type="button" onClick={() => void send("Help me test a small business idea by identifying a customer, a simple offer, and low-cost next steps.")}><span aria-hidden="true">↗</span><strong>Test a business idea</strong><small>Start small and learn from customers</small></button>
              </div>
            </div>
          ) : (
            <div className={"messages [width:100%] [max-width:800px] [margin:0_auto] [display:flex] [flex-direction:column] [gap:24px] [padding-bottom:20px] max-[860px]:[gap:18px]"}>
              {messages.map((message, index) => (
                <article key={`${message.role}-${index}`} className={(`message [display:flex] [gap:12px] [align-items:flex-start] animate-appear [width:100%] max-[380px]:[gap:8px]${message.role}`)}>
                  <div className={"avatar [width:34px] [height:34px] [flex-shrink:0] [display:grid] [place-items:center] [border-radius:10px] [background:linear-gradient(135deg,#6385ff,#3197e9)] [font-size:13px] [font-weight:700] max-[380px]:[width:30px] max-[380px]:[height:30px] max-[380px]:[flex-basis:30px]"} aria-hidden="true">{message.role === "assistant" ? "✦" : "Y"}</div>
                  <div className={"message-content [max-width:85%] [min-width:0] [flex:1] [display:flex] [flex-direction:column] [align-items:flex-end] max-[860px]:[max-width:calc(100%_-_42px)] max-[380px]:[max-width:calc(100%_-_38px)]"}>
                    <div className={"message-name [font-size:11px] [color:var(--muted)] [margin-bottom:7px]"}>{message.role === "assistant" ? "CEO JACK AI" : "You"}</div>
                    <div className={(`bubble [color:#e5eaf5] [font-size:14.5px] [line-height:1.75] [overflow-wrap:anywhere] [white-space:normal] [background:#202b45] [padding:2px_0] [border-radius:18px_6px_18px_18px] [&_pre]:[background:#080f1e] [&_pre]:[border:1px_solid_rgba(255,255,255,.09)] [&_pre]:[border-radius:12px] [&_pre]:[padding:14px] [&_pre]:[overflow-x:auto] [&_pre]:[margin:12px_0] [&_pre]:[white-space:pre] [&_code]:[font-family:monospace] [&_code]:[background:#1e293b] [&_code]:[padding:2px_6px] [&_code]:[border-radius:4px] [&_code]:[font-size:13px] [&_pre_code]:[background:transparent] [&_pre_code]:[padding:0] [&_h1]:[font-family:'Space_Grotesk',sans-serif] [&_h1]:[margin:16px_0_8px_0] [&_h1]:[line-height:1.3] [&_h2]:[font-family:'Space_Grotesk',sans-serif] [&_h2]:[margin:18px_0_8px] [&_h2]:[line-height:1.3] [&_h3]:[font-family:'Space_Grotesk',sans-serif] [&_h3]:[margin:18px_0_8px] [&_h3]:[line-height:1.3] [&_ul]:[padding-left:22px] [&_ul]:[margin:8px_0_12px] [&_ol]:[padding-left:22px] [&_ol]:[margin:8px_0_12px] [&_li]:[margin:5px_0] [&_table]:[width:100%] [&_table]:[border-collapse:collapse] [&_table]:[display:block] [&_table]:[overflow-x:auto] [&_table]:[margin:12px_0] [&_table]:[font-size:13px] [&_table]:[border:1px_solid_var(--border)] [&_table]:[border-radius:10px] [&_th]:[border:1px_solid_var(--border)] [&_th]:[padding:10px_12px] [&_th]:[text-align:left] [&_th]:[white-space:nowrap] [&_td]:[border:1px_solid_var(--border)] [&_td]:[padding:10px_12px] [&_td]:[text-align:left] [&_td]:[white-space:nowrap] [&_th]:[background:var(--panel-light)] [&_th]:[color:var(--accent)] [&_p]:[margin:0_0_11px] [&_p:last-child]:[margin-bottom:0] [&_a]:[color:#9f9aff] [&_a]:[text-decoration:underline] [&_a]:[text-decoration-color:rgba(155,123,255,.38)] [&_a]:[text-underline-offset:3px] [&_a]:[overflow-wrap:anywhere] [&_a:hover]:[color:#c6c1ff] [&_a:hover]:[text-decoration-color:currentColor] [&_strong]:[color:#fff] [&_strong]:[font-weight:700] [&_em]:[color:#d7dced] [&_h2]:[color:#f5f7ff] [&_h3]:[color:#f5f7ff] [&_h4]:[margin:18px_0_8px] [&_h4]:[color:#f5f7ff] [&_h4]:[font-family:'Space_Grotesk',sans-serif] [&_h4]:[line-height:1.3] [&_h2]:[font-size:19px] [&_h3]:[font-size:16px] [&_h4]:[font-size:14px] [&_pre]:[max-width:100%] [&_pre]:[overflow:auto] [&_pre]:[color:#dfe7f7] [&_code]:[color:#c8c2ff] [&_pre_code]:[color:#e4eaf7] [&_blockquote]:[margin:12px_0] [&_blockquote]:[padding:9px_13px] [&_blockquote]:[border-left:3px_solid_var(--accent)] [&_blockquote]:[border-radius:0_9px_9px_0] [&_blockquote]:[background:rgba(99,133,255,.07)] [&_blockquote]:[color:#c7d0e1] [&_li]:[padding-left:3px] max-[380px]:[font-size:14px]${busy && index === messages.length - 1 && message.role === "assistant" ? "streaming" : ""}`)}>
                      {message.content ? renderMessage(message.content) : busy ? <div className={"typing [display:flex] [gap:5px] [padding:10px_0] [&_span]:[width:7px] [&_span]:[height:7px] [&_span]:[border-radius:50%] [&_span]:[background:var(--accent)] [&_span]:animate-dot-pulse [&_span:nth-child(2)]:[animation-delay:.2s] [&_span:nth-child(3)]:[animation-delay:.4s]"} role="status" aria-label="CEO JACK AI is thinking"><span /><span /><span /></div> : null}
                      {busy && index === messages.length - 1 && message.role === "assistant" && message.content ? <span className={"cursor [display:inline-block] [width:8px] [height:14px] [background:var(--accent)] animate-blink [margin-left:2px] [vertical-align:middle]"} aria-hidden="true" /> : null}
                    </div>
                    {message.role === "assistant" && message.content ? (
                      <div className={"message-actions [display:flex] [gap:5px] [margin-top:8px] [opacity:.72] [&_button]:[padding:5px_7px] [&_button]:[border:1px_solid_transparent] [&_button]:[border-radius:7px] [&_button]:[background:transparent] [&_button]:[color:#8d9ab1] [&_button]:[font-size:9px] [&_button]:[transition:.2s] [&_button:hover]:[border-color:var(--border)] [&_button:hover]:[background:rgba(255,255,255,.045)] [&_button:hover]:[color:#e9edfa] [&_button:disabled]:[opacity:.4] [&_button:disabled]:[cursor:not-allowed]"}>
                        <button type="button" onClick={() => void copyMessage(message.content, index)} aria-label="Copy response">{copiedIndex === index ? "✓ Copied" : "▢ Copy"}</button>
                        <button type="button" onClick={() => speak(message.content)} aria-label="Read response aloud">◖ Listen</button>
                        {index === messages.length - 1 ? <button type="button" onClick={regenerateLatest} disabled={busy} aria-label="Regenerate response">↻ Retry</button> : null}
                      </div>
                    ) : message.role === "user" ? (
                      <div className={"message-actions user-actions [display:flex] [gap:5px] [margin-top:8px] [opacity:.72] [&_button]:[padding:5px_7px] [&_button]:[border:1px_solid_transparent] [&_button]:[border-radius:7px] [&_button]:[background:transparent] [&_button]:[color:#8d9ab1] [&_button]:[font-size:9px] [&_button]:[transition:.2s] [&_button:hover]:[border-color:var(--border)] [&_button:hover]:[background:rgba(255,255,255,.045)] [&_button:hover]:[color:#e9edfa] [&_button:disabled]:[opacity:.4] [&_button:disabled]:[cursor:not-allowed] [justify-content:flex-end]"}><button type="button" onClick={() => editMessage(index)} disabled={busy} aria-label="Edit message">✎ Edit</button></div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className={"composer-wrap [flex-shrink:0] [width:100%] [padding:12px_24px_max(12px,_env(safe-area-inset-bottom))] [background:linear-gradient(to_top,_var(--bg)_70%,_transparent)] [border-top:1px_solid_var(--border)] [z-index:10] max-[860px]:[padding:10px_12px_max(10px,_env(safe-area-inset-bottom))] [padding-top:11px] max-[480px]:[padding:8px_10px_max(8px,env(safe-area-inset-bottom))]"}>
          {voiceNotice ? <div className={"voice-notice [max-width:800px] [margin:0_auto_8px] [padding:0_5px] [color:#a69aff] [font-size:10px]"} role="status">{voiceNotice}</div> : null}
          <form className={"composer [max-width:800px] [margin:0_auto] [display:flex] [align-items:flex-end] [gap:7px] [padding:10px_12px] [background:#1b2942] [border:1px_solid_rgba(160,178,220,.32)] [border-radius:22px] [box-shadow:0_10px_35px_rgba(0,0,0,.25)] [&:focus-within]:[border-color:#9bc8aa] [&:focus-within]:[box-shadow:0_0_0_3px_rgba(140,200,169,.12)] [&_textarea]:[flex:1] [&_textarea]:[min-width:0] [&_textarea]:[max-height:150px] [&_textarea]:[resize:none] [&_textarea]:[outline:none] [&_textarea]:[border:0] [&_textarea]:[background:transparent] [&_textarea]:[color:white] [&_textarea]:[font-size:16px] [&_textarea]:[line-height:1.5] [&_textarea]:[padding:6px] [&_textarea::placeholder]:[color:#b0bdd2] max-[480px]:[gap:6px] max-[480px]:[padding:8px_9px] max-[480px]:[border-radius:18px] max-[480px]:[&_textarea]:[min-height:42px] max-[480px]:[&_textarea]:[padding:8px_4px] max-[480px]:[&_textarea]:[font-size:16px]"} onSubmit={handleSubmit}>
            <textarea ref={textareaRef} rows={1} maxLength={4000} placeholder={listening ? "Listening…" : "Message CEO JACK AI..."} aria-label="Your message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(input); } }} />
            <button className={(`voice-input-btn [display:grid] [width:38px] [height:38px] [flex:0_0_38px] [place-items:center] [border:1px_solid_rgba(255,255,255,.08)] [border-radius:50%] [background:rgba(255,255,255,.055)] [color:#c0c9db] [font-size:17px] [transition:.2s] [&:hover]:[border-color:rgba(99,133,255,.45)] [&:hover]:[background:rgba(99,133,255,.12)] [&:hover]:[color:#fff] max-[480px]:[width:44px] max-[480px]:[height:44px] max-[480px]:[flex-basis:44px]${listening ? "listening [border-color:rgba(255,105,125,.4)] [background:rgba(255,105,125,.17)] [color:#ff9bac] animate-voice-pulse motion-reduce:[animation:none]" : ""}`)} type="button" aria-label={listening ? "Stop voice input" : "Start voice input"} aria-pressed={listening} disabled={busy} onClick={toggleListening}>{listening ? "■" : "♩"}</button>
            {busy ? <button className={"send-btn stop-btn [width:38px] [height:38px] [border:0] [border-radius:50%] [background:linear-gradient(135deg,#ef6478,#c84261)] [color:white] [font-size:13px] [transition:.2s] [flex-shrink:0] [display:grid] [place-items:center] [&:hover]:[transform:translateY(-1px)] [&:disabled]:[opacity:.4] [&:disabled]:[cursor:not-allowed] [&:disabled]:[transform:none] max-[480px]:[width:44px] max-[480px]:[height:44px] max-[480px]:[flex-basis:44px] [&:hover]:[box-shadow:0_0_0_5px_rgba(239,100,120,.12)]"} type="button" onClick={stopGeneration} aria-label="Stop generating">■</button> : <button className={"send-btn [width:38px] [height:38px] [border:0] [border-radius:50%] [background:linear-gradient(135deg,var(--accent),var(--accent-2))] [color:white] [font-size:18px] [transition:.2s] [flex-shrink:0] [display:grid] [place-items:center] [&:hover]:[transform:translateY(-1px)] [&:disabled]:[opacity:.4] [&:disabled]:[cursor:not-allowed] [&:disabled]:[transform:none] max-[480px]:[width:44px] max-[480px]:[height:44px] max-[480px]:[flex-basis:44px]"} type="submit" disabled={!input.trim()} aria-label="Send message">↑</button>}
          </form>
          <div className={"composer-meta [display:flex] [justify-content:space-between] [gap:10px] [color:#68758d] [font-size:10px] [padding:8px_4px_0] [max-width:800px] [margin:0_auto] max-[480px]:[font-size:9px] max-[480px]:[padding-top:6px] max-[480px]:[&_span:last-child]:[display:none]"}><span>Enter to send · Shift + Enter for a new line</span><span>AI can make mistakes. Check important information.</span></div>
        </footer>
      </main>
    </div>
  );
}

export default function AiPage() {
  return <Suspense fallback={<p>Loading CEO JACK AI…</p>}><AiChat /></Suspense>;
}
