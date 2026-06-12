import crypto from "crypto";
import fs from "fs";
import path from "path";

const DEFAULT_WATCH_EMAIL = "opcodegenerator@gmail.com";

export function createRequestContext(req) {
  const requestId =
    req.headers["x-request-id"] ||
    req.headers["x-correlation-id"] ||
    crypto.randomUUID();
  const userEmail = normalizeEmail(req.headers["x-user-email"]);
  const watchedEmail = normalizeEmail(
    process.env.LOG_WATCH_EMAIL || DEFAULT_WATCH_EMAIL,
  );

  return {
    requestId,
    startedAt: Date.now(),
    method: req.method,
    url: req.url,
    userEmail,
    watchedUser: Boolean(userEmail && userEmail === watchedEmail),
    ip: getClientIp(req),
    origin: req.headers.origin,
    userAgent: req.headers["user-agent"],
  };
}

export function attachRequestLogger(req, res, context) {
  res.setHeader("X-Request-Id", context.requestId);

  res.on("finish", () => {
    const durationMs = Date.now() - context.startedAt;
    const entry = {
      event: "api.request",
      level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      method: context.method,
      path: getPath(context.url),
      statusCode: res.statusCode,
      durationMs,
      userEmail: context.userEmail,
      userId: context.userId,
      sessionId: context.sessionId,
      watchedUser: context.watchedUser,
      ip: context.ip,
      origin: context.origin,
      userAgent: context.userAgent,
      errorMessage: res.apiErrorMessage,
    };

    writeLog("api.log", entry);

    if (res.statusCode >= 400) {
      writeLog("errors.log", {
        ...entry,
        event: "api.error",
        error: serializeError(res.apiError, res.apiErrorMessage),
      });
    }

    writeConsole(entry);
  });
}

export function logApiError(context, error, details = {}) {
  const entry = {
    event: "api.exception",
    level: "error",
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    method: context.method,
    path: getPath(context.url),
    userEmail: context.userEmail,
    userId: context.userId,
    sessionId: context.sessionId,
    watchedUser: context.watchedUser,
    ...details,
    error: serializeError(error),
  };

  writeLog("errors.log", entry);
  writeConsole(entry);
}

export function setAuthenticatedUser(context, authUser) {
  context.userId = authUser.userId;
  context.sessionId = authUser.sessionId;
  context.userEmail = normalizeEmail(authUser.email) || context.userEmail;
  context.watchedUser = isWatchedEmail(context.userEmail);
}

function writeConsole(entry) {
  const message = JSON.stringify(removeEmptyValues(entry));

  if (entry.level === "error") {
    console.error(message);
    return;
  }

  if (entry.level === "warn") {
    console.warn(message);
    return;
  }

  console.log(message);
}

function writeLog(fileName, entry) {
  const logDir = process.env.API_LOG_DIR || path.join(process.cwd(), "logs");
  const filePath = path.join(logDir, fileName);
  const line = `${JSON.stringify(removeEmptyValues(entry))}\n`;

  try {
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(filePath, line);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "api.logger_error",
        level: "error",
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}

function serializeError(error, fallbackMessage) {
  if (!error) {
    return fallbackMessage ? { message: fallbackMessage } : undefined;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress;
}

function getPath(url) {
  return typeof url === "string" ? url.split("?")[0] : undefined;
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : undefined;
}

function isWatchedEmail(email) {
  const watchedEmail = normalizeEmail(
    process.env.LOG_WATCH_EMAIL || DEFAULT_WATCH_EMAIL,
  );

  return Boolean(email && email === watchedEmail);
}

function removeEmptyValues(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  );
}
