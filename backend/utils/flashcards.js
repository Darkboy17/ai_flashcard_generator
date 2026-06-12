export function parseFlashcardResponse(responseText) {
  const cleanedResponse = responseText
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsedResponse = JSON.parse(cleanedResponse);
  const flashcards = Array.isArray(parsedResponse)
    ? parsedResponse
    : parsedResponse.flashcards;

  if (!Array.isArray(flashcards)) {
    throw new Error("The AI service did not return flashcards.");
  }

  return flashcards;
}
