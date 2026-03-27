export declare enum UserRole {
    DONOR = "donor",
    NGO_MANAGER = "ngo_manager",
    VOLUNTEER = "volunteer",
    ADMIN = "admin"
}
export declare enum DonationStatus {
    DRAFT = "draft",
    POSTED = "posted",
    RECOMMENDED = "recommended",
    ACCEPTED = "accepted",
    VOLUNTEER_ASSIGNED = "volunteer_assigned",
    PICKUP_COMPLETE = "pickup_complete",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum DonationType {
    COOKED_MEAL = "cooked_meal",
    RATION_KIT = "ration_kit",
    DRY_FOOD = "dry_food",
    MIXED_PACK = "mixed_pack",
    FRESH_PRODUCE = "fresh_produce",
    PACKAGED_FOOD = "packaged_food"
}
export declare enum FoodType {
    VEG = "veg",
    NON_VEG = "non_veg",
    VEGAN = "vegan",
    JAIN = "jain",
    MIXED = "mixed"
}
export declare enum StorageRequirement {
    ROOM_TEMP = "room_temp",
    REFRIGERATED = "refrigerated",
    FROZEN = "frozen",
    HOT = "hot"
}
export declare enum VerificationStatus {
    UNVERIFIED = "unverified",
    PENDING = "pending",
    VERIFIED = "verified",
    TRUSTED = "trusted",
    REJECTED = "rejected",
    SUSPENDED = "suspended"
}
export declare enum HotspotStatus {
    ACTIVE = "active",
    LOW_ACTIVITY = "low_activity",
    DISPLACED = "displaced",
    INACTIVE = "inactive"
}
export declare enum RouteStatus {
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ISSUE_REPORTED = "issue_reported"
}
export declare enum RouteStopStatus {
    PENDING = "pending",
    ARRIVED = "arrived",
    COMPLETED = "completed",
    SKIPPED = "skipped"
}
export declare enum VolunteerAvailability {
    AVAILABLE = "available",
    BUSY = "busy",
    OFFLINE = "offline"
}
export declare enum VehicleType {
    BICYCLE = "bicycle",
    MOTORCYCLE = "motorcycle",
    CAR = "car",
    AUTO = "auto",
    VAN = "van",
    ON_FOOT = "on_foot"
}
export declare enum RecurringMode {
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare enum RecurringPlanStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    CANCELLED = "cancelled"
}
export declare enum NotificationType {
    DONATION_POSTED = "donation_posted",
    DONATION_ACCEPTED = "donation_accepted",
    DONATION_REJECTED = "donation_rejected",
    VOLUNTEER_ASSIGNED = "volunteer_assigned",
    PICKUP_COMPLETE = "pickup_complete",
    DELIVERY_COMPLETE = "delivery_complete",
    HOTSPOT_DISPLACED = "hotspot_displaced",
    REROUTE_SUGGESTED = "reroute_suggested",
    NGO_VERIFIED = "ngo_verified",
    RECURRING_TRIGGERED = "recurring_triggered",
    ADMIN_MODERATION = "admin_moderation",
    IMPACT_SUMMARY_CREATED = "impact_summary_created"
}
export declare enum AuditAction {
    NGO_VERIFICATION_CHANGED = "ngo_verification_changed",
    DONATION_ACCEPTED = "donation_accepted",
    DONATION_REJECTED = "donation_rejected",
    VOLUNTEER_ASSIGNED = "volunteer_assigned",
    HOTSPOT_DISPLACED = "hotspot_displaced",
    HOTSPOT_STATUS_CHANGED = "hotspot_status_changed",
    ROUTE_REROUTED = "route_rerouted",
    ROUTE_ISSUE_REPORTED = "route_issue_reported",
    RECURRING_PLAN_CHANGED = "recurring_plan_changed",
    ADMIN_OVERRIDE = "admin_override",
    USER_MODERATED = "user_moderated",
    DISPUTE_RESOLVED = "dispute_resolved"
}
export declare enum NeedLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum DonorType {
    INDIVIDUAL = "individual",
    RESTAURANT = "restaurant",
    HOTEL = "hotel",
    CATERER = "caterer",
    CORPORATE = "corporate",
    INSTITUTION = "institution"
}
export declare enum AnonymityPreference {
    PUBLIC = "public",
    SEMI_ANONYMOUS = "semi_anonymous",
    ANONYMOUS = "anonymous"
}
export declare enum HotspotTimeWindow {
    MORNING = "morning",
    AFTERNOON = "afternoon",
    EVENING = "evening",
    NIGHT = "night"
}
export declare enum RecommendationTag {
    BEST_MATCH = "Best Match",
    FASTEST_PICKUP = "Fastest Pickup",
    TRUSTED_PARTNER = "Trusted Partner",
    BACKUP_OPTION = "Backup Option",
    UNDERSERVED = "Underserved NGO"
}
//# sourceMappingURL=enums.d.ts.map