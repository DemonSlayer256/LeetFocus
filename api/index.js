import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = 3000;
const hintsCount = 3;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in environment");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(cors());
app.use(express.json());

app.post("/api/getHints", async (req, res) => {
  const { problemStatement, difficulty} = req.body;

  if (!problemStatement || !difficulty) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const prompt = `
You are a helpful LeetCode coding assistant.
Provide exactly ${hintsCount} hints without giving the full solution.
Hints should be clear, actionable, and arranged from easiest to most advanced.
Do not use any markdown syntax. Just return it as a json format with {hint1: "answer", hint2: "answer2" ..}
Problem Difficulty: ${difficulty}
Problem Statement: ${problemStatement}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const hints = result.response.text();

    res.json({ hints });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Failed to fetch hints from Gemini API", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
