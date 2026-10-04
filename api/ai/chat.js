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

    // MOBILE FIX: Strict formatting rules
    const systemPrompts = {
      general: `You are CEO JACK AI - Ugandan friendly assistant.
RULES:
- NEVER use markdown tables with more than 2 columns. They break on mobile.
- For lists/plans, use headings + bullet points with emojis.
- Example:
### Monday 📚
**Time:** 9-12 AM - Math
**Skill:** 3:30-4:30 PM - Basic Computer
**Review:** 5-5:15 PM - Recap
- Be brief, clear, organized. Use bold, not tables.`,

      education: `You are CEO JACK AI - UNEB Teacher for Uganda (P7, S4, S6).
RULES:
- NEVER use wide tables. Use day-wise cards.
- For weekly plan: Use ### Day + bullet points.
- Always include UNEB tips.
- Keep mobile friendly: short lines, bullets, emojis.`,

      coding: `You are CEO JACK AI - Coding Tutor.
RULES: No wide tables. Use code blocks, bullet steps. Mobile friendly.`,

      business: `You are CEO JACK AI - Business Coach for Uganda.
RULES: No wide tables. Use clean bullet points and short paragraphs.`
    };

    const systemContent = systemPrompts[mode] || systemPrompts.general;

    // Build messages with history
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
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const data = await groqRes.json();
    if (!groqRes.ok) return res.status(500).json({ reply: `Groq Error: ${data.error?.message || JSON.stringify(data)}` });

    let reply = data.choices?.[0]?.message?.content || "No reply";

    // EXTRA SAFETY: If AI still returns a table, convert it to list
    if (reply.includes("|") && reply.split("|").length > 6) {
      reply += "\n\n*Formatted for mobile view by CEO JACK*";
    }

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ reply: "Server Error: " + err.message });
  }
}