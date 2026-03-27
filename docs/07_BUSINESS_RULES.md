# 07 Business Rules

## Donation lifecycle rules
1. A donation starts in `draft` or `posted`.
2. Recommendations must be created when a donation is posted.
3. A donation can be accepted only by the selected NGO or by the NGO chosen from recommendations.
4. Once accepted, status becomes `accepted`.
5. Volunteer can be assigned only after NGO acceptance.
6. Pickup can be marked complete only by assigned volunteer or NGO manager.
7. Delivery can be marked complete only after pickup.
8. Impact summary can be created only after delivery.
9. Donation cannot be edited after `accepted` except for admin override.

## NGO recommendation rules
- NGO must be active
- NGO must serve donor area or be within allowed distance
- NGO must accept donation type
- NGO must have sufficient available capacity
- if pickup required, NGO must support pickup or have volunteer coverage
- expired or near-expired donations should downrank distant NGOs
- verification and reliability positively influence ranking
- underserved NGO boost may slightly increase score for fair distribution

## Hotspot rules
- hotspots have status: active, low_activity, displaced, inactive
- hotspots have active time windows
- routes should prefer currently active hotspots
- displaced hotspots cannot receive new route assignments
- displaced hotspots should trigger backup hotspot recommendation
- hotspot activity must be updated by NGO or volunteer with audit logging

## Route rules
- each active route belongs to one NGO
- each route has one primary volunteer
- a route contains ordered route stops
- a route cannot be completed until all mandatory stops are resolved
- reroute action must preserve route history
- route issues create notifications and audit logs

## Verification rules
- NGOs can exist as unverified
- only admins can change verification status
- verification status affects badges and recommendation score
- past proof, response time, and reliability score influence trust display

## Recurring support rules
- donor can create weekly or monthly plan
- plan can be paused, resumed, or cancelled
- plan may target a preferred NGO or allow auto-match
- job runner generates donation instances according to schedule
- donor receives history and impact rollups

## Audit rules
The following actions must create audit logs:
- NGO verification change
- donation acceptance/rejection
- volunteer assignment
- hotspot displacement
- reroute
- recurring plan changes
- admin moderation actions

## Privacy rules
- donors can choose anonymity level for public impact display
- beneficiary identity is not stored as a public-facing direct consumer model
- hotspot notes must avoid unnecessary personally identifiable information
