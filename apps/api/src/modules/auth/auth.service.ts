import {
  Injectable, UnauthorizedException, ConflictException,
  BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictException({ code: 'AUTH_EMAIL_TAKEN', message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role,
      phone: dto.phone,
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto, userAgent?: string, ip?: string) {
    const user = await this.userModel
      .findOne({ email: dto.email.toLowerCase() })
      .select('+passwordHash');

    if (!user || !user.isActive) {
      throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }

    return this.generateTokens(user, userAgent, ip);
  }

  async refresh(rawRefreshToken: string) {
    let payload: { sub: string; jti: string };
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID', message: 'Refresh token is invalid or expired' });
    }

    const tokenRecord = await this.refreshTokenModel
      .findOne({ tokenId: payload.jti })
      .select('+hashedToken');

    if (!tokenRecord || tokenRecord.revokedAt) {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_REVOKED', message: 'Refresh token has been revoked' });
    }

    const isMatch = await bcrypt.compare(rawRefreshToken, tokenRecord.hashedToken);
    if (!isMatch) {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID', message: 'Token mismatch' });
    }

    // Rotate refresh token
    await this.refreshTokenModel.findByIdAndUpdate(tokenRecord._id, { revokedAt: new Date() });

    const user = await this.userModel.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException({ code: 'AUTH_USER_INACTIVE', message: 'User not found or inactive' });
    }

    return this.generateTokens(user);
  }

  async logout(userId: string, tokenId?: string) {
    if (tokenId) {
      await this.refreshTokenModel.findOneAndUpdate({ tokenId, userId }, { revokedAt: new Date() });
    } else {
      await this.refreshTokenModel.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() });
    }
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new UnauthorizedException({ code: 'AUTH_USER_NOT_FOUND', message: 'User not found' });
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).select('+passwordHash');
    if (!user) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException({ code: 'AUTH_WRONG_PASSWORD', message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await user.save();

    // Revoke all refresh tokens
    await this.refreshTokenModel.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() });
    return { message: 'Password changed successfully' };
  }

  private async generateTokens(user: UserDocument, userAgent?: string, ip?: string) {
    const jti = uuidv4();
    const payload = { sub: user._id.toString(), email: user.email, role: user.role, jti };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user._id.toString(), jti },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      },
    );

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.refreshTokenModel.create({
      userId: user._id,
      tokenId: jti,
      hashedToken: hashedRefresh,
      userAgent,
      ip,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }
}
