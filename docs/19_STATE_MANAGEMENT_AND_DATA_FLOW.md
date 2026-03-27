# 19 State Management And Data Flow

## Frontend data strategy
- TanStack Query for server state
- Zustand for lightweight UI state and auth/session helpers
- React Hook Form + Zod for forms

## Query principles
- dedicated query keys per domain
- invalidate on mutations
- optimistic updates only where safe
- route-level loading skeletons
- central API client with token refresh handling

## Suggested stores
- auth store
- notification UI store
- command palette or filter state store optional

## API client responsibilities
- attach access token
- refresh token flow on 401 if appropriate
- normalize errors
- provide typed methods

## Real-time state updates
Socket events should:
- update active tracking views
- increment notification counters
- refresh route detail queries when route changes
- refresh hotspot lists when displacement occurs

## Cache invalidation events
- donation accepted
- volunteer assigned
- pickup completed
- route rerouted
- hotspot status changed
- recurring plan updated
