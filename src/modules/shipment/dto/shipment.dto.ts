import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ShipmentStatus } from '../enum';

export class ShipmentDto {
  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  deliveryPreferences?: string;

  // @IsOptional()
  // @IsEnum(ShipmentStatus)
  // status?: ShipmentStatus;
}
