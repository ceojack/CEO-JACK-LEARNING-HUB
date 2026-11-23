import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { clientRateLimitKey, consumeRateLimit } from "@/src/utils/rate-limit";
import { readJsonBody } from "@/src/utils/read-json";

const systemPrompts: Record<string, string> = {
  general:
    "You are CEO JACK AI, a capable, thoughtful learning companion for CEO JACK LEARNING HUB. Give accurate, useful answers that meet the learner where they are. Never claim to be another company's model.",
  education:
    "You are CEO JACK AI in Education Mode. Teach concepts clearly at the learner's level. Explain the reasoning, use a worked example when useful, and help the learner practise rather than only giving an unexplained answer.",
  coding:
    "You are CEO JACK AI in Coding Mode. Help users understand, write, and debug code. Give complete, runnable examples when appropriate, name assumptions and relevant versions, explain important choices, and suggest a practical way to verify the result.",
  business:
    "You are CEO JACK AI in Business Mode. Help turn ideas into practical, testable steps. Consider the customer, evidence, costs, risks, and the smallest useful next experiment. Make assumptions clear and avoid promising business outcomes.",
};

type ChatPayload = {
  message?: string;
  mode?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  profile?: {
    displayName?: string;
    hobby?: string;
    level?: string;
    interests?: string[];
    goals?: string[];
    memory?: string;
  };
};

