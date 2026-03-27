# 31 Style Guide And Naming

## Naming
- collections: snake_case
- TypeScript files: kebab-case or module-based consistent naming
- React components: PascalCase
- DTO classes: `CreateDonationDto`, `AssignVolunteerDto`
- enums: PascalCase enum names, SCREAMING_SNAKE_CASE values only if needed externally

## Backend naming
- controllers end with `.controller.ts`
- services end with `.service.ts`
- schemas end with `.schema.ts`
- dto folder contains request DTOs
- response mappers live in `mappers/` if necessary

## Frontend naming
- feature folders by domain
- route files aligned to Next.js conventions
- hooks prefixed with `use`
- API methods grouped per feature

## UI style
- card-driven dashboard layout
- clean whitespace
- consistent badges and status chips
- table + detail drawer for admin-heavy screens
