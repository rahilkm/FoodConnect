# 16 Mongoose Models Indexes And Relations

## General conventions
- use timestamps on all collections
- define enums centrally
- use ObjectId refs wherever relations are explicit
- use lean reads where possible for list endpoints
- use compound indexes for heavy query paths

## Required indexes

### users
- unique index on email
- index on role + isActive

### donor_profiles
- unique index on userId

### ngo_profiles
- unique index on slug
- index on verificationStatus
- 2dsphere index on geoPoint
- index on currentNeedLevel + isActive
- index on acceptedDonationTypes
- index on isActive + currentAvailableCapacity

### volunteer_profiles
- unique index on userId
- index on linkedNgoId
- index on availabilityStatus
- 2dsphere index on geoPoint

### donations
- index on donorUserId + createdAt desc
- index on selectedNgoId + status
- index on selectedVolunteerId + status
- index on status + createdAt
- index on expiresAt
- 2dsphere index on donorGeoPoint

### donation_recommendations
- unique index on donationId

### donation_tracking_events
- index on donationId + createdAt

### hotspots
- index on ngoId + status
- 2dsphere index on geoPoint
- index on status + lastVerifiedAt

### routes
- index on ngoId + status
- index on volunteerId + status
- index on donationId
- index on plannedStartAt

### recurring_support_plans
- index on donorUserId + status
- index on nextRunAt + status

### notifications
- index on userId + readAt + createdAt

### audit_logs
- index on entityType + entityId + createdAt
- index on actorUserId + createdAt

## Mongoose relation guidance
Use population selectively:
- detail endpoints may populate user/ngo/volunteer references
- list endpoints should use projections and manual joins where faster
- never overpopulate large lists
