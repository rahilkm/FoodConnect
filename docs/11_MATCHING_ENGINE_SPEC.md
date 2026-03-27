# 11 Matching Engine Spec

## Purpose
Rank NGOs for a donation using transparent, controllable logic.

## Inputs
### Donation inputs
- foodType
- donationType
- quantity
- pickupRequired
- donor coordinates
- expiry timestamp
- created timestamp
- storage notes
- allergen notes

### NGO inputs
- service areas
- accepted donation types
- capacity available
- pickup support
- response time
- verification status
- reliability score
- need level
- cold storage support
- current operational status

## Scoring weights
- distance: 25
- compatibility: 20
- available capacity: 20
- urgency/need: 15
- response speed: 10
- trust/reliability: 10

Total = 100

## Suggested calculations
### Distance score
Higher if closer or inside service area.

### Compatibility score
Reject or heavily penalize if food type is unsupported or storage needs do not match.

### Capacity score
Higher when available capacity safely accommodates quantity.

### Urgency score
Higher for NGOs with higher current need level and open distribution windows.

### Response score
Higher for lower average response time.

### Trust score
Boost verified and consistently reliable NGOs.

## Hard exclusions
- inactive NGO
- donation type not accepted
- expired donation
- no available capacity
- pickup required but no pickup coverage and no volunteer backup

## Output contract
Return top N NGOs with:
- score
- explanations
- warnings
- tag such as `Best Match`, `Fastest Pickup`, `Trusted Partner`, `Backup Option`

## Fairness rule
Apply a small fairness boost to underserved NGOs so the same large NGO does not monopolize all recommendations when alternatives are genuinely suitable.

## Persistence
Store recommendation snapshots for auditability and donor transparency.
