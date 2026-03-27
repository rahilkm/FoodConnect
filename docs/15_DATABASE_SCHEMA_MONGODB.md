# 15 Database Schema MongoDB

## Collections
1. users
2. refresh_tokens
3. donor_profiles
4. ngo_profiles
5. volunteer_profiles
6. verification_requests
7. donations
8. donation_recommendations
9. donation_tracking_events
10. hotspots
11. routes
12. recurring_support_plans
13. notifications
14. audit_logs
15. impact_summaries
16. admin_reports
17. system_settings

## users
- _id
- role
- fullName
- email
- passwordHash
- phone
- isActive
- emailVerifiedAt optional
- createdAt
- updatedAt

## donor_profiles
- userId
- donorType
- defaultAddress
- geoPoint
- preferredRadiusKm
- preferredDonationTypes
- wantsImpactReports
- anonymityPreference

## ngo_profiles
- ownerUserId
- name
- slug
- description
- verificationStatus
- registrationNumber
- contactPhone
- contactEmail
- serviceAreas
- acceptedDonationTypes
- pickupSupported
- averagePickupEtaMinutes
- averageResponseMinutes
- currentNeedLevel
- dailyCapacity
- currentAvailableCapacity
- coldStorage
- storageNotes
- reliabilityScore
- mealsServedCount
- isActive
- address
- geoPoint
- proofGallery
- createdAt
- updatedAt

## volunteer_profiles
- userId
- linkedNgoId optional
- availabilityStatus
- vehicleType
- currentAreaLabel
- geoPoint
- canPickup
- canDeliver

## donations
- donorUserId
- donorProfileId
- selectedNgoId optional
- selectedVolunteerId optional
- donationType
- foodType
- quantity
- quantityUnit
- preparedAt
- expiresAt
- pickupRequired
- donorAddress
- donorGeoPoint
- notes
- allergenNotes
- storageRequirement
- status
- recommendationSnapshotId optional
- attachments
- createdAt
- updatedAt

## donation_recommendations
- donationId
- rankedNgoIds
- scoredItems array with score and reasons
- generatedAt

## donation_tracking_events
- donationId
- actorUserId
- actorRole
- status
- note
- metadata
- createdAt

## hotspots
- ngoId
- name
- areaLabel
- geoPoint
- activeTimeWindows
- averagePeopleCount
- tags
- status
- displacementRisk
- lastVerifiedAt
- notes

## routes
- ngoId
- volunteerId
- donationId
- routeCode
- status
- plannedStartAt
- plannedEndAt
- actualStartAt
- actualEndAt
- stops array
- rerouteHistory array
- issueLog array

## recurring_support_plans
- donorUserId
- donorProfileId
- preferredNgoId optional
- mode
- schedule
- status
- nextRunAt
- notes

## notifications
- userId
- type
- title
- body
- link
- metadata
- readAt

## audit_logs
- actorUserId
- actorRole
- action
- entityType
- entityId
- before
- after
- reason
- metadata
- createdAt
