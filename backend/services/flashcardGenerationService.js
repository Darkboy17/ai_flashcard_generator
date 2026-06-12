import { getFlashcardGenerativeModel } from "../clients/vertexAi.js";
import { parseFlashcardResponse } from "../utils/flashcards.js";
import {
  canUseGroq,
  generateFlashcardsWithGroq,
} from "./groqFlashcardGenerationService.js";

export async function generateFlashcards(text) {
  let groqError;

  if (canUseGroq()) {
    try {
      return await generateFlashcardsWithGroq(text);
    } catch (error) {
      groqError = error;
      console.warn(
        `Groq flashcard generation failed. Falling back to Gemini. ${getErrorMessage(error)}`,
      );
    }
  } else {
    console.warn("GROQ_API_KEY is missing. Falling back to Gemini.");
  }

  try {
    return await generateFlashcardsWithGemini(text);
  } catch (geminiError) {
    const groqMessage = groqError
      ? `Groq failed: ${getErrorMessage(groqError)}`
      : "Groq is not configured.";

    throw new Error(
      `Flashcard generation failed. ${groqMessage} Gemini failed: ${getErrorMessage(geminiError)}`,
    );
  }
}

async function generateFlashcardsWithGemini(text) {
  const generativeModel = getFlashcardGenerativeModel();
  const streamingResponse = await generativeModel.generateContentStream({
    contents: [
      {
        role: "user",
        parts: [{ text }],
      },
    ],
  });

  const responseText =
    (await streamingResponse.response).candidates?.[0]?.content?.parts?.[0]
      ?.text;

  if (!responseText) {
    throw new Error("The AI service returned an empty response.");
  }

  return parseFlashcardResponse(responseText);
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
