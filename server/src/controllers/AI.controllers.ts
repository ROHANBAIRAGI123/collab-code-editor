import { Request, Response } from "express";
import { OpenAI } from "openai";
import asyncHandler from "../utils/asyncHandler";
import "@dotenvx/dotenvx/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askAssistant = asyncHandler(
  async (req: Request, res: Response) => {
    const { prompt, code } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4", // or 'gpt-3.5-turbo'
        messages: [
          { role: "system", content: "You are a helpful coding assistant." },
          { role: "user", content: `${prompt}\n\n${code}` },
        ],
      });
      console.log(response);
      const answer = response.choices[0].message.content;
      res.json({ answer });
    } catch (error: any) {
      console.error("AI error:", error.message);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  }
);

export const askSuggestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4", // or 'gpt-3.5-turbo'
        messages: [
          {
            role: "system",
            content:
              "You are a helpful coding assistant.Your work is to provide suggestion based on the code provided",
          },
          { role: "user", content: `${code}` },
        ],
      });
      console.log(response);
      const answer = response.choices[0].message.content;
      res.json({ answer });
    } catch (error: any) {
      console.error("AI error:", error.message);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  }
);
