import { Request, Response } from "express";
import Together from "together-ai";
import asyncHandler from "../utils/asyncHandler";
import "@dotenvx/dotenvx/config";

const together = new Together();
export const askAssistant = asyncHandler(
  async (req: Request, res: Response) => {
    const { prompt, code } = req.body;
    try {
      const response = await together.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          { role: "system", content: "You are a helpful coding assistant." },
          { role: "user", content: `${prompt}\n\n${code}` },
        ],
      });

      if (
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message
      ) {
        const answer = response.choices[0].message.content;
        res.json({ answer });
      } else {
        res.status(500).json({ error: "Failed to fetch AI response" });
      }
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
      const response = await together.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful coding assistant.Your work is to provide suggestion based on the code provided",
          },
          { role: "user", content: `${code}` },
        ],
      });

      if (
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message
      ) {
        const answer = response.choices[0].message.content;
        res.json({ answer });
      } else {
        res.status(500).json({ error: "Failed to fetch AI response" });
      }
    } catch (error: any) {
      console.error("AI error:", error.message);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  }
);
