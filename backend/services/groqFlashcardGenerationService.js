import { parseFlashcardResponse } from "../utils/flashcards.js";
import { getFlashcardSystemPrompt } from "../utils/flashcardPrompt.js";

const GROQ_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export function canUseGroq() {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function generateFlashcardsWithGroq(text) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is missing.");
  }

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: getFlashcardSystemPrompt(),
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: {
        type: "json_object",
      },
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message || `Groq request failed with ${response.status}.`,
    );
  }

  const responseText = data?.choices?.[0]?.message?.content;

  if (!responseText) {
    throw new Error("Groq returned an empty response.");
  }

  return parseFlashcardResponse(responseText);
}
