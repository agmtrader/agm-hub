'use server';

import { gemini15Flash, gemini15Flash8b, googleAI } from "@genkit-ai/googleai";
import { genkit, z } from "genkit";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash8b,
});

export const chatFlow = ai.defineFlow(
  {
    name: "chatFlow",
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (message) => {
    const { text } = await ai.generate({
      model: gemini15Flash,
      prompt: message,
    });
    return text;
  }
);