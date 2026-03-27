# 23 Admin Trust Moderation And Audit

## Admin capabilities
- verify NGOs
- approve or reject verification requests
- change trust status
- inspect suspicious behavior
- review route failures
- review complaints
- inspect proof uploads
- view audit logs

## NGO trust states
- basic
- verified
- trusted_partner
- restricted
- suspended

## Reliability score inputs
- response speed
- completion rate
- proof consistency
- route failure rate
- complaint count
- admin moderation findings

## Audit log schema requirements
- actor
- action
- entity
- before/after snapshots
- reason
- IP/user-agent when relevant
- timestamp

## Moderation events to capture
- verification changes
- trust state changes
- route reassignment by admin
- account suspension
- donation dispute resolution
