# MVP Chat App (Shipper Developer MVP)

Real-time 1:1 chat built with **Next.js (App Router)**, **Socket.IO**, **Prisma**, and **PostgreSQL**.

- **Auth**: JWT stored as an **HttpOnly cookie** (via middleware + API routes)
- **Realtime**: WebSockets for message delivery + typing indicators + online/offline presence
- **Persistence**: chat sessions + messages stored in Postgres via Prisma
- **Bonus**: “Chat with AI” (Gemini) with runtime model fallback

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, `lucide-react`
- **Backend**: Next.js Route Handlers + custom Node server (`server.ts`) hosting Socket.IO
- **Realtime**: Socket.IO (rooms per `sessionId`)
- **DB**: PostgreSQL + Prisma
- **Auth**: JWT (HttpOnly cookie), `jose` for verification, `bcrypt` for password hashing
- **AI**: Gemini API via `app/api/ai/reply/route.ts` (optional)

---

## Architecture (High-Level)

### Request / auth flow

- Client authenticates via `POST /api/auth/register` or `POST /api/auth/login`
- Server sets an **HttpOnly cookie** `auth-token`
- `middleware.ts` verifies JWT on protected routes and injects `x-user-id` for API handlers
- API routes read `x-user-id` and query Prisma

### Realtime flow

- `server.ts` runs Next.js and attaches Socket.IO via `lib/socket-server.ts`
- Client loads `/chat`, calls `GET /api/auth/socket-token` and connects Socket.IO
- Presence:
  - server emits `presence-state`, `user-online`, `user-offline`
  - server supports multiple sockets per user (multi-tab)
- Messages:
  - `send-message` → server writes message → emits `receive-message` to the session room
  - server also emits `new-session` to recipient so new conversations appear immediately
- Typing:
  - `typing` → server emits `user-typing` to the session room

### Data model (Prisma)

- `User`
- `ChatSession` (unique user pair via `@@unique([user1Id, user2Id])`)
- `Message` (indexed by `sessionId, createdAt`)

---

## Run Locally

### Prerequisites

- Node.js **18+**
- Docker + Docker Compose (recommended)

### 1) Configure env

```bash
cp .env.example .env
```

Required:
- `DATABASE_URL`
- `JWT_SECRET`

Optional (for AI chat):
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional override; the server auto-falls back if unsupported)

### 2) Start dependencies (Postgres + Redis)

```bash
docker compose up -d
```

### 3) Install deps

```bash
npm install
```

### 4) Migrate DB + generate Prisma client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5) Run the app

```bash
npm run dev
```

Open:
- `http://localhost:3000`

---

## Quick Setup Script (Recommended)

This repo includes a convenience script that creates `.env` (from `.env.example`), boots Docker services, and runs migrations:

```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

---

## Testing the App

### Automated checks

```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint
```

### Manual end-to-end smoke test (recommended checklist)

- **Auth**
  - Register a new user
  - Logout and login again
- **Presence**
  - Login as User A in one browser
  - Login as User B in another browser / incognito
  - Verify online/offline indicators update
- **User → user messaging**
  - Start a conversation (New Message)
  - Send a message and verify it appears instantly on the other user (no refresh)
- **Typing indicator**
  - While typing, the other user should see “Typing…”
- **AI chat (optional)**
  - Start the AI conversation and verify an AI reply is saved and displayed

---

## Useful Commands

```bash
# Database UI
npx prisma studio

# Docker lifecycle
docker compose down
docker compose down -v
docker compose logs -f postgres
docker compose logs -f redis
```

---

## Deployment Notes (Render / Railway / Fly.io)

This app uses a **custom Node server** (`server.ts`) to run Next.js + Socket.IO together, so deploy to a platform that supports:
- running a Node process
- long-lived WebSocket connections

### Typical environment vars

- `DATABASE_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY` (optional)
- `HOSTNAME=0.0.0.0` (often required on PaaS)

### Example (Render)

- **Build**: `npm install && npm run build && npx prisma migrate deploy`
- **Start**: `npm run start`

---
