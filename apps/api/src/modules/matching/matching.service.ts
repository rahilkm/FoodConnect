import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NgoProfile, NgoProfileDocument } from '../ngos/schemas/ngo-profile.schema';
import { Donation, DonationDocument } from '../donations/schemas/donation.schema';
import {
  VerificationStatus, NeedLevel, RecommendationTag,
  DonationType, StorageRequirement,
} from '@foodconnect/types';

interface ScoredNgo {
  ngoId: string;
  score: number;
  tag: RecommendationTag;
  reasons: string[];
  warnings: string[];
  distanceKm?: number;
  ngo: Record<string, unknown>;
}

const WEIGHTS = {
  distance: 25,
  compatibility: 20,
  capacity: 20,
  urgency: 15,
  response: 10,
  trust: 10,
};

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(NgoProfile.name) private ngoModel: Model<NgoProfileDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
  ) {}

  async getRecommendations(donationId: string, limit = 5): Promise<ScoredNgo[]> {
    const donation = await this.donationModel.findById(donationId).lean();
    if (!donation) throw new Error('Donation not found');

    const allNgos = await this.ngoModel
      .find({ isActive: true })
      .lean();

    const scored = (allNgos as any[])
      .map((ngo) => this.scoreNgo(ngo, donation as any))
      .filter((s): s is ScoredNgo => s !== null)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) return [];

    // Assign tags
    const result = scored.slice(0, limit).map((item, idx) => ({
      ...item,
      tag: this.assignTag(item, idx, scored),
    }));

    return result;
  }

  scoreNgo(ngo: NgoProfileDocument, donation: DonationDocument): ScoredNgo | null {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let totalScore = 0;

    // --- Hard exclusions ---
    if (!ngo.isActive) return null;
    if (!ngo.acceptedDonationTypes.includes(donation.donationType as DonationType)) {
      return null;
    }
    if (ngo.currentAvailableCapacity <= 0) return null;
    if (donation.expiresAt && new Date(donation.expiresAt) < new Date()) return null;
    if (donation.pickupRequired && !ngo.pickupSupported) {
      warnings.push('Pickup required but not always supported');
    }

    // --- Distance score (25 pts) ---
    let distanceKm: number | undefined;
    if (donation.donorGeoPoint?.coordinates && ngo.geoPoint?.coordinates) {
      distanceKm = this.haversine(
        donation.donorGeoPoint.coordinates[1],
        donation.donorGeoPoint.coordinates[0],
        ngo.geoPoint.coordinates[1],
        ngo.geoPoint.coordinates[0],
      );
      const maxRadius = ngo.serviceAreas?.[0]?.radiusKm || 15;
      const distScore = Math.max(0, 1 - distanceKm / (maxRadius * 2));
      totalScore += distScore * WEIGHTS.distance;
      if (distanceKm < 3) reasons.push(`Only ${distanceKm.toFixed(1)}km away`);
      else if (distanceKm < maxRadius) reasons.push('Within service area');
      else warnings.push(`${distanceKm.toFixed(1)}km away — may cause delay`);
    } else {
      totalScore += WEIGHTS.distance * 0.5; // neutral if no geo data
    }

    // --- Compatibility score (20 pts) ---
    let compatScore = 1.0;
    if (donation.storageRequirement === StorageRequirement.REFRIGERATED && !ngo.coldStorage) {
      compatScore -= 0.5;
      warnings.push('No cold storage — refrigerated food may not be optimal');
    } else if (donation.storageRequirement === StorageRequirement.REFRIGERATED && ngo.coldStorage) {
      reasons.push('Cold storage available');
    }
    totalScore += compatScore * WEIGHTS.compatibility;

    // --- Capacity score (20 pts) ---
    const capacityRatio = Math.min(ngo.currentAvailableCapacity / ngo.dailyCapacity, 1);
    const quantityFit = Math.min(donation.quantity / (ngo.currentAvailableCapacity || 1), 1);
    const capacityScore = capacityRatio * (1 - quantityFit * 0.3);
    totalScore += capacityScore * WEIGHTS.capacity;
    if (capacityRatio > 0.7) reasons.push('High capacity available');
    else if (capacityRatio < 0.2) warnings.push('Near capacity limit');

    // --- Urgency score (15 pts) ---
    const needMap = { [NeedLevel.CRITICAL]: 1, [NeedLevel.HIGH]: 0.8, [NeedLevel.MEDIUM]: 0.5, [NeedLevel.LOW]: 0.2 };
    const urgencyScore = needMap[ngo.currentNeedLevel] || 0.5;
    totalScore += urgencyScore * WEIGHTS.urgency;
    if (ngo.currentNeedLevel === NeedLevel.CRITICAL) reasons.push('Critical need — urgent match');
    else if (ngo.currentNeedLevel === NeedLevel.HIGH) reasons.push('High current need');

    // --- Response speed score (10 pts) ---
    const responseScore = Math.max(0, 1 - ngo.averageResponseMinutes / 120);
    totalScore += responseScore * WEIGHTS.response;
    if (ngo.averageResponseMinutes < 20) reasons.push('Very fast response time');

    // --- Trust/reliability score (10 pts) ---
    const trustScore = ngo.reliabilityScore;
    if ([VerificationStatus.VERIFIED, VerificationStatus.TRUSTED].includes(ngo.verificationStatus as VerificationStatus)) {
      totalScore += trustScore * WEIGHTS.trust;
      reasons.push('Verified NGO');
    } else {
      totalScore += trustScore * WEIGHTS.trust * 0.5;
    }

    // Fairness boost for underserved NGOs (smaller mealsServed)
    if (ngo.mealsServedCount < 100) {
      totalScore += 2;
    }

    return {
      ngoId: (ngo as any)._id.toString(),
      score: Math.min(Math.round(totalScore * 10) / 10, 100),
      tag: RecommendationTag.BEST_MATCH, // will be overridden
      reasons,
      warnings,
      distanceKm,
      ngo: {
        id: (ngo as any)._id.toString(),
        name: ngo.name,
        slug: ngo.slug,
        verificationStatus: ngo.verificationStatus,
        currentNeedLevel: ngo.currentNeedLevel,
        currentAvailableCapacity: ngo.currentAvailableCapacity,
        dailyCapacity: ngo.dailyCapacity,
        averagePickupEtaMinutes: ngo.averagePickupEtaMinutes,
        averageResponseMinutes: ngo.averageResponseMinutes,
        reliabilityScore: ngo.reliabilityScore,
        coldStorage: ngo.coldStorage,
        pickupSupported: ngo.pickupSupported,
        serviceAreas: ngo.serviceAreas,
      } as Record<string, unknown>,
    };
  }

  private assignTag(item: ScoredNgo, idx: number, all: ScoredNgo[]): RecommendationTag {
    if (idx === 0) return RecommendationTag.BEST_MATCH;
    const ngo = item.ngo as any;

    if (ngo.averagePickupEtaMinutes < 30) return RecommendationTag.FASTEST_PICKUP;
    if (
      ngo.verificationStatus === VerificationStatus.TRUSTED ||
      ngo.reliabilityScore > 0.85
    ) return RecommendationTag.TRUSTED_PARTNER;
    if (ngo.mealsServedCount < 100) return RecommendationTag.UNDERSERVED;
    return RecommendationTag.BACKUP_OPTION;
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number) {
    return (deg * Math.PI) / 180;
  }
}