function jsonReply(reply: string, status = 200, extraHeaders?: HeadersInit) {
  return NextResponse.json({ reply }, { status, headers: { "Cache-Control": "private, no-store", ...extraHeaders } });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !isSupabaseConfigured()) {
    return jsonReply("AI chat is unavailable until account security is configured.", 503);
  }
  const auth = isSupabaseConfigured() ? await getAuthenticatedClient(request) : null;
  if (isSupabaseConfigured() && !auth) {
    return jsonReply("Sign in to use CEO JACK AI.", 401);
  }
  const rate = consumeRateLimit(`ai-chat:${clientRateLimitKey(request, auth?.userId)}`, 20, 10 * 60_000);
  if (!rate.allowed) {
    return jsonReply("CEO JACK AI is handling many requests right now. Please wait a few seconds, then try again.", 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  const parsed = await readJsonBody(request, 24_000);
  if (parsed.error === "too_large") return NextResponse.json({ reply: "That request is too large. Shorten your message and try again." }, { status: 413 });
  if (parsed.error || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ reply: "Send a valid JSON request." }, { status: 400 });
  }
  const body = parsed.value as ChatPayload;

  if (typeof body.message !== "string") {
    return NextResponse.json({ reply: "Please send a message." }, { status: 400 });
  }
  const message = body.message.trim();

  if (!message || message.length > 4_000) {
    return NextResponse.json({ reply: "Please send a message." }, { status: 400 });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return NextResponse.json(
      { reply: "AI responses are temporarily unavailable because the service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  let learner = body.profile;
  if (auth) {
    try {
      const { data: storedProfile, error: profileError } = await auth.supabase
        .from("profiles")
        .select("display_name, hobby, level, learning_level, interests, goals, jack_ai_memory")
        .eq("id", auth.userId)
        .maybeSingle();
      if (profileError) {
        console.error("Could not load learner context for JACK AI:", profileError.message);
        learner = { displayName: "", hobby: "", level: "", interests: [], goals: [], memory: "" };
      } else if (storedProfile) {
        learner = {
          displayName: storedProfile.display_name ?? "",
          hobby: storedProfile.hobby ?? "",
          level: storedProfile.learning_level ?? storedProfile.level ?? "",
          interests: Array.isArray(storedProfile.interests) ? storedProfile.interests : [],
          goals: Array.isArray(storedProfile.goals) ? storedProfile.goals : [],
          memory: storedProfile.jack_ai_memory ?? "",
        };
      } else {
        learner = { displayName: "", hobby: "", level: "", interests: [], goals: [], memory: "" };
      }
    } catch (error) {
      console.error("Could not load learner context for JACK AI:", error);
      learner = { displayName: "", hobby: "", level: "", interests: [], goals: [], memory: "" };
    }
  }
  const learnerName = typeof learner?.displayName === "string" && learner.displayName.trim() ? learner.displayName.trim().slice(0, 80) : "Friend";
  const learnerLevel = typeof learner?.level === "string" && learner.level.trim() ? learner.level.trim().slice(0, 80) : "Beginner";
  const learnerHobby = typeof learner?.hobby === "string" ? learner.hobby.trim().slice(0, 100) : "";
  const learnerInterests = Array.isArray(learner?.interests) ? learner.interests.filter((item): item is string => typeof item === "string").slice(0, 8).join(", ") : "";
  const learnerGoals = Array.isArray(learner?.goals) ? learner.goals.filter((item): item is string => typeof item === "string").slice(0, 6).join(", ") : "";
  const learnerMemory = typeof learner?.memory === "string" ? learner.memory.trim().slice(0, 800) : "";
  const profileContext = `\n\nLearner context (use naturally and respectfully; do not repeat private profile data unless useful): name: ${learnerName}; level: ${learnerLevel}; hobby: ${learnerHobby || "not set"}; interests: ${learnerInterests || "not set"}; goals: ${learnerGoals || "not set"}; recent learning memory: ${learnerMemory || "none yet"}. Address the learner by name when natural. Adapt explanations to their level and connect examples to their hobby/interests when relevant.`;
  const systemContent = `${systemPrompts[body.mode || "general"] || systemPrompts.general}${profileContext}

Act as a professional, encouraging learning coach for the CEO JACK LEARNING HUB community. Be accurate, thoughtful, and specific. Answer the user's actual question first, then add the most useful explanation or next step. Adapt detail to the request: simple questions deserve direct answers; complex tasks need enough context and steps to be actionable. Ask one focused clarification only when a missing detail would materially change the answer; otherwise state a reasonable assumption and proceed.

Organize responses for easy scanning. Use a short opening answer, descriptive Markdown headings only when they improve navigation, numbered steps for sequences, and bullets for related items. Keep paragraphs focused, avoid repeating the question, filler, excessive headings, and decorative emoji. Use examples when they clarify an idea. For plans, give a concrete outcome, manageable actions, realistic checkpoints, and a review point. For teaching, explain why and include a small practice prompt when appropriate. For coding, provide complete, language-labeled code where useful and explain how to check it. For advice, distinguish facts from assumptions and make tradeoffs clear. Use browser search for requests to search the web and for information that may have changed recently. If a learner names a domain, search that exact domain and its public pages. Do not assume a website is private or unavailable just because a search is inconclusive; report only what you could verify and ask for a specific page if needed. When search is used, cite key claims with descriptive Markdown links to actual pages consulted; include publication dates when relevant. Never invent sources, links, quotes, statistics, or capabilities. Be candid when uncertain or when current information needs checking; never suggest you browsed or verified something unless you actually did. Do not claim to have taken actions outside this chat or guarantee results. Use descriptive Markdown links only for URLs you know; never fabricate image URLs.`;
  const history = Array.isArray(body.history)
    ? body.history
        .slice(-6)
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
        .map((item) => ({ role: item.role, content: item.content.slice(-1_500) }))
    : [];
  const explicitSearchRequest = /\b(search|web search|look up|find online|browse the web|google|latest|current|today|recent)\b/i.test(message);

  let groqRes: Response;
  let data: { error?: { message?: string } };

  try {
    groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: systemContent }, ...history, { role: "user", content: message }],
        temperature: 0.45,
        max_completion_tokens: 1200,
        ...(explicitSearchRequest ? {
          tools: [{ type: "browser_search" }],
          tool_choice: "required",
        } : {}),
        stream: !explicitSearchRequest,
      }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(60_000)]),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error(
      timedOut ? "Groq chat request timed out." : "Could not connect to the Groq chat API.",
      error instanceof Error ? error.message : "Unknown network error"
    );
    return NextResponse.json(
      {
        reply: timedOut
          ? "The AI service took too long to respond. Please try again."
          : "CEO JACK AI couldn’t connect to its provider. Check the server’s internet access and try again.",
      },
      { status: 503 }
    );
  }

  if (!groqRes.ok) {
    data = (await groqRes.json().catch(() => ({}))) as typeof data;
    if (groqRes.status === 429) {
      return NextResponse.json(
        { reply: "CEO JACK AI is handling many requests right now. Please wait a few seconds, then try again." },
        { status: 429, headers: { "Retry-After": groqRes.headers.get("retry-after") || "4" } },
      );
    }
    console.error("Groq chat request failed:", groqRes.status, data.error?.message);
    return jsonReply("The AI service could not complete that request.", 500);
  }

  if (explicitSearchRequest) {
    const completion = await groqRes.json().catch(() => null) as {
      choices?: { message?: { content?: string | null } }[];
    } | null;
    const reply = completion?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json(
      { reply: reply || "I couldn’t find a useful answer from that search. Try rephrasing your question." },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return new Response(groqRes.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "private, no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
