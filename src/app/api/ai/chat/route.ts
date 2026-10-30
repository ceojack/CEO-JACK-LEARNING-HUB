import { NextResponse } from "next/server";

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
};

export async function POST(request: Request) {
  let body: ChatPayload;

  try {
    body = (await request.json()) as ChatPayload;
  } catch {
    return NextResponse.json({ reply: "Send a valid JSON request." }, { status: 400 });
  }

  const message = body.message?.trim();

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

  const systemContent = `${systemPrompts[body.mode || "general"] || systemPrompts.general}

Act as a professional, encouraging learning coach for the CEO JACK LEARNING HUB community. Be accurate, thoughtful, and specific. Answer the user's actual question first, then add the most useful explanation or next step. Adapt detail to the request: simple questions deserve direct answers; complex tasks need enough context and steps to be actionable. Ask one focused clarification only when a missing detail would materially change the answer; otherwise state a reasonable assumption and proceed.

Organize responses for easy scanning. Use a short opening answer, descriptive Markdown headings only when they improve navigation, numbered steps for sequences, and bullets for related items. Keep paragraphs focused, avoid repeating the question, filler, excessive headings, and decorative emoji. Use examples when they clarify an idea. For plans, give a concrete outcome, manageable actions, realistic checkpoints, and a review point. For teaching, explain why and include a small practice prompt when appropriate. For coding, provide complete, language-labeled code where useful and explain how to check it. For advice, distinguish facts from assumptions and make tradeoffs clear. Use browser search for requests to search the web and for information that may have changed recently. If a learner names a domain, search that exact domain and its public pages. Do not assume a website is private or unavailable just because a search is inconclusive; report only what you could verify and ask for a specific page if needed. When search is used, cite key claims with descriptive Markdown links to actual pages consulted; include publication dates when relevant. Never invent sources, links, quotes, statistics, or capabilities. Be candid when uncertain or when current information needs checking; never suggest you browsed or verified something unless you actually did. Do not claim to have taken actions outside this chat or guarantee results. Use descriptive Markdown links only for URLs you know; never fabricate image URLs.`;
  const history = Array.isArray(body.history)
    ? body.history
        .slice(-6)
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
        .map((item) => ({ role: item.role, content: item.content.slice(-1_500) }))
    : [];
  const explicitSearchRequest = /\b(search|web search|look up|find online|browse the web|google)\b/i.test(message);

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
        max_tokens: 1200,
        tools: [{ type: "browser_search" }],
        tool_choice: explicitSearchRequest ? "required" : "auto",
        stream: true,
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
    return NextResponse.json(
      { reply: data.error?.message || "The AI service could not complete that request." },
      { status: 500 }
    );
  }

  return new Response(groqRes.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
