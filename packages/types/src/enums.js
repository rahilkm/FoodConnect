"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationTag = exports.HotspotTimeWindow = exports.AnonymityPreference = exports.DonorType = exports.NeedLevel = exports.AuditAction = exports.NotificationType = exports.RecurringPlanStatus = exports.RecurringMode = exports.VehicleType = exports.VolunteerAvailability = exports.RouteStopStatus = exports.RouteStatus = exports.HotspotStatus = exports.VerificationStatus = exports.StorageRequirement = exports.FoodType = exports.DonationType = exports.DonationStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["DONOR"] = "donor";
    UserRole["NGO_MANAGER"] = "ngo_manager";
    UserRole["VOLUNTEER"] = "volunteer";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var DonationStatus;
(function (DonationStatus) {
    DonationStatus["DRAFT"] = "draft";
    DonationStatus["POSTED"] = "posted";
    DonationStatus["RECOMMENDED"] = "recommended";
    DonationStatus["ACCEPTED"] = "accepted";
    DonationStatus["VOLUNTEER_ASSIGNED"] = "volunteer_assigned";
    DonationStatus["PICKUP_COMPLETE"] = "pickup_complete";
    DonationStatus["DELIVERED"] = "delivered";
    DonationStatus["CANCELLED"] = "cancelled";
    DonationStatus["EXPIRED"] = "expired";
})(DonationStatus || (exports.DonationStatus = DonationStatus = {}));
var DonationType;
(function (DonationType) {
    DonationType["COOKED_MEAL"] = "cooked_meal";
    DonationType["RATION_KIT"] = "ration_kit";
    DonationType["DRY_FOOD"] = "dry_food";
    DonationType["MIXED_PACK"] = "mixed_pack";
    DonationType["FRESH_PRODUCE"] = "fresh_produce";
    DonationType["PACKAGED_FOOD"] = "packaged_food";
})(DonationType || (exports.DonationType = DonationType = {}));
var FoodType;
(function (FoodType) {
    FoodType["VEG"] = "veg";
    FoodType["NON_VEG"] = "non_veg";
    FoodType["VEGAN"] = "vegan";
    FoodType["JAIN"] = "jain";
    FoodType["MIXED"] = "mixed";
})(FoodType || (exports.FoodType = FoodType = {}));
var StorageRequirement;
(function (StorageRequirement) {
    StorageRequirement["ROOM_TEMP"] = "room_temp";
    StorageRequirement["REFRIGERATED"] = "refrigerated";
    StorageRequirement["FROZEN"] = "frozen";
    StorageRequirement["HOT"] = "hot";
})(StorageRequirement || (exports.StorageRequirement = StorageRequirement = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["UNVERIFIED"] = "unverified";
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["TRUSTED"] = "trusted";
    VerificationStatus["REJECTED"] = "rejected";
    VerificationStatus["SUSPENDED"] = "suspended";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var HotspotStatus;
(function (HotspotStatus) {
    HotspotStatus["ACTIVE"] = "active";
    HotspotStatus["LOW_ACTIVITY"] = "low_activity";
    HotspotStatus["DISPLACED"] = "displaced";
    HotspotStatus["INACTIVE"] = "inactive";
})(HotspotStatus || (exports.HotspotStatus = HotspotStatus = {}));
var RouteStatus;
(function (RouteStatus) {
    RouteStatus["PLANNED"] = "planned";
    RouteStatus["IN_PROGRESS"] = "in_progress";
    RouteStatus["COMPLETED"] = "completed";
    RouteStatus["CANCELLED"] = "cancelled";
    RouteStatus["ISSUE_REPORTED"] = "issue_reported";
})(RouteStatus || (exports.RouteStatus = RouteStatus = {}));
var RouteStopStatus;
(function (RouteStopStatus) {
    RouteStopStatus["PENDING"] = "pending";
    RouteStopStatus["ARRIVED"] = "arrived";
    RouteStopStatus["COMPLETED"] = "completed";
    RouteStopStatus["SKIPPED"] = "skipped";
})(RouteStopStatus || (exports.RouteStopStatus = RouteStopStatus = {}));
var VolunteerAvailability;
(function (VolunteerAvailability) {
    VolunteerAvailability["AVAILABLE"] = "available";
    VolunteerAvailability["BUSY"] = "busy";
    VolunteerAvailability["OFFLINE"] = "offline";
})(VolunteerAvailability || (exports.VolunteerAvailability = VolunteerAvailability = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["BICYCLE"] = "bicycle";
    VehicleType["MOTORCYCLE"] = "motorcycle";
    VehicleType["CAR"] = "car";
    VehicleType["AUTO"] = "auto";
    VehicleType["VAN"] = "van";
    VehicleType["ON_FOOT"] = "on_foot";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var RecurringMode;
(function (RecurringMode) {
    RecurringMode["WEEKLY"] = "weekly";
    RecurringMode["MONTHLY"] = "monthly";
})(RecurringMode || (exports.RecurringMode = RecurringMode = {}));
var RecurringPlanStatus;
(function (RecurringPlanStatus) {
    RecurringPlanStatus["ACTIVE"] = "active";
    RecurringPlanStatus["PAUSED"] = "paused";
    RecurringPlanStatus["CANCELLED"] = "cancelled";
})(RecurringPlanStatus || (exports.RecurringPlanStatus = RecurringPlanStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["DONATION_POSTED"] = "donation_posted";
    NotificationType["DONATION_ACCEPTED"] = "donation_accepted";
    NotificationType["DONATION_REJECTED"] = "donation_rejected";
    NotificationType["VOLUNTEER_ASSIGNED"] = "volunteer_assigned";
    NotificationType["PICKUP_COMPLETE"] = "pickup_complete";
    NotificationType["DELIVERY_COMPLETE"] = "delivery_complete";
    NotificationType["HOTSPOT_DISPLACED"] = "hotspot_displaced";
    NotificationType["REROUTE_SUGGESTED"] = "reroute_suggested";
    NotificationType["NGO_VERIFIED"] = "ngo_verified";
    NotificationType["RECURRING_TRIGGERED"] = "recurring_triggered";
    NotificationType["ADMIN_MODERATION"] = "admin_moderation";
    NotificationType["IMPACT_SUMMARY_CREATED"] = "impact_summary_created";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["NGO_VERIFICATION_CHANGED"] = "ngo_verification_changed";
    AuditAction["DONATION_ACCEPTED"] = "donation_accepted";
    AuditAction["DONATION_REJECTED"] = "donation_rejected";
    AuditAction["VOLUNTEER_ASSIGNED"] = "volunteer_assigned";
    AuditAction["HOTSPOT_DISPLACED"] = "hotspot_displaced";
    AuditAction["HOTSPOT_STATUS_CHANGED"] = "hotspot_status_changed";
    AuditAction["ROUTE_REROUTED"] = "route_rerouted";
    AuditAction["ROUTE_ISSUE_REPORTED"] = "route_issue_reported";
    AuditAction["RECURRING_PLAN_CHANGED"] = "recurring_plan_changed";
    AuditAction["ADMIN_OVERRIDE"] = "admin_override";
    AuditAction["USER_MODERATED"] = "user_moderated";
    AuditAction["DISPUTE_RESOLVED"] = "dispute_resolved";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var NeedLevel;
(function (NeedLevel) {
    NeedLevel["CRITICAL"] = "critical";
    NeedLevel["HIGH"] = "high";
    NeedLevel["MEDIUM"] = "medium";
    NeedLevel["LOW"] = "low";
})(NeedLevel || (exports.NeedLevel = NeedLevel = {}));
var DonorType;
(function (DonorType) {
    DonorType["INDIVIDUAL"] = "individual";
    DonorType["RESTAURANT"] = "restaurant";
    DonorType["HOTEL"] = "hotel";
    DonorType["CATERER"] = "caterer";
    DonorType["CORPORATE"] = "corporate";
    DonorType["INSTITUTION"] = "institution";
})(DonorType || (exports.DonorType = DonorType = {}));
var AnonymityPreference;
(function (AnonymityPreference) {
    AnonymityPreference["PUBLIC"] = "public";
    AnonymityPreference["SEMI_ANONYMOUS"] = "semi_anonymous";
    AnonymityPreference["ANONYMOUS"] = "anonymous";
})(AnonymityPreference || (exports.AnonymityPreference = AnonymityPreference = {}));
var HotspotTimeWindow;
(function (HotspotTimeWindow) {
    HotspotTimeWindow["MORNING"] = "morning";
    HotspotTimeWindow["AFTERNOON"] = "afternoon";
    HotspotTimeWindow["EVENING"] = "evening";
    HotspotTimeWindow["NIGHT"] = "night";
})(HotspotTimeWindow || (exports.HotspotTimeWindow = HotspotTimeWindow = {}));
var RecommendationTag;
(function (RecommendationTag) {
    RecommendationTag["BEST_MATCH"] = "Best Match";
    RecommendationTag["FASTEST_PICKUP"] = "Fastest Pickup";
    RecommendationTag["TRUSTED_PARTNER"] = "Trusted Partner";
    RecommendationTag["BACKUP_OPTION"] = "Backup Option";
    RecommendationTag["UNDERSERVED"] = "Underserved NGO";
})(RecommendationTag || (exports.RecommendationTag = RecommendationTag = {}));
//# sourceMappingURL=enums.js.map