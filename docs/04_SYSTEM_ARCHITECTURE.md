# 04 System Architecture

## Architecture style
Modular monorepo with clear domain boundaries.

## Monorepo layout
- `apps/web`
- `apps/api`
- `packages/types`
- `packages/contracts`
- `packages/config`
- `packages/ui` optional

## Backend domain modules
1. auth
2. users
3. donors
4. ngos
5. volunteers
6. donations
7. matching
8. hotspots
9. routes
10. tracking
11. recurring-support
12. notifications
13. uploads
14. analytics
15. admin
16. audit
17. health

## Request flow
Web UI -> typed API client -> NestJS controller -> DTO validation -> service -> Mongoose models -> domain event -> queue/socket notification -> API response

## Async event examples
- donation.created
- donation.accepted
- volunteer.assigned
- route.started
- route.completed
- hotspot.displaced
- recurring.plan.triggered
- ngo.verification.updated

## Storage strategy
- MongoDB stores primary business data
- Redis stores queue metadata, cache, rate-limit buckets if needed
- local disk stores uploads in development using an abstract storage provider interface

## Security boundaries
- RBAC at controller and service level
- admin-only moderation routes
- NGO data restricted by organization
- volunteers restricted to assigned routes and permitted dashboards
- donors restricted to their own donations and plans

## Observability
- request logging
- structured app logs
- audit logs for critical actions
- health endpoint
- queue status endpoint for admins

## Core intelligent subsystems
1. NGO recommendation engine
2. hotspot activity and displacement engine
3. route planning and reroute engine
4. analytics aggregation jobs
