import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRegistrationDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
