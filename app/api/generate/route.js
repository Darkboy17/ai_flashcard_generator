import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

const { VertexAI } = require("@google-cloud/vertexai");

// Assuming you have the base64 encoded service account key stored in SERVICE_ACCOUNT_KEY_BASE64 environment variable
const encodedKey = process.env.SERVICE_ACCOUNT_KEY_BASE64;
if (!encodedKey) {
  throw new Error(
    "SERVICE_ACCOUNT_KEY_BASE64 environment variable is missing."
  );
}

// Decode the base64 encoded key
const decodedKey = Buffer.from(encodedKey, "base64").toString("utf-8");

// Parse the decoded key into a JavaScript object
const serviceAccountKey = JSON.parse(decodedKey);

// Create a new GoogleAuth instance and specify the target scopes
const auth = new GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

// Get the client object
const client = await auth.getClient();

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "flashcard-saas-432607",
  location: "us-central1",
  //client,
});

// Model currently in use
const model = "gemini-1.5-flash-001";

// Inform the AI what should it focus on when trying to give answers to users.
const textsi_1 = {
  text: `You are a flashcard creator. Your task is to generate clear, concise, and effective flashcards on various topics. Each flashcard should consist of a question on one side and the corresponding answer on the other. Follow these guidelines:

1. Keep questions and answers brief and to the point.
2. Focus on one key concept per flashcard.
3. Use simple language to ensure clarity.
4. For definitions, put the term on one side and its meaning on the other.
5. For facts, put the question on one side and the specific fact on the other.
6. For processes or lists, consider breaking them into multiple cards.
7. Avoid overly complex or ambiguous questions.
8. Ensure that the answer directly corresponds to the question.
9. Use a consistent format for similar types of information.
10. When appropriate, include relevant examples or mnemonics.
11. Tailor the difficulty level to the intended audience.
12. Avoid using true/false questions unless absolutely necessary.
13. Only generate 10 flashcards.

Your goal is to create flashcards that facilitate efficient learning and memorization. Be prepared to generate flashcards on a wide range of subjects, from academic disciplines to practical skills.

Return in the following JSON format without the markdown and remove trailing backticks too.
{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}
`,
};

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
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
    parts: [textsi_1],
  },
});

export async function POST(req) {
  // Assuming the request body contains the initial user message
  const contents = await req.json();

  const reqBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: contents.text }],
      },
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(reqBody);

  const responseData = (await streamingResp.response).candidates[0].content
    .parts[0].text;

  const JSONData = JSON.parse(responseData).flashcards;

  // Parse the JSON response from the OpenAI API
  console.log("data: ", JSONData);

  // Return the flashcards as a JSON response
  return NextResponse.json(JSONData);
}
