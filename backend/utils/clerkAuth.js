import crypto from "crypto";

import { getRequiredEnv } from "./env.js";

const JWKS_CACHE_TTL_MS = 5 * 60 * 1000;
const CLOCK_TOLERANCE_SECONDS = 30;

let jwksCache;

export class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

export async function authenticateClerkRequest(req) {
  const token = getBearerToken(req);

  if (!token) {
    throw new AuthError("Authentication token is required.");
  }

  const { header, payload, signingInput, signature } = decodeJwt(token);
  const issuer = getRequiredEnv("CLERK_ISSUER_URL").replace(/\/$/, "");

  if (header.alg !== "RS256") {
    throw new AuthError("Unsupported authentication token algorithm.");
  }

  if (!header.kid) {
    throw new AuthError("Authentication token key id is missing.");
  }

  validateClaims(payload, issuer);

  const signingKey = await getSigningKey(header.kid, issuer);
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(signingInput);
  verifier.end();

  const isValid = verifier.verify(signingKey, signature);

  if (!isValid) {
    throw new AuthError("Authentication token signature is invalid.");
  }

  return {
    userId: payload.sub,
    sessionId: payload.sid,
    email: getClaimEmail(payload),
    claims: payload,
  };
}

function getBearerToken(req) {
  const authorizationHeader = req.headers.authorization;

  if (
    typeof authorizationHeader !== "string" ||
    !authorizationHeader.startsWith("Bearer ")
  ) {
    return undefined;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
}

function decodeJwt(token) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new AuthError("Authentication token is malformed.");
  }

  try {
    return {
      header: JSON.parse(decodeBase64Url(parts[0])),
      payload: JSON.parse(decodeBase64Url(parts[1])),
      signingInput: `${parts[0]}.${parts[1]}`,
      signature: Buffer.from(parts[2], "base64url"),
    };
  } catch {
    throw new AuthError("Authentication token could not be decoded.");
  }
}

function validateClaims(payload, issuer) {
  const now = Math.floor(Date.now() / 1000);

  if (payload.iss !== issuer) {
    throw new AuthError("Authentication token issuer is invalid.");
  }

  if (!payload.sub) {
    throw new AuthError("Authentication token subject is missing.");
  }

  if (!payload.exp || payload.exp <= now - CLOCK_TOLERANCE_SECONDS) {
    throw new AuthError("Authentication token has expired.");
  }

  if (payload.nbf && payload.nbf > now + CLOCK_TOLERANCE_SECONDS) {
    throw new AuthError("Authentication token is not active yet.");
  }
}

async function getSigningKey(keyId, issuer) {
  let jwks = await getJwks(issuer);
  let jwk = jwks.keys?.find((key) => key.kid === keyId);

  if (!jwk) {
    jwks = await getJwks(issuer, { forceRefresh: true });
    jwk = jwks.keys?.find((key) => key.kid === keyId);
  }

  if (!jwk) {
    throw new AuthError("Authentication token signing key was not found.");
  }

  return crypto.createPublicKey({
    key: jwk,
    format: "jwk",
  });
}

async function getJwks(issuer, { forceRefresh = false } = {}) {
  const now = Date.now();
  const jwksUrl =
    process.env.CLERK_JWKS_URL || `${issuer}/.well-known/jwks.json`;

  if (!forceRefresh && jwksCache?.jwksUrl === jwksUrl && jwksCache.expiresAt > now) {
    return jwksCache.value;
  }

  const response = await fetch(jwksUrl);

  if (!response.ok) {
    throw new AuthError(
      `Unable to load Clerk signing keys. Status: ${response.status}.`,
    );
  }

  const value = await response.json();
  jwksCache = {
    jwksUrl,
    value,
    expiresAt: now + JWKS_CACHE_TTL_MS,
  };

  return value;
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf-8");
}

function getClaimEmail(payload) {
  return (
    payload.email ||
    payload.primary_email_address ||
    payload.primaryEmailAddress ||
    payload["https://clerk.com/email"]
  );
}
