# 08 Auth Security And Permissions

## Authentication model
- email + password login
- JWT access token
- refresh token rotation
- secure httpOnly cookies for refresh token
- bearer token accepted for API access
- password hashing with bcrypt

## Auth flows
1. register
2. email/password login
3. refresh token
4. logout current session
5. logout all sessions optional
6. password change
7. forgot/reset password optional in first production build

## Authorization
Use RBAC + ownership checks.
- donor: own donations, own plans, own profile
- NGO manager: own NGO resources
- volunteer: assigned route resources and own profile
- admin: all resources with audit

## Permission matrix overview
- donor cannot verify NGOs
- volunteer cannot accept donations unless explicitly allowed by NGO policy
- NGO cannot view unrelated donor private data beyond assigned donations
- admin can override status with logged reason

## Security controls
- DTO validation on every write endpoint
- strong password policy
- brute-force guard on auth endpoints
- rate limiting on login, register, and public contact endpoints
- sanitize upload filenames
- validate upload mime types
- CORS restricted to configured web origin
- environment validation on startup
- request ID correlation in logs
- no secrets in frontend

## Session model
Use refresh token documents stored with:
- userId
- tokenId
- hashedToken
- userAgent
- ip
- expiresAt
- revokedAt

## Protected resources
All profile, donation, hotspot, route, admin, analytics mutation endpoints require auth.
