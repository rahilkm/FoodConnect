# 01 Master Instructions For AI

You are generating a production-grade web application called **FoodConnect**.

## What to generate
A monorepo with:
- `apps/web` -> Next.js frontend
- `apps/api` -> NestJS backend
- shared packages for types, constants, eslint, tsconfig, and API contracts

## Primary mission
Connect food donors to the most suitable NGOs, then connect NGOs and volunteers to real need through active hotspots and route-based distribution.

## Build philosophy
- implement features fully, not partially
- use robust folder structure
- use typed DTOs, schemas, response contracts, and consistent status codes
- no TODO comments for core features
- no placeholder pages for core flows
- avoid fake logic when a real local implementation can be written
- use seed data for local testing, but persist through MongoDB
- implement all important relations and indexes
- implement proper validation and permissions
- implement proper error handling
- implement file upload abstraction
- implement audit logging for critical actions

## Mandatory capabilities
1. Donor registration/login/profile
2. NGO registration/login/profile/verification
3. Volunteer registration/login/profile/availability
4. Admin moderation
5. Donation creation and tracking
6. Smart NGO recommendation
7. NGO acceptance/rejection and assignment
8. Volunteer pickup and delivery route lifecycle
9. Hotspot management with time slots and displacement
10. Dynamic rerouting
11. Impact summaries and analytics
12. Recurring support plans
13. Notifications and real-time status updates
14. Search/filter/sort across critical lists
15. Audit trail and moderation logs

## Output quality requirements
- runnable locally
- production-like coding standards
- no circular dependencies
- modular domain boundaries
- consistent naming
- deterministic seeds
- readable README
