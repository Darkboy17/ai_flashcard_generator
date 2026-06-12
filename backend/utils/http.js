const DEFAULT_ALLOWED_METHODS = "GET,POST,OPTIONS";
const DEFAULT_ALLOWED_HEADERS =
  "Content-Type,Authorization,X-Request-Id,X-Correlation-Id,X-User-Email";

export function applyCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin;
  const allowedOrigin = getAllowedOrigin(requestOrigin);

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
  res.setHeader("Access-Control-Allow-Headers", DEFAULT_ALLOWED_HEADERS);
  res.setHeader("Vary", "Origin");
}

export function handleCorsPreflight(req, res) {
  if (req.method !== "OPTIONS") {
    return false;
  }

  res.writeHead(204);
  res.end();
  return true;
}

export async function parseJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf-8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

export function sendJson(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function sendHtml(res, html, status = 200) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

export function sendError(res, message, status = 500) {
  res.apiErrorMessage = message;
  sendJson(res, { error: { message } }, status);
}

function getAllowedOrigin(requestOrigin) {
  const allowedOrigins = getConfiguredOrigins();
  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);

  if (!normalizedRequestOrigin) {
    return allowedOrigins[0] || "*";
  }

  if (allowedOrigins.includes("*")) {
    return "*";
  }

  if (allowedOrigins.includes(normalizedRequestOrigin)) {
    return normalizedRequestOrigin;
  }

  return allowedOrigins[0] || normalizedRequestOrigin;
}

function getConfiguredOrigins() {
  const configuredOrigins = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;

  if (!configuredOrigins) {
    return [];
  }

  return configuredOrigins
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

function normalizeOrigin(origin) {
  return typeof origin === "string" ? origin.trim().replace(/\/$/, "") : "";
}
