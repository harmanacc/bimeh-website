# BIM760 Project README

## Overview

BIM760 is the customer app website for an insurance company, built as a full-stack Next.js 16 application. It starts with static, SEO-optimized product detail pages (PDPs) for 10+ insurance products, evolving to include user accounts, insurance reminders, chatbots (with AI suggestions), and an admin panel for content management, SMS campaigns (queues), WhatsApp interfaces, and a simple CMS.

**Core Goals:**

- Rapid MVP for time-to-market.
- SEO-first: SSG for PDPs via MDX + Contentlayer.
- Secure: Server actions/API routes for backend logic.
- Scalable: Monolith now, microservices/Python FastAPI later if needed.
- Deployed via Docker Compose on VPS.

Currently in informative phase—no payments or full user logins yet. Future: Full digitization (quotes, billing, policy storage).

**Next.js 16 Highlights Used:**

- Turbopack: Default for dev/build (2-5x faster).
- Cache Components: `"use cache"` for dynamic islands in static PDPs.
- proxy.ts: Replaces middleware for auth/routing.
- React 19.2: View Transitions, useEffectEvent for smoother UX.

## Project Structure

BIM760/
├── app/ # Next.js App Router: pages, layouts, API routes
│ ├── (customer)/ # Public routes: home, /products/[slug]
│ ├── (admin)/ # Protected: dashboard, CMS, queue management
│ ├── api/ # Backend routes: /api/auth, /api/sms, /api/ai-suggest
│ ├── globals.css # Tailwind setup
│ └── layout.tsx # Root layout with providers
├── components/ # Reusable UI: Hero, CoverageTable, ChatbotEmbed
│ ├── ui/ # shadcn components
│ └── admin/ # Admin-specific
├── content/ # MDX for PDPs: /products/car-insurance.mdx
├── db/ # Drizzle: schema.ts, index.ts (queries), migrations/
├── lib/ # Utilities: auth.ts, db.ts, openai.ts
├── agent-docs/ # For LLM agent: tasks/, solutions/, api.schema.ts
├── public/ # Static assets: images, icons
├── docker-compose.yml # Services: nextjs, postgres, (redis)
├── next.config.js # Config: images, env, Turbopack
├── drizzle.config.ts # DB migrations
├── package.json # Deps: next@16, drizzle-orm, @next-auth/next-auth, etc.
├── tailwind.config.js # Theme: insurance colors (blues, greens)
└── README.md # This file

**Key Folders Explained:**

- `/app`: All routes. Use `(group)` for parallel routes (e.g., customer vs admin).
- `/db`: Centralized DB logic. Queries are pure functions.
- `/lib`: Helpers (e.g., formatPrice, sendSMS). No business logic here.
- `/content`: MDX files processed by Contentlayer for SSG PDPs.

## Getting Started (Local Dev)

1. **Prerequisites:**

   - Node.js 20.9+ (LTS).
   - Docker (for Postgres).
   - PostgreSQL 16+ (via Docker).

2. **Setup:**

   ```bash
   # Clone & Install
   git clone <repo> && cd BIM760
   npm install

   # DB Setup
   npx drizzle-kit generate:pg  # From schema.ts
   docker-compose up -d postgres  # Start DB
   npx drizzle-kit push:pg        # Apply migrations

   # Env Vars (copy .env.example)
   cp .env.example .env
   # Add: DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, TWILIO_SID, etc.

   # Dev Server
   npm run dev  # Turbopack auto-enabled
   Build & Deploy:
   Bash
   npm run build  # Turbopack
   docker-compose up  # Full stack
   ```
