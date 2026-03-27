import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DonorProfile, DonorProfileDocument } from './schemas/donor-profile.schema';

@Injectable()
export class DonorsService {
  constructor(@InjectModel(DonorProfile.name) private donorModel: Model<DonorProfileDocument>) {}

  async getOrCreateProfile(userId: string) {
    let profile = await this.donorModel.findOne({ userId }).lean();
    if (!profile) {
      profile = await this.donorModel.create({ userId: new Types.ObjectId(userId) });
    }
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<DonorProfile>) {
    return this.donorModel.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true },
    ).lean();
  }

  async findById(id: string) {
    const p = await this.donorModel.findById(id).lean();
    if (!p) throw new NotFoundException({ code: 'DONOR_PROFILE_NOT_FOUND', message: 'Donor profile not found' });
    return p;
  }
}
