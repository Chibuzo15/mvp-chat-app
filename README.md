# MVP Chat App

A real-time chat application built with Next.js 14, featuring instant messaging, online presence, and a modern UI.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Socket.IO Client

**Backend:**
- Next.js API Routes
- Socket.IO Server
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt (password hashing)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (recommended)

### Option 1: Quick Setup with Docker (Recommended)

1. **Run the setup script:**
```bash
cd mvp-chat-app
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

2. **Update your JWT secret:**
Edit `.env` and change `JWT_SECRET` to a secure random string.

3. **Start the development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app.

### Option 2: Manual Setup

1. **Start Docker services:**
```bash
docker-compose up -d
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your JWT secret:
```env
DATABASE_URL="postgresql://chat_user:chat_password@localhost:5432/mvp_chat?schema=public"
JWT_SECRET="your-secret-key-here-change-this"
```

4. **Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start the development server:**
```bash
npm run dev
```

### Option 3: Without Docker

If you prefer to use your own PostgreSQL:

1. Install PostgreSQL locally
2. Create a database
3. Update `DATABASE_URL` in `.env` with your connection string
4. Follow steps 2-5 from Option 2

### Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Stop Docker services
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis
```

## Features

- **Real-time Messaging:** Instant message delivery via WebSockets
- **User Authentication:** Secure JWT-based auth with HttpOnly cookies
- **Online Presence:** Live user status tracking with multi-tab support
- **Modern UI:** Clean, professional interface with Tailwind CSS
- **Message Persistence:** All messages saved to PostgreSQL
- **AI Chat (Bonus):** Chat with an AI user powered by Gemini
- **Optimistic Updates:** Instant UI feedback before server confirmation
- **Error Handling:** Graceful degradation with user-friendly error messages
- **Docker Support:** Easy local development with Docker Compose

## Deployment (Render / Railway)

This app uses a **custom Node server** (`server.ts`) to run Next.js + Socket.IO together, so deploy it to a platform that supports **long-lived WebSocket connections** and running a Node process (Render / Railway / Fly.io / etc.).

### Production database (free options)

- **Recommended (free tier): Neon Postgres**
  - Create a Neon project and copy the **pooled** connection string as `DATABASE_URL`.
  - Works great with Render/Railway.
- **Alternative (free tier): Supabase Postgres**
  - Create a project and use the connection string as `DATABASE_URL`.
- **Render Postgres free tier** exists, but it’s **ephemeral** (expires after ~30 days) and has no backups, so it’s best for demos only.

### Render checklist

1. **Create a Web Service** from your repo.
2. **Environment variables** (Render → Service → Environment):
   - `DATABASE_URL` (from Neon/Supabase/Render Postgres)
   - `JWT_SECRET` (generate a long random string)
   - `GEMINI_API_KEY` (optional, only needed for AI chat)
   - `HOSTNAME=0.0.0.0`
3. **Build command**:
   - `npm install && npm run build && npx prisma migrate deploy`
4. **Start command**:
   - `npm run start`
5. **Health check**:
   - Add a basic HTTP health check to `/` (or `/login`) so Render knows the service is up.

### Railway checklist

1. Create a new Railway project and add a service from your repo.
2. Add the same **environment variables** as above (`DATABASE_URL`, `JWT_SECRET`, etc.).
3. Set **Build command**:
   - `npm install && npm run build`
4. Set **Start command**:
   - `npx prisma migrate deploy && npm run start`

## Docker Services

The `docker-compose.yml` includes:

- **PostgreSQL 16**: Primary database for user data, messages, and sessions
- **Redis 7**: Ready for future use (presence tracking, caching, pub/sub)

Both services include:
- Health checks for reliability
- Data persistence via Docker volumes
- Auto-restart on failure

## Project Structure

```
mvp-chat-app/
├── app/
│   ├── (auth)/          # Login and registration pages
│   ├── app/             # Main chat interface
│   ├── api/             # API routes (auth, users, chat)
│   └── layout.tsx       # Root layout
├── components/ui/       # Reusable UI components
├── lib/                 # Utilities and helpers
│   ├── auth.ts          # JWT and bcrypt utilities
│   ├── prisma.ts        # Database client
│   ├── socket-client.ts # Socket.IO client
│   └── socket-server.ts # Socket.IO server logic
├── prisma/
│   └── schema.prisma    # Database schema
└── server.ts            # Custom Next.js server with Socket.IO
```

## Key Tradeoffs

### What I Optimized For:
- **Speed to Market:** Focused on core chat functionality over advanced features
- **Simplicity:** In-memory user presence tracking (no Redis)
- **Developer Experience:** Prisma for type-safe database access
- **User Experience:** Optimistic UI updates for instant feedback

### What Was Sacrificed:
- **Scalability:** In-memory state won't work across multiple server instances
- **Advanced Features:** No file uploads, reactions, or message search
- **Offline Support:** No service workers or offline message queuing
- **Message Pagination:** All messages loaded at once (fine for MVP)

## What I'd Improve Next

### High Priority:
1. **Redis Integration:** Move presence tracking and session management to Redis for horizontal scaling
2. **File Uploads:** Add support for images and documents using cloud storage (S3/Cloudflare R2)
3. **Message Pagination:** Implement infinite scroll and load messages on demand
4. **Search:** Full-text search for messages and users
5. **Group Chats:** Support for multi-user conversations

### Medium Priority:
6. **Push Notifications:** Browser and mobile push notifications for new messages
7. **Typing Indicators:** Show when other users are typing
8. **Read Receipts:** Track and display message read status
9. **Message Reactions:** Emoji reactions to messages
10. **Profile Customization:** Avatar uploads and user bio

### Infrastructure:
11. **Rate Limiting:** Prevent abuse with message/request rate limits
12. **Monitoring:** Add logging, error tracking (Sentry), and analytics
13. **Testing:** Unit tests for utilities, integration tests for APIs
14. **CI/CD:** Automated testing and deployment pipeline
15. **Database Optimization:** Add proper indexes and query optimization

## API Routes

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT
- `POST /api/auth/logout` - Logout (clears auth cookie)
- `GET /api/auth/me` - Get current user info
- `GET /api/users` - List all users (except current user)
- `POST /api/chat/start` - Start or get existing chat session
- `GET /api/chat/messages?sessionId=` - Fetch messages for a session
- `GET /api/chat/sessions` - List all chat sessions

## Socket.IO Events

**Client → Server:**
- `join-session` - Join a chat room
- `send-message` - Send a message
- `typing` - Broadcast typing state within a session

**Server → Client:**
- `user-online` - User came online
- `user-offline` - User went offline
- `presence-state` - Initial presence snapshot for newly connected clients
- `receive-message` - New message received
- `user-typing` - Typing state update for a user in a session
- `message-error` - Message send failed

## License

MIT

## Author

Built as an MVP demonstration project.
