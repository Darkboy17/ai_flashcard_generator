# AI Flashcard Generator

Full-stack flashcard app split into a standalone REST API backend and a Next.js frontend.

## Project Layout

```text
backend/    REST API, services, Stripe client, Groq/Gemini AI clients, and utilities
frontend/   Next.js app that consumes the backend API
```

## Backend Setup

```powershell
cd "D:\Local Disk E\All Software Projects\ai_flashcard_generator\backend"
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Backend runs on:

```text
http://localhost:5000
```

Backend API links:

```text
GET /              Welcome page
GET /api-docs      Swagger UI
GET /openapi.json  OpenAPI specification
GET /health        Health check
```

Backend environment:

```env
PORT=5000
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

Flashcard generation uses Groq first when `GROQ_API_KEY` is set. If Groq is missing or returns an error, the backend falls back to Gemini through Vertex AI, which requires `SERVICE_ACCOUNT_KEY_BASE64`.

API logs are written as JSON lines. Request summaries go to `backend/logs/api.log`, and failed requests/exceptions go to `backend/logs/errors.log`. When the signed-in user email matches `LOG_WATCH_EMAIL`, log records include `"watchedUser": true`.

All `/api/*` REST endpoints require a Clerk bearer token. Set `CLERK_ISSUER_URL` to your Clerk issuer, for example `https://your-instance.clerk.accounts.dev`. `CLERK_JWKS_URL` is optional; when omitted, the backend uses `${CLERK_ISSUER_URL}/.well-known/jwks.json`.

## Frontend Setup

```powershell
cd "D:\Local Disk E\All Software Projects\ai_flashcard_generator\frontend"
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Frontend runs on:

```text
http://localhost:3000
```

Frontend environment:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
```

## API Endpoints

```text
GET  /
GET  /api-docs
GET  /openapi.json
GET  /health
POST /api/generate
POST /api/checkout-sessions
GET  /api/checkout-sessions?session_id=...
```

## Development

Run both apps in separate terminals.

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

Set `NEXT_PUBLIC_API_URL` in the frontend deployment to the deployed backend URL, for example:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com/api
```

Set `FRONTEND_URL` and `CORS_ORIGIN` in the backend deployment to the deployed frontend URL.

## Backend VM Deploy Script

Use `scripts/deploy-backend.ps1` to build, push, SSH into a VM, configure firewall/nginx/certbot, pull the image, and run the backend container. Copy the script into any backend folder and run it from there; by default, it uses the current folder as the Docker build context.

Pass `-LocalEnvFile .env` to upload the backend folder's local env file to the VM. If `-RemoteEnvFile` is omitted, the script installs it at `/opt/<SiteName>/.env` and runs Docker with `--env-file`.
Pass `-RequiredEnvKeys @("KEY_ONE","KEY_TWO")` when you want the deploy to fail early if the local or remote env file is missing required keys.

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
  -RequiredEnvKeys @("GROQ_API_KEY","SECRET_KEY","MONGODB_URI") `
  -CertbotMode nginx
```

For a backend like your AI chatbot example:

```powershell
.\scripts\deploy-backend.ps1 `
  -ImageRepository darkboy18/ai-chatbot-api `
  -Tag arm64 `
  -Platform linux/arm64 `
  -SshHost your-vm-ip-or-host `
  -SshUser ubuntu `
  -Domain aichatbotapi.largent.org `
  -SiteName aichatbotapi `
  -ContainerName aichatbotapi-container `
  -HostPort 4004 `
  -ContainerPort 3003 `
  -LocalEnvFile .env `
  -RequiredEnvKeys @("GROQ_API_KEY","SECRET_KEY","MONGODB_URI") `
  -CertbotMode nginx
```

Every normal run rebuilds the local image, pushes the tag, pulls that tag on the VM, removes the old container, and starts a fresh container with the latest image and env file. By default, the container binds to `127.0.0.1` on the VM and nginx proxies to it. To bind the Docker port publicly like `docker run -p 4004:3003`, pass `-BindAddress ""`.
