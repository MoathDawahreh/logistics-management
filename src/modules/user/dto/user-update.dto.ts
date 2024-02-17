import {
  IsBoolean,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsStrongPasswordOptions,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  } as IsStrongPasswordOptions)
  @IsOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  allowNotifications: boolean;
}
