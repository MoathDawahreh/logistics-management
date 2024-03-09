import {
  Body,
  Controller,
  Logger,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthSigninDto,
  UserRegistrationDto,
  AuthAdminRegistrationDto,
} from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { User } from '../user/interfaces';
import { getCurrentUser } from 'src/common/decorators';
import { SuperGuard } from 'src/common/guards';
import { ROLES } from 'src/common/constants';
import { Request } from 'express';
import { UserDocument } from '../user/user.schema';

@Controller('auth')
export class AuthController {
  logger: Logger;

  constructor(private authService: AuthService) {
    this.logger = new Logger();
  }

  @Post('register/user')
  userSignup(@Body() dto: UserRegistrationDto) {
    return this.authService.signup(dto);
  }

  @Post('register/super')
  @UseGuards(SuperGuard)
  adminSginup(@Body() dto: AuthAdminRegistrationDto) {
    return this.authService.adminSignup(dto);
  }

  @Post('user')
  @HttpCode(HttpStatus.OK)
  siginIn(@Body() dto: AuthSigninDto) {
    return this.authService.signin(dto);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@getCurrentUser() user: UserDocument) {
    this.authService.logout(user.id, user.role);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@getCurrentUser() user: User) {
    return this.authService.refreshTokens(
      user.hashedRt,
      user.refreshToken,
      user.id,
      user.role,
    );
  }
  //   @Post('forgot-password')
  //   @HttpCode(HttpStatus.OK)
  //   async forgotPassword(@Body() dto: ForgotPasswordDto) {
  //     try {
  //       return await this.authService.forgotPassword(dto);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
