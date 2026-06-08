import { apiFetch } from "@/services/apiClient";

export async function generateFlashcards(text, { authToken, userEmail } = {}) {
  return apiFetch("/generate", {
    method: "POST",
    authToken,
    headers: userEmail
      ? {
          "X-User-Email": userEmail,
        }
      : undefined,
    body: JSON.stringify({ text }),
  });
}
