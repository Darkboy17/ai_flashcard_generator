export function getOpenApiDocument({ origin }) {
  return {
    openapi: "3.0.3",
    info: {
      title: "AI Flashcard Generator REST API",
      version: "1.0.0",
      description:
        "Protected REST API for generating flashcards and managing checkout sessions.",
    },
    servers: [
      {
        url: origin,
        description: "Current API server",
      },
    ],
    tags: [
      { name: "System" },
      { name: "Flashcards" },
      { name: "Checkout" },
    ],
    paths: {
      "/": {
        get: {
          tags: ["System"],
          summary: "API welcome page",
          responses: {
            200: {
              description: "HTML welcome page",
            },
          },
        },
      },
      "/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          responses: {
            200: {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/generate": {
        post: {
          tags: ["Flashcards"],
          summary: "Generate flashcards",
          security: [{ clerkBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: {
                      type: "string",
                      example:
                        "Create flashcards about photosynthesis for a biology quiz.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Generated flashcards",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Flashcard" },
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/BadRequest" },
            401: { $ref: "#/components/responses/Unauthorized" },
            500: { $ref: "#/components/responses/ServerError" },
          },
        },
      },
      "/api/checkout-sessions": {
        post: {
          tags: ["Checkout"],
          summary: "Create a Stripe checkout session",
          security: [{ clerkBearerAuth: [] }],
          responses: {
            200: {
              description: "Stripe checkout session",
              content: {
                "application/json": {
                  schema: { type: "object", additionalProperties: true },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            500: { $ref: "#/components/responses/ServerError" },
          },
        },
        get: {
          tags: ["Checkout"],
          summary: "Retrieve a Stripe checkout session",
          security: [{ clerkBearerAuth: [] }],
          parameters: [
            {
              name: "session_id",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Stripe checkout session",
              content: {
                "application/json": {
                  schema: { type: "object", additionalProperties: true },
                },
              },
            },
            400: { $ref: "#/components/responses/BadRequest" },
            401: { $ref: "#/components/responses/Unauthorized" },
            500: { $ref: "#/components/responses/ServerError" },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        clerkBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Clerk session token from the signed-in frontend user.",
        },
      },
      schemas: {
        Flashcard: {
          type: "object",
          required: ["front", "back"],
          properties: {
            front: { type: "string", example: "What is photosynthesis?" },
            back: {
              type: "string",
              example:
                "The process plants use to convert light energy into chemical energy.",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Unauthorized: {
          description: "Missing or invalid Clerk bearer token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ServerError: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  };
}

export function getWelcomeHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Flashcard Generator API</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f5f1e6;
        color: #10100f;
        font-family: Arial, Helvetica, sans-serif;
      }
      main {
        width: min(860px, calc(100% - 32px));
        background: #10100f;
        color: #fbf5df;
        border: 10px solid #76573d;
        border-radius: 12px;
        padding: clamp(28px, 6vw, 56px);
        box-shadow: 0 28px 80px rgba(21, 32, 28, 0.22);
      }
      p {
        color: rgba(251, 245, 223, 0.74);
        font-size: 18px;
        line-height: 1.6;
        max-width: 680px;
      }
      h1 {
        margin: 0;
        font-size: clamp(36px, 7vw, 68px);
        line-height: 0.98;
      }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 28px;
      }
      a {
        color: #10100f;
        background: #f1d27a;
        border-radius: 999px;
        padding: 12px 18px;
        font-weight: 800;
        text-decoration: none;
      }
      a.secondary {
        color: #fbf5df;
        background: transparent;
        border: 1px solid rgba(251, 245, 223, 0.24);
      }
    </style>
  </head>
  <body>
    <main>
      <h1>AI Flashcard Generator API</h1>
      <p>
        Welcome. This REST API powers AI flashcard generation, checkout
        sessions, request logging, and protected backend workflows for the app.
      </p>
      <nav>
        <a href="/api-docs">Open Swagger Docs</a>
        <a class="secondary" href="/openapi.json">View OpenAPI JSON</a>
        <a class="secondary" href="/health">Health Check</a>
      </nav>
    </main>
  </body>
</html>`;
}

export function getSwaggerHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Flashcard Generator API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #f5f1e6; }
      .topbar { display: none; }
      .swagger-ui .info .title { color: #10100f; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/openapi.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          persistAuthorization: true,
        });
      };
    </script>
  </body>
</html>`;
}
