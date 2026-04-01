# FinanceOS — Main App

Personal finance SaaS monorepo: Next.js frontend + Fastify backend.

## Structure

```
apps/
  web/    ← Next.js 15 frontend (TypeScript, Tailwind, Shadcn/UI, Clerk)
  api/    ← Fastify backend (TypeScript, Drizzle, Plaid, BullMQ)
packages/
  db/     ← Drizzle ORM schema + migrations
  types/  ← Shared TypeScript interfaces
  config/ ← Shared TS/ESLint/Prettier configs
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example apps/web/.env.local
   cp .env.example apps/api/.env
   ```
   Fill in values from Clerk, Plaid, Anthropic dashboards.

3. Start development:
   ```bash
   pnpm dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn/UI, Clerk, TanStack Query
- **Backend**: Fastify, TypeScript, Drizzle ORM, Clerk JWT, Plaid SDK, BullMQ
- **Database**: PostgreSQL (Drizzle ORM), Redis (caching + jobs)
- **Auth**: Clerk (email + Google OAuth)
- **Bank connectivity**: Plaid (US + Canada)
- **AI**: Anthropic Claude (server-side only)
- **Monorepo**: pnpm workspaces + Turborepo
