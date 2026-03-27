# 20 Local Setup Env And Docker

## Local runtime
- Node.js
- pnpm
- Docker
- Docker Compose

## Local services via Docker
- MongoDB
- Redis
- Mongo Express optional
- Redis Commander optional

## Root scripts expected
- `pnpm install`
- `pnpm dev`
- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm seed`

## Local environment variables
See `env/.env.example`.

## Local upload storage
Use local filesystem in development:
- `apps/api/uploads`
Expose uploaded assets through a static route.

## Docker compose goal
Start infra only, not full app containers by default:
- mongo
- redis

## First-run flow
1. start Docker services
2. install dependencies
3. copy `.env.example` into `.env` files
4. run database seeder
5. start web and api
6. login with seeded accounts
