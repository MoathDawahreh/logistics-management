import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ShipmentStatus } from '../enum';
import { Type } from 'class-transformer';

export interface DeliveryRoute {
  latitude: number;
  longitude: number;
}

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

  @IsOptional()
  @Type(() => Number)
  deliveryRoute: { latitude: number; longitude: number }[];

  // @IsOptional()
  // @IsEnum(ShipmentStatus)
  // status?: ShipmentStatus;
}
