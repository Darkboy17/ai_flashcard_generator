import { VertexAI } from "@google-cloud/vertexai";

import { getJsonEnvFromBase64 } from "../utils/env.js";
import { getVertexFlashcardSystemInstruction } from "../utils/flashcardPrompt.js";

const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const DEFAULT_PROJECT_ID = "flashcard-saas-432607";
const DEFAULT_LOCATION = "us-central1";
const FLASHCARD_MODEL = "gemini-1.5-flash-001";

let generativeModel;

export function getFlashcardGenerativeModel() {
  if (generativeModel) {
    return generativeModel;
  }

  const credentials = getJsonEnvFromBase64("SERVICE_ACCOUNT_KEY_BASE64");
  const vertexAi = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID || DEFAULT_PROJECT_ID,
    location: process.env.GOOGLE_CLOUD_LOCATION || DEFAULT_LOCATION,
    googleAuthOptions: {
      credentials,
      scopes: [CLOUD_PLATFORM_SCOPE],
    },
  });

  generativeModel = vertexAi.preview.getGenerativeModel({
    model: FLASHCARD_MODEL,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
    systemInstruction: {
      parts: [getVertexFlashcardSystemInstruction()],
    },
  });

  return generativeModel;
}
