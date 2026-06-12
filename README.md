# AI Flashcard Generator

AI Flashcard Generator is a full-stack study app with a standalone Node.js REST
API and a Next.js frontend. Signed-in users can generate flashcards from a text
prompt, save decks to Firebase/Firestore, review saved collections, and start a
Stripe subscription checkout flow.

## Tech Stack

```text
backend/   Node.js HTTP API, Clerk JWT auth, Groq, Vertex AI/Gemini, Stripe
frontend/  Next.js App Router, React, Clerk, Material UI, Firebase, Stripe.js
scripts/   Reusable deployment automation
```

## Features

- Generate 10 concise flashcards from any topic, notes, or study prompt.
- Use Groq first when `GROQ_API_KEY` is configured, with Gemini on Vertex AI as
  the fallback provider.
- Protect all `/api/*` backend routes with Clerk bearer-token authentication.
- Save, list, open, and delete flashcard collections in Firestore.
- Start and verify Stripe subscription checkout sessions.
- View backend API documentation from Swagger UI at `/api-docs`.
- Write structured JSON-line API and error logs, including request IDs and user
  context.

## Repository Layout

```text
.
|-- backend/
|   |-- clients/      Provider clients for Stripe and Vertex AI
|   |-- services/     Checkout and flashcard generation workflows
|   |-- utils/        Auth, env loading, HTTP helpers, logging, OpenAPI, parsing
|   |-- server.js     REST API entry point
|   `-- Dockerfile
|-- frontend/
|   |-- app/          Next.js App Router route files
|   |-- components/   Shared UI building blocks
|   |-- database/     Firestore collection constants
|   |-- features/     Route-level feature screens
|   |-- lib/          Firebase and Stripe browser clients
|   |-- services/     API and Firestore service functions
|   `-- scripts/      Build helpers
|-- scripts/
|   `-- deploy-backend.ps1
`-- README.md
```

## Prerequisites

- Node.js 18 or newer.
- npm.
- Clerk application credentials.
- Firebase project with Firestore enabled.
- Stripe secret and publishable keys if checkout is used.
- Groq API key, Vertex AI service-account credentials, or both.
- Docker, SSH access, nginx, and certbot only when using the backend VM deploy
  script.

## Backend Setup

Install dependencies and start the API:

```powershell
cd "D:\Local Disk E\All Software Projects\ai_flashcard_generator\backend"
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

The backend runs at:

```text
http://localhost:5000
```

### Backend Environment

Create `backend/.env.local` from `backend/.env.example`.

```env
PORT=5000
NODE_ENV=development
API_LOG_DIR=logs
LOG_WATCH_EMAIL=opcodegenerator@gmail.com
CLERK_ISSUER_URL=
CLERK_JWKS_URL=

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

STRIPE_SECRET_KEY=

GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

SERVICE_ACCOUNT_KEY_BASE64=
GOOGLE_CLOUD_PROJECT_ID=flashcard-saas-432607
GOOGLE_CLOUD_LOCATION=us-central1
```

Important backend settings:

- `CLERK_ISSUER_URL` should be your Clerk issuer URL, for example
  `https://your-instance.clerk.accounts.dev`.
- `CLERK_JWKS_URL` is optional. When omitted, the backend uses
  `${CLERK_ISSUER_URL}/.well-known/jwks.json`.
- `GROQ_API_KEY` enables the primary Groq flashcard provider.
- `SERVICE_ACCOUNT_KEY_BASE64` enables the Gemini fallback through Vertex AI. It
  should be a base64-encoded Google service-account JSON file.
- `FRONTEND_URL` is used for checkout success/cancel redirects.
- `CORS_ORIGIN` should match the deployed frontend origin in production. It can
  also be a comma-separated allowlist, for example
  `https://app.example.com,https://app-git-master-team.vercel.app`. The backend
  will echo only the matching request origin in `Access-Control-Allow-Origin`.

### Backend Scripts

```powershell
npm.cmd run dev     # Start with node --watch
npm.cmd run start   # Start the API
npm.cmd run check   # Syntax-check server.js
```

## Frontend Setup

Install dependencies and start the Next.js app:

```powershell
cd "D:\Local Disk E\All Software Projects\ai_flashcard_generator\frontend"
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

The frontend runs at:

```text
http://localhost:3000
```

### Frontend Environment

Create `frontend/.env.local` from `frontend/.env.example`.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
```

