import { createServer } from "http";
import { URL } from "url";

import {
  createCheckoutSession,
  retrieveCheckoutSession,
} from "./services/checkoutService.js";
import { generateFlashcards } from "./services/flashcardGenerationService.js";
import { loadEnvFiles } from "./utils/env.js";
import {
  applyCorsHeaders,
  handleCorsPreflight,
  parseJsonBody,
  sendError,
  sendHtml,
  sendJson,
} from "./utils/http.js";
import {
  attachRequestLogger,
  createRequestContext,
  logApiError,
  setAuthenticatedUser,
} from "./utils/logger.js";
import { authenticateClerkRequest } from "./utils/clerkAuth.js";
import {
  getOpenApiDocument,
  getSwaggerHtml,
  getWelcomeHtml,
} from "./utils/openApi.js";

loadEnvFiles();

const PORT = Number(process.env.PORT || 5000);

const server = createServer(async (req, res) => {
  const requestContext = createRequestContext(req);
  attachRequestLogger(req, res, requestContext);
  applyCorsHeaders(req, res);

  if (handleCorsPreflight(req, res)) {
    return;
  }

  try {
    const url = new URL(req.url, getRequestOrigin(req));

    if (req.method === "GET" && url.pathname === "/") {
      return sendHtml(res, getWelcomeHtml());
    }

    if (req.method === "GET" && url.pathname === "/health") {
      return sendJson(res, { status: "ok" });
    }

    if (req.method === "GET" && url.pathname === "/openapi.json") {
      return sendJson(res, getOpenApiDocument({ origin: getRequestOrigin(req) }));
    }

    if (req.method === "GET" && url.pathname === "/api-docs") {
      return sendHtml(res, getSwaggerHtml());
    }

    if (url.pathname.startsWith("/api/")) {
      const authUser = await authenticateClerkRequest(req);
      setAuthenticatedUser(requestContext, authUser);
    }

    if (req.method === "POST" && url.pathname === "/api/generate") {
      const body = await parseJsonBody(req);
      const text = body?.text;

      if (!text || typeof text !== "string" || !text.trim()) {
        return sendError(res, "Text is required to generate flashcards.", 400);
      }

      const flashcards = await generateFlashcards(text);
      return sendJson(res, flashcards);
    }

    if (
      req.method === "POST" &&
      ["/api/checkout-sessions", "/api/checkout_sessions"].includes(
        url.pathname
      )
    ) {
      const checkoutSession = await createCheckoutSession({
        frontendUrl: getFrontendUrl(req),
      });

      return sendJson(res, checkoutSession);
    }

    if (
      req.method === "GET" &&
      ["/api/checkout-sessions", "/api/checkout_sessions"].includes(
        url.pathname
      )
    ) {
      const sessionId = url.searchParams.get("session_id");

      if (!sessionId) {
        return sendError(res, "Session ID is required", 400);
      }

      const checkoutSession = await retrieveCheckoutSession(sessionId);
      return sendJson(res, checkoutSession);
    }

    return sendError(res, "Route not found", 404);
  } catch (error) {
    res.apiError = error;
    logApiError(requestContext, error);
    return sendError(res, getErrorMessage(error), getErrorStatusCode(error));
  }
});

server.listen(PORT, () => {
  console.log(`REST API listening on http://localhost:${PORT}`);
});

function getRequestOrigin(req) {
  const host = req.headers.host || `localhost:${PORT}`;
  return `http://${host}`;
}

function getFrontendUrl(req) {
  const frontendUrl =
    process.env.FRONTEND_URL || req.headers.origin || "http://localhost:3000";

  return frontendUrl.endsWith("/") ? frontendUrl.slice(0, -1) : frontendUrl;
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function getErrorStatusCode(error) {
  return Number.isInteger(error?.statusCode) ? error.statusCode : 500;
}
