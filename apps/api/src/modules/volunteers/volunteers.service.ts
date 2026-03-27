import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VolunteerProfile, VolunteerProfileDocument } from './schemas/volunteer-profile.schema';
import { VolunteerAvailability } from '@foodconnect/types';

@Injectable()
export class VolunteersService {
  constructor(@InjectModel(VolunteerProfile.name) private volunteerModel: Model<VolunteerProfileDocument>) {}

  async getOrCreateProfile(userId: string) {
    let p = await this.volunteerModel.findOne({ userId }).lean();
    if (!p) p = await this.volunteerModel.create({ userId: new Types.ObjectId(userId) });
    return p;
  }

  async updateProfile(userId: string, data: Partial<VolunteerProfile>) {
    return this.volunteerModel.findOneAndUpdate({ userId }, { $set: data }, { new: true, upsert: true }).lean();
  }

  async updateAvailability(userId: string, status: VolunteerAvailability) {
    return this.volunteerModel.findOneAndUpdate({ userId }, { availabilityStatus: status }, { new: true }).lean();
  }

  async findAvailable(ngoId?: string) {
    const filter: Record<string, unknown> = { availabilityStatus: VolunteerAvailability.AVAILABLE };
    if (ngoId) filter['linkedNgoId'] = new Types.ObjectId(ngoId);
    return this.volunteerModel.find(filter).lean();
  }
}
