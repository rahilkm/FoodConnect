# 25 Error Handling Validation And Conventions

## Validation
- backend: DTO validation with class-validator
- frontend: Zod schemas aligned to backend DTOs
- common enums shared in package

## API response shape
Success:
```json
{
  "success": true,
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "error": {
    "code": "DONATION_INVALID_STATE",
    "message": "Donation cannot be marked delivered before pickup is complete.",
    "details": {}
  }
}
```

## Error code examples
- AUTH_INVALID_CREDENTIALS
- AUTH_FORBIDDEN
- NGO_NOT_VERIFIED
- DONATION_NOT_FOUND
- DONATION_INVALID_STATE
- HOTSPOT_DISPLACED
- ROUTE_REROUTE_REQUIRED
- RECURRING_PLAN_INACTIVE

## Coding conventions
- no anonymous any types
- no business logic inside controllers
- no duplicated enum declarations
- service methods must be cohesive and testable
- use transactions or compensating logic where multi-document consistency is sensitive
