const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API_BASE_URL
  );
}

export async function apiFetch(path, options = {}) {
  const { authToken, ...fetchOptions } = options;

  if (!authToken) {
    throw new Error("Please sign in before using this feature.");
  }

  const requestId = createRequestId();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      Authorization: `Bearer ${authToken}`,
      ...fetchOptions.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "API request failed");
  }

  return data;
}

function createRequestId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
