const DEFAULT_API_BASE_URL = "http://localhost:5000/api";
const LOCALHOST_NAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export function getApiBaseUrl() {
  const apiBaseUrl = (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API_BASE_URL
  );

  if (isBrowserUsingRemoteHost() && isLocalApiUrl(apiBaseUrl)) {
    throw new Error(
      "The frontend is configured to call a localhost API. Set NEXT_PUBLIC_API_URL to your deployed backend URL.",
    );
  }

  return apiBaseUrl;
}

export async function apiFetch(path, options = {}) {
  const { authToken, ...fetchOptions } = options;

  if (!authToken) {
    throw new Error("Please sign in before using this feature.");
  }

  const requestId = createRequestId();
  let response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        Authorization: `Bearer ${authToken}`,
        ...fetchOptions.headers,
      },
    });
  } catch (error) {
    throw new Error(`Unable to reach the API. ${getErrorMessage(error)}`);
  }

  const data = await readJsonResponse(response);

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

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function isBrowserUsingRemoteHost() {
  return (
    typeof window !== "undefined" &&
    !LOCALHOST_NAMES.has(window.location.hostname)
  );
}

function isLocalApiUrl(apiBaseUrl) {
  try {
    const url = new URL(apiBaseUrl);
    return LOCALHOST_NAMES.has(url.hostname);
  } catch {
    return false;
  }
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
