# 13 Realtime Notifications And Jobs

## Realtime events
Use Socket.IO for:
- donation accepted
- volunteer assigned
- pickup completed
- route started
- route updated
- route completed
- hotspot displaced
- reroute suggested
- impact summary created
- admin moderation notice if relevant

## Notification channels
Initial implementation:
- in-app notifications
- websocket events
Optional later:
- email
- WhatsApp/SMS integration layer

## Notification entity fields
- userId
- type
- title
- body
- readAt
- link
- metadata

## Background jobs with BullMQ
1. recurring support plan trigger
2. reminder before scheduled donation window
3. stale hotspot review reminder
4. daily analytics aggregation
5. reliability score recalculation
6. cleanup of expired refresh tokens
7. upload orphan cleanup job

## Reliability score recalculation inputs
- response time consistency
- accepted vs rejected ratio
- delivery completion rate
- admin moderation issues
- proof consistency

## Design requirement
Jobs must be idempotent and safe to retry.
