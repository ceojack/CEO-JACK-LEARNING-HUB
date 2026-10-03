import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Rate limiter - protect AI from spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // 50 requests per 15 mins
  message: "Too many requests, try again later - CEO JACK"
});
app.use("/api/", limiter);

// Setup OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI Endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are CEO JACK Learning Hub AI assistant. Help students learn coding, business and skills. Be friendly, short, and practical." },
        { role: "user", content: message }
      ],
      max_tokens: 500
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback to index.html - Express 5 safe
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});