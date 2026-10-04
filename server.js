import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serves ai.html etc

// --- FREE GROQ API - STREAMING WORD PER WORD LIKE CHATGPT ---
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, mode, history } = req.body;
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).end("GROQ_API_KEY missing in .env");
    }

    // Important: Streaming headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const systemPrompt = `You are CEO JACK AI from Uganda. Friendly teacher, simple English, P7 to University. Mode: ${mode}. 
    RULES:
    - Answer in clean Markdown only. Use ## headings, - bullets, \`\`\`html code blocks.
    - NEVER output JSON. NEVER write {"reply":...}. Just direct answer.
    - Be nice, Ugandan style, add small examples and exercise at end.
    `;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          ...(history || []).slice(-8),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        stream: true  // THIS MAKES IT STREAM
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(errText);
    }

    // Pipe Groq stream to browser word-per-word
    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.replace("data: ", "").trim();
        if (data === "[DONE]") {
          res.end();
          return;
        }
        try {
          const json = JSON.parse(data);
          const token = json.choices?.[0]?.delta?.content || "";
          if (token) res.write(token); // word per word
        } catch {}
      }
    }
    res.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/plain");
    }
    res.end(`Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CEO JACK LIVE STREAMING on http://localhost:${PORT}`));