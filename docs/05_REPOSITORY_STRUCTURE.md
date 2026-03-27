# 05 Repository Structure

```text
foodconnect/
  apps/
    web/
      app/
      components/
      features/
      hooks/
      lib/
      providers/
      store/
      styles/
      types/
      public/
      tests/
    api/
      src/
        common/
        config/
        modules/
          auth/
          users/
          donors/
          ngos/
          volunteers/
          donations/
          matching/
          hotspots/
          routes/
          tracking/
          recurring-support/
          notifications/
          uploads/
          analytics/
          admin/
          audit/
          health/
        database/
        jobs/
        sockets/
        main.ts
        app.module.ts
      test/
  packages/
    contracts/
    types/
    config/
    eslint-config/
    tsconfig/
  docs/
  schemas/
  seeds/
  infra/
  env/
  package.json
  pnpm-workspace.yaml
  turbo.json
  README.md
```

## Backend module conventions
Each module must follow:
- controller
- service
- dto
- schema
- repository or model helpers where useful
- mapper if response transformation is non-trivial
- events file if module emits domain events
- tests

## Frontend feature conventions
Each major feature should have:
- page route
- components
- hooks
- API client
- validation schema
- typed interfaces
- table/card/list variants where useful

## Shared package conventions
- `packages/contracts`: DTO and response contract shapes
- `packages/types`: enums and shared entity types
- `packages/config`: env validators and shared config helpers
