# 21 Testing QA And Acceptance

## Backend tests
- unit tests for matching service
- unit tests for reroute service
- unit tests for recurring plan scheduler
- integration tests for auth
- integration tests for donation lifecycle
- integration tests for hotspot displacement
- integration tests for admin verification

## Frontend tests
- component tests for recommendation cards
- component tests for donation timeline
- page tests for donor dashboard
- page tests for route detail flows

## End-to-end tests
1. donor creates donation -> NGO selected -> NGO accepts -> volunteer assigned -> route completes
2. hotspot displaced -> reroute suggested -> route updates
3. recurring plan created -> job generates donation
4. admin verifies NGO -> badge visible in donor recommendations

## Acceptance criteria
- seeded app boots locally
- all auth roles can login
- donor can complete full donation flow
- NGO can manage hotspots and routes
- volunteer can progress assigned route
- admin can verify NGO and inspect logs
- analytics pages show meaningful data
- uploads and proofs work locally
