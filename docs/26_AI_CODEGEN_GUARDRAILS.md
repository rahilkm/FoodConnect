# 26 AI Codegen Guardrails

## Do not do these things
- do not collapse backend into mock JSON once backend generation starts
- do not skip DTOs or validation
- do not omit indexes
- do not use placeholder pages for core flows
- do not leave `TODO` for auth, matching, routes, or admin
- do not generate fake unreadable giant files for all logic
- do not ignore RBAC
- do not skip tests for core services
- do not use in-memory storage for production code paths

## Do these things
- generate module by module
- keep files reasonably sized
- define enums once in shared package
- define constants and status transitions centrally
- write seeds early
- verify compileability as modules are generated
- generate full CRUD only where it is genuinely needed
- keep feature ownership clear

## Critical advice
When uncertain, prefer explicit code and explicit contracts over magic abstractions.
