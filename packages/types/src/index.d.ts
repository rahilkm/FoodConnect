export * from './enums';
export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number];
}
export interface ServiceArea {
    label: string;
    geoPoint?: GeoPoint;
    radiusKm: number;
}
export interface ActiveTimeWindow {
    window: string;
    label?: string;
}
export interface RouteStop {
    hotspotId: string;
    label: string;
    order: number;
    status: string;
    estimatedArrivalAt?: string;
    actualArrivalAt?: string;
    completedAt?: string;
    quantityDelivered?: number;
    proofFiles?: string[];
    fieldNotes?: string;
    issueReason?: string;
}
export interface RerouteHistoryEntry {
    triggeredAt: string;
    reason: string;
    oldStops: string[];
    newStops: string[];
    actorId: string;
}
export interface RecommendationScoredItem {
    ngoId: string;
    score: number;
    tag: string;
    reasons: string[];
    warnings: string[];
    distance?: number;
}
//# sourceMappingURL=index.d.ts.map