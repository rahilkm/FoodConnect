# FoodConnect

> A zero-hunger platform connecting food donors to verified NGOs, with real-time volunteer coordination and hotspot-based distribution.

## Prerequisites

- Node.js >= 20
- pnpm >= 9 (`npm i -g pnpm`)
- **MongoDB Community Server** running locally on port 27017
  - Download: https://www.mongodb.com/try/download/community
  - Start: `mongod --dbpath /data/db` (or use MongoDB Compass)

> No Docker required. The app connects directly to your local MongoDB instance.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp env/.env.example apps/api/.env
cp env/.env.example apps/web/.env.local
# Edit the .env files as needed

# 3. Seed the database
pnpm seed

# 4. Start both apps
pnpm dev
```

The API will be at http://localhost:4000  
The web app will be at http://localhost:3000  
Swagger docs at http://localhost:4000/api/v1/docs

## Default Seeded Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foodconnect.local | Password123! |
| NGO Manager | ngo1@foodconnect.local | Password123! |
| Donor | donor1@foodconnect.local | Password123! |
| Volunteer | volunteer1@foodconnect.local | Password123! |

## Architecture

```
foodconnect/
  apps/
    web/          # Next.js 14 App Router frontend
    api/          # NestJS backend
  packages/
    types/        # Shared enums and TypeScript types
    contracts/    # Shared DTO shapes (API contracts)
    config/       # Env validation helpers
    tsconfig/     # Base TypeScript configs
    eslint-config/ # Shared ESLint rules
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both web and API in dev mode |
| `pnpm dev:web` | Start Next.js only |
| `pnpm dev:api` | Start NestJS only |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all unit + integration tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm lint` | Lint all packages |
| `pnpm seed` | Seed MongoDB with demo data |

## Tech Stack

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Three.js, TanStack Query, Zustand, React Hook Form, Zod, Recharts, Leaflet, Socket.IO client

**Backend:** NestJS, TypeScript, MongoDB, Mongoose, Passport JWT, bcrypt, Socket.IO, Swagger, class-validator, Multer, Pino, node-cron

## Features

- 🔐 Role-based auth (Donor, NGO Manager, Volunteer, Admin)
- 🍽️ Smart NGO recommendation engine with scoring
- 📍 Hotspot management with time windows and displacement logic
- 🛣️ Route planning, progress tracking, and rerouting
- 🔄 Recurring support plans with automated scheduling
- 📊 Analytics dashboards per role
- 🔔 Real-time notifications via Socket.IO
- 📁 File upload with proof-of-delivery support
- 🔍 Full audit trail for all critical actions
- 🛡️ RBAC + ownership checks at every endpoint
