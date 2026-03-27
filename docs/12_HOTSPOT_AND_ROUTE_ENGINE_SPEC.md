# 12 Hotspot And Route Engine Spec

## Hotspot intelligence
Hotspots are dynamic operational zones where food distribution is likely to be effective.

## Hotspot statuses
- active
- low_activity
- displaced
- inactive

## Hotspot time model
Each hotspot contains active windows:
- morning
- afternoon
- evening
- night
or explicit hour ranges.

## Route planning rules
- prefer hotspots active at estimated arrival time
- prefer hotspots with higher unmet demand
- exclude displaced hotspots by default
- keep routes within NGO serviceable geography
- prefer fewer route hops when food expiry is near
- allow NGO override with audit log

## Route entity
A route contains:
- route code
- donation reference
- NGO reference
- volunteer reference
- ordered stops
- route status
- estimated timings
- issue log
- reroute history

## Reroute logic
Triggered when:
- hotspot marked displaced
- volunteer reports no active crowd
- route blocked
- donation nearing expiry and current stop is not viable

## Reroute selection strategy
- same area active hotspot first
- nearest neighboring hotspot second
- hotspot with matching time window third
- fallback shelter or kitchen partner fourth

## Data captured for each stop
- arrival time
- stop status
- quantity delivered
- proof files
- field notes
- issue reason if skipped

## Output
System should provide:
- route suggestions
- backup stops
- reason strings for reroute
- final route timeline
