import { apiFetch } from "@/services/apiClient";

export async function createCheckoutSession(authToken) {
  return apiFetch("/checkout-sessions", {
    method: "POST",
    authToken,
  });
}

export async function getCheckoutSession(sessionId, authToken) {
  return apiFetch(
    `/checkout-sessions?session_id=${encodeURIComponent(sessionId)}`,
    { authToken },
  );
}
