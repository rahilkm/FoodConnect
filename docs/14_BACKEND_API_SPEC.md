# 14 Backend API Spec

## API style
REST-first with Swagger documentation.
Use `/api/v1`.

## Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`
- GET `/api/v1/auth/me`

## Donors
- GET `/api/v1/donors/me`
- PATCH `/api/v1/donors/me`
- GET `/api/v1/donors/me/donations`
- GET `/api/v1/donors/me/recurring-plans`

## NGOs
- POST `/api/v1/ngos`
- GET `/api/v1/ngos`
- GET `/api/v1/ngos/:id`
- PATCH `/api/v1/ngos/:id`
- GET `/api/v1/ngos/:id/verification`
- POST `/api/v1/ngos/:id/verification-requests`
- GET `/api/v1/ngos/:id/hotspots`
- GET `/api/v1/ngos/:id/routes`

## Volunteers
- GET `/api/v1/volunteers/me`
- PATCH `/api/v1/volunteers/me`
- GET `/api/v1/volunteers/me/routes`
- PATCH `/api/v1/volunteers/me/availability`

## Donations
- POST `/api/v1/donations`
- GET `/api/v1/donations`
- GET `/api/v1/donations/:id`
- PATCH `/api/v1/donations/:id`
- POST `/api/v1/donations/:id/recommendations`
- POST `/api/v1/donations/:id/select-ngo`
- POST `/api/v1/donations/:id/accept`
- POST `/api/v1/donations/:id/reject`
- POST `/api/v1/donations/:id/assign-volunteer`
- POST `/api/v1/donations/:id/pickup-complete`
- POST `/api/v1/donations/:id/delivery-complete`
- GET `/api/v1/donations/:id/tracking`
- POST `/api/v1/donations/:id/proof`

## Hotspots
- POST `/api/v1/hotspots`
- GET `/api/v1/hotspots`
- GET `/api/v1/hotspots/:id`
- PATCH `/api/v1/hotspots/:id`
- POST `/api/v1/hotspots/:id/displace`
- POST `/api/v1/hotspots/:id/activate`
- POST `/api/v1/hotspots/:id/low-activity`
- GET `/api/v1/hotspots/active/by-time`
- GET `/api/v1/hotspots/nearby`

## Routes
- POST `/api/v1/routes`
- GET `/api/v1/routes`
- GET `/api/v1/routes/:id`
- PATCH `/api/v1/routes/:id`
- POST `/api/v1/routes/:id/start`
- POST `/api/v1/routes/:id/complete`
- POST `/api/v1/routes/:id/issue`
- POST `/api/v1/routes/:id/reroute`
- POST `/api/v1/routes/:id/stops/:stopId/arrive`
- POST `/api/v1/routes/:id/stops/:stopId/complete`

## Recurring support
- POST `/api/v1/recurring-support`
- GET `/api/v1/recurring-support`
- GET `/api/v1/recurring-support/:id`
- PATCH `/api/v1/recurring-support/:id`
- POST `/api/v1/recurring-support/:id/pause`
- POST `/api/v1/recurring-support/:id/resume`
- POST `/api/v1/recurring-support/:id/cancel`

## Notifications
- GET `/api/v1/notifications`
- POST `/api/v1/notifications/:id/read`

## Analytics
- GET `/api/v1/analytics/overview`
- GET `/api/v1/analytics/donor/:id`
- GET `/api/v1/analytics/ngo/:id`
- GET `/api/v1/analytics/admin`

## Admin
- GET `/api/v1/admin/users`
- GET `/api/v1/admin/ngos`
- POST `/api/v1/admin/ngos/:id/verify`
- POST `/api/v1/admin/ngos/:id/trust-status`
- GET `/api/v1/admin/audit-logs`
- GET `/api/v1/admin/reports`
- POST `/api/v1/admin/disputes/:id/resolve`
