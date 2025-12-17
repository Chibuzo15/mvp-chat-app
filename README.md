# MVP Chat App

Next.js 14 AI chat application with TypeScript, App Router, and modern tooling.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Prisma** - Database ORM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your database in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-secret-key-here"
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mvp-chat-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts           # JWT & bcrypt utilities
│   ├── prisma.ts         # Prisma client
│   ├── socket-client.ts  # Socket.IO client
│   └── utils.ts          # General utilities
├── prisma/                # Prisma schema
│   └── schema.prisma
└── middleware.ts          # Next.js middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

