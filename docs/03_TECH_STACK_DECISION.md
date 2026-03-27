# 03 Tech Stack Decision

## Chosen stack
### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Zustand
- Recharts
- Leaflet for hotspot and route maps
- Socket.IO client

### Backend
- NestJS
- TypeScript
- MongoDB
- Mongoose
- Redis
- BullMQ
- Socket.IO
- Swagger / OpenAPI
- class-validator
- class-transformer
- Passport JWT
- bcrypt
- Multer for uploads
- Pino logger

### Dev tooling
- pnpm workspaces
- Turborepo
- ESLint
- Prettier
- Husky
- lint-staged
- Jest
- Supertest
- Playwright
- Docker Compose for local services

## Why this stack
### Why Next.js
- modern React framework with App Router, layouts, server and client components, and production guidance in official docs
- strong ecosystem and good fit for authenticated dashboards and admin interfaces

### Why NestJS
- modular architecture
- scalable service/controller/module model
- strong TypeScript support
- easy Swagger integration
- strong support for database techniques and Mongoose integration

### Why MongoDB + Mongoose
- flexible document model fits NGOs, hotspots, routes, tracking events, and nested operational data
- Mongoose provides schema enforcement, model validation, and object-document mapping

### Why Redis + BullMQ
- background jobs for reminders, recurring plans, stale hotspot checks, and analytics materialization

### Why Socket.IO
- real-time status updates for tracking, volunteer progress, and notification events

## Project implementation stance
This is a serious codebase, not a toy app. Prefer explicit backend modules and real database persistence over client-side-only simulation.

## Notes for code generation
- do not pin speculative versions in code comments
- use current stable packages at generation time
- generate configuration for local development first
