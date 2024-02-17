import {
  IsNotEmpty,
  IsStrongPassword,
  IsStrongPasswordOptions,
  IsString,
  IsOptional,
} from 'class-validator';
import { PhoneStartsWith } from 'src/common/validators';

export class AuthAdminRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @PhoneStartsWith()
  phone: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  } as IsStrongPasswordOptions)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsOptional()
  name: string;
}