Important frontend settings:

- `NEXT_PUBLIC_API_URL` must include the `/api` suffix, for example
  `http://localhost:5000/api`.
- In production, `NEXT_PUBLIC_API_URL` must point at the deployed backend URL.
  The frontend intentionally throws an error when a remote browser host is
  configured to call a localhost API.
- Firebase browser config currently lives in `frontend/lib/firebase/client.js`.
  Update that file if the app moves to a different Firebase project.

### Frontend Scripts

```powershell
npm.cmd run dev                # Start Next.js dev server
npm.cmd run lint               # Run Next.js lint
npm.cmd run build              # Build Next.js and prepare standalone output
npm.cmd run start              # Start Next.js
npm.cmd run serve:standalone   # Serve .next/standalone/server.js
```

## API Reference

Public backend routes:

```text
GET /              HTML welcome page
GET /health        Health check
GET /api-docs      Swagger UI
GET /openapi.json  OpenAPI JSON document
```

Authenticated backend routes:

```text
POST /api/generate
POST /api/checkout-sessions
GET  /api/checkout-sessions?session_id=...
```

All `/api/*` routes require:

```http
Authorization: Bearer <clerk-session-token>
```

Optional request tracing headers:

```http
X-Request-Id: <request-id>
X-Correlation-Id: <correlation-id>
X-User-Email: <signed-in-email>
```

## Development Workflow

Run the backend and frontend in separate terminals.

Terminal 1:

```powershell
cd "D:\Local Disk E\All Software Projects\ai_flashcard_generator\backend"
npm.cmd run dev
```

Terminal 2:

```powershell
cd "D:\Local Disk E\All Software Projects\ai_flashcard_generator\frontend"
npm.cmd run dev
```

Then open:

```text
http://localhost:3000
```

Useful checks before pushing:

```powershell
cd backend
npm.cmd run check

cd ..\frontend
npm.cmd run lint
```

If a stale `.next/cache/eslint` file causes a local permission error, run ESLint
directly with cache disabled:

```powershell
npx.cmd eslint . --no-cache
```

## Logging

The backend writes JSON lines to `backend/logs/` by default:

```text
logs/api.log      Request summaries
logs/errors.log   Failed requests and exceptions
```

Each request receives an `X-Request-Id` response header. When the signed-in user
email matches `LOG_WATCH_EMAIL`, log entries include `"watchedUser": true`.

## Production

Deploy the backend and frontend separately.

Backend:

```powershell
cd backend
npm.cmd install --omit=dev
npm.cmd run start
```

Frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run build
npm.cmd run start
```

Production environment reminders:

- Set frontend `NEXT_PUBLIC_API_URL` to the deployed backend API root, such as
  `https://flashcardapi.example.com/api`.
- Set backend `FRONTEND_URL` to the canonical deployed frontend origin.
- Set backend `CORS_ORIGIN` to the deployed frontend origin, or to a
  comma-separated list when you need to allow Vercel production and preview
  URLs.
- Use Clerk production keys for deployed environments. Clerk development keys
  work for local development, but Clerk warns about strict limits and they should
  not be used on production Vercel deployments.
- Keep `.env`, `.env.local`, `.env.prod`, service-account files, and private keys
  out of Git.

## Backend VM Deploy Script

Use `scripts/deploy-backend.ps1` to build and push a Docker image, SSH into a
VM, configure firewall/nginx/certbot, upload an env file, pull the image, and
run the backend container.

Example:

```powershell
.\scripts\deploy-backend.ps1 `
  -ImageRepository darkboy18/ai-flashcard-api `
  -Tag arm64 `
  -Platform linux/arm64 `
  -SshHost your-vm-ip-or-host `
  -SshUser ubuntu `
  -Domain flashcardapi.example.com `
  -SiteName flashcardapi `
  -ContainerName flashcardapi-container `
  -HostPort 5000 `
  -ContainerPort 5000 `
  -LocalEnvFile .env `
  -RequiredEnvKeys @("CLERK_ISSUER_URL","STRIPE_SECRET_KEY","GROQ_API_KEY") `
  -CertbotMode nginx
```

Every normal run rebuilds the local image, pushes the tag, pulls that tag on the
VM, removes the old container, and starts a fresh container with the latest
image and env file. By default, Docker binds to `127.0.0.1` on the VM and nginx
proxies to it. Pass `-BindAddress ""` only when the Docker port should be bound
publicly.
