# 28 Antigravity Master Prompt

Generate a complete production-grade monorepo for **FoodConnect** from the documentation in this pack.

## Core instruction
Build the actual application code, not just planning documents.

## Output requirements
- create the full repository structure exactly as defined
- use Next.js for `apps/web`
- use NestJS + MongoDB + Mongoose for `apps/api`
- use pnpm workspaces and Turborepo
- generate DTOs, schemas, services, controllers, modules, tests, seeds, and env files
- connect frontend and backend properly
- implement role-based auth with JWT and refresh tokens
- implement donation posting, recommendation, NGO acceptance, volunteer assignment, hotspot routing, displacement rerouting, recurring support, admin verification, notifications, analytics, and audit logging
- include Swagger docs
- include docker compose for MongoDB and Redis
- include upload handling for proof files
- include realistic seed data for Mumbai contexts
- include Playwright/Jest tests for core flows

## Working style
Generate module-by-module in a deterministic order.
Do not skip core business logic.
Do not leave placeholder implementations for important paths.
Prioritize correctness, relation integrity, and compileable code.

## Sequence
1. root config and workspace files
2. shared packages
3. backend config and core modules
4. backend domain modules
5. seeds and tests
6. frontend shell and auth
7. donor flows
8. NGO flows
9. volunteer flows
10. admin flows
11. analytics and polish

## Final expectation
The generated repo should be able to run locally with a documented setup and demonstrate the complete FoodConnect lifecycle.
