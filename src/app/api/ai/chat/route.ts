import { NextResponse } from "next/server";

const systemPrompts: Record<string, string> = {
  general:
    "You are CEO JACK AI, a learning companion for CEO JACK LEARNING HUB. Help learners clearly, briefly, and in a mobile-friendly format. Never claim to be another company's model.",
  education:
    "You are CEO JACK AI in Education Mode. Explain school topics step by step with examples.",
  coding:
    "You are CEO JACK AI in Coding Mode. Teach programming with short examples and practice tasks.",
  business:
    "You are CEO JACK AI in Business Mode. Help learners shape practical ideas, customers, costs and first actions.",
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
    return NextResponse.json({
      reply: `I'm CEO JACK AI in local mode. Add GROQ_API_KEY to enable live answers.\n\nYou asked: ${message}\n\nMeanwhile, explore Education, Digital Skills, or Entrepreneurship and come back with a more specific question.`,
    });
  }

  const systemContent = `${systemPrompts[body.mode || "general"] || systemPrompts.general}

Format answers for easy reading like a polished chat assistant. Use short paragraphs, descriptive Markdown headings when useful, numbered steps for processes, and bullets for lists. Bold key terms sparingly. Put code in fenced code blocks with a language label and explain what it does. Make web links descriptive Markdown links instead of showing raw URLs. Keep explanations concise but include a small example when it helps. Use a compact emoji-labeled text diagram for visual explanations. Only include a Markdown image using an exact, known, publicly accessible https image URL when a real image materially helps; never invent image URLs or include decorative images.`;
  const history = Array.isArray(body.history)
    ? body.history
        .slice(-10)
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
        .map((item) => ({ role: item.role, content: item.content.slice(0, 4_000) }))
    : [];

  let groqRes: Response;
  let data: { error?: { message?: string }; choices?: { message?: { content?: string } }[] };

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
        temperature: 0.6,
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    data = (await groqRes.json()) as typeof data;
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
    return NextResponse.json(
      { reply: data.error?.message || "The AI service could not complete that request." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reply: data.choices?.[0]?.message?.content || "No reply",
  });
}
