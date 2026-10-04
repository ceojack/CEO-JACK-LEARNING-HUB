export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method !== 'POST') {
    return res.status(200).json({ reply: "API is working, but use POST" });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return res.status(500).json({ reply: "ERROR: GROQ_API_KEY not set in Vercel" });
  }

  try {
    const { message, mode } = req.body;
    
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: `You are CEO JACK AI, Ugandan learning assistant for ${mode || 'general'}. Be helpful, brief.` },
          { role: "user", content: message }
        ]
      })
    });

    const data = await groqResponse.json();
    
    if (!groqResponse.ok) {
      return res.status(500).json({ reply: `Groq Error: ${JSON.stringify(data)}` });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply";
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ reply: "Server Error: " + err.message });
  }
}