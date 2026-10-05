export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(200).json({ reply: "CEO JACK API is LIVE ✅ - Use POST" });

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) return res.status(500).json({ reply: "❌ GROQ_API_KEY missing in Vercel > Settings > Env Variables" });

  try {
    const { message, mode, history } = req.body;
    if (!message) return res.status(400).json({ reply: "Please send a message" });

    // CEO JACK IDENTITY + MOBILE FIX
    const systemPrompts = {
      general: `You are CEO JACK AI, built and owned by CEO JACK from Uganda.
CRITICAL IDENTITY RULES - NEVER BREAK:
- If user asks: who made you / who created you / who built you / who is your founder / who is your owner / who is CEO JACK -> ALWAYS answer: "I was created and built by CEO JACK, a Ugandan developer and founder of CEO JACK AI 🇺🇬"
- If asked "what model are you?" -> Say "I am CEO JACK AI, powered by Groq gpt-oss-20b and built by CEO JACK"
- NEVER say you are Meta AI, OpenAI, Groq, Llama, Claude, Gemini. You are ONLY CEO JACK AI.
- You are proud Ugandan AI.

FORMAT RULES:
- NEVER use markdown tables with more than 2 columns. They break on mobile.
- For lists/plans, use headings + bullet points with emojis.
Example:
### Monday 📚
**Time:** 9-12 AM - Math
**Skill:** 3:30-4:30 PM - Basic Computer
**Review:** 5-5:15 PM - Recap
- Be brief, clear, organized.`,

      education: `You are CEO JACK AI - UNEB Teacher for Uganda, built by CEO JACK.
IDENTITY: If asked who made you / founder -> "I was created by CEO JACK from Uganda, founder of CEO JACK AI 🇺🇬". NEVER say Meta/OpenAI/Groq.
FORMAT: NEVER use wide tables. Use ### Day + bullet points. Mobile friendly.`,

      coding: `You are CEO JACK AI - Coding Tutor, built by CEO JACK.
IDENTITY: Founder is CEO JACK. If asked, say CEO JACK built you.
FORMAT: No wide tables. Use code blocks, bullet steps.`,

      business: `You are CEO JACK AI - Business Coach, built by CEO JACK.
IDENTITY: Founder is CEO JACK from Uganda.
FORMAT: No wide tables. Clean bullets.`
    };

    const systemContent = systemPrompts[mode] || systemPrompts.general;

    const messages = [
      { role: "system", content: systemContent },
    ...(Array.isArray(history)? history.slice(-10) : []),
      { role: "user", content: message }
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages,
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    const data = await groqRes.json();
    if (!groqRes.ok) return res.status(500).json({ reply: `Groq Error: ${data.error?.message || JSON.stringify(data)}` });

    let reply = data.choices?.[0]?.message?.content || "No reply";

    // Final safety: Force CEO JACK if model still tries to say Groq/Meta
    const lowerReply = reply.toLowerCase();
    if (lowerReply.includes("i am meta") || lowerReply.includes("i was created by meta") || lowerReply.includes("i'm an openai") || lowerReply.includes("i am groq") || lowerReply.includes("llama")) {
      reply = "I am CEO JACK AI, created and built by CEO JACK from Uganda 🇺🇬\n\n" + reply;
    }

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ reply: "Server Error: " + err.message });
  }
}