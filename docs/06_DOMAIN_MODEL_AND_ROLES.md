# 06 Domain Model And Roles

## Roles
1. Donor
2. NGO Manager
3. Volunteer
4. Admin

## User model
Every authenticated actor is a User.
Role-specific documents extend the user identity.

## Main aggregates
- User
- DonorProfile
- NgoProfile
- VolunteerProfile
- Donation
- DonationRecommendation
- DonationTrackingEvent
- Hotspot
- Route
- RouteStop
- RecurringSupportPlan
- Notification
- VerificationRequest
- AuditLog
- ImpactSummary

## Donor responsibilities
- create donations
- view recommendation results
- choose NGO or accept auto-selected NGO
- track donations
- manage recurring plans
- view proof and impact reports

## NGO responsibilities
- manage NGO profile and service area
- maintain capacity and accepted donation types
- accept/reject donations
- assign volunteers
- manage hotspots
- manage routes
- mark deliveries and upload proof
- respond to displacement events

## Volunteer responsibilities
- view assignments
- mark pickup and delivery progression
- report route issues
- receive reroute instructions
- upload route notes and proof if allowed

## Admin responsibilities
- verify NGOs
- inspect reports and flags
- view audit logs
- manage dispute resolution
- moderate abusive or fraudulent entities
- seed and manage global reference settings

## Core relations
- one User has one role-specific profile
- one NGO has many managers optionally if multi-manager support is enabled
- one NGO has many hotspots
- one NGO has many routes
- one donation belongs to one donor
- one donation can have many recommendations but one selected NGO
- one route belongs to one NGO and one volunteer
- one route can service one or multiple hotspot stops
- one donation has many tracking events
- one recurring plan belongs to one donor
