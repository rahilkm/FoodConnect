import {
  IsEnum, IsNotEmpty, IsNumber, IsString, IsBoolean,
  IsOptional, IsDateString, Min, IsObject, IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DonationType, FoodType, StorageRequirement } from '@foodconnect/types';

class AddressDto {
  @IsString() @IsNotEmpty()
  street: string;
  @IsString() @IsNotEmpty()
  city: string;
  @IsString() @IsNotEmpty()
  pincode: string;
  @IsString() @IsNotEmpty()
  state: string;
}

export class CreateDonationDto {
  @ApiProperty({ enum: DonationType })
  @IsEnum(DonationType)
  donationType: DonationType;

  @ApiProperty({ enum: FoodType })
  @IsEnum(FoodType)
  foodType: FoodType;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'kg', enum: ['kg', 'liters', 'servings', 'boxes', 'packets', 'pieces'] })
  @IsString()
  @IsNotEmpty()
  quantityUnit: string;

  @ApiProperty({ example: '2024-01-01T10:00:00Z' })
  @IsDateString()
  preparedAt: string;

  @ApiProperty({ example: '2024-01-01T18:00:00Z' })
  @IsDateString()
  expiresAt: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  pickupRequired?: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  donorAddress: AddressDto;

  @ApiPropertyOptional({ example: { type: 'Point', coordinates: [72.8777, 19.0760] } })
  @IsOptional()
  @IsObject()
  donorGeoPoint?: { type: string; coordinates: [number, number] };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergenNotes?: string;

  @ApiPropertyOptional({ enum: StorageRequirement })
  @IsOptional()
  @IsEnum(StorageRequirement)
  storageRequirement?: StorageRequirement;
}

export class UpdateDonationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergenNotes?: string;
}

export class SelectNgoDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  ngoId: string;
}

export class AssignVolunteerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  volunteerId: string;
}

export class RejectDonationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
