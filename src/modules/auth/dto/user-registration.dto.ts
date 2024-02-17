import {
  IsNotEmpty,
  IsStrongPassword,
  IsStrongPasswordOptions,
  IsString,
  IsEmail,
} from 'class-validator';
export class UserRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
  name: string;
}
