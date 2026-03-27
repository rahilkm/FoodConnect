import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return user;
  }

  async findAll(page = 1, limit = 20, role?: string, search?: string) {
    const filter: Record<string, unknown> = {};
    if (role) filter['role'] = role;
    if (search) filter['$or'] = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).lean(),
      this.userModel.countDocuments(filter),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async setActive(id: string, isActive: boolean) {
    return this.userModel.findByIdAndUpdate(id, { isActive }, { new: true }).lean();
  }
}
