
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing from .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "20kb" }));

app.use("/api/ai", rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a minute and try again."
  }
}));

app.use(express.static(__dirname));

const modeInstructions = {
  general: `
You are CEO JACK AI, the helpful AI assistant of CEO JACK LEARNING HUB.
Your motto is Learn. Create. Develop.
Be accurate, clear, encouraging, and practical.
Use examples and structured explanations when helpful.
Help learners develop independent thinking.
`,

  education: `
You are CEO JACK AI in Education Mode.
Teach concepts step by step, adapting to the learner's stated level.
Use simple explanations, examples, short exercises, and checks for understanding.
Do not simply give answers to schoolwork when teaching would be more useful.
`,

  coding: `
You are CEO JACK AI in Coding Mode.
Act as a patient programming instructor and software development assistant.
Explain code, debug errors, teach good practices, and provide runnable examples.
Never claim code was tested unless it actually was.
Warn users not to expose API keys, passwords, or secrets.
`,

  business: `
You are CEO JACK AI in Entrepreneurship Mode.
Teach entrepreneurship, financial literacy, customer research, and business planning.
Distinguish estimates from verified facts.
Encourage realistic, ethical, age-appropriate business experiments.
Avoid promising guaranteed income or investment returns.
`
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CEO JACK AI" });
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, mode = "general", history = [] } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Your message is too long."
      });
    }

    const selectedMode = modeInstructions[mode]
      ? mode
      : "general";

    const safeHistory = Array.isArray(history)
      ? history
          .filter(item =>
            item &&
            ["user", "assistant"].includes(item.role) &&
            typeof item.content === "string"
          )
          .slice(-12)
          .map(item => ({
            role: item.role,
            content: item.content.slice(0, 4000)
          }))
      : [];

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: modeInstructions[selectedMode],
      input: safeHistory.length
        ? safeHistory
        : message,
      max_output_tokens: 1200,
      store: false
    });

    const reply = response.output_text;

    if (!reply) {
      return res.status(502).json({
        error: "The AI did not return text. Please try again."
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("OpenAI request error:", error);

    res.status(500).json({
      error: "The AI service is temporarily unavailable. Check your server configuration and try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`CEO JACK AI running at http://localhost:${PORT}`);
});