import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AuthAdminRegistrationDto,
  AuthSigninDto,
  UserRegistrationDto,
} from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Auth, Tokens } from './types';
import { plainToClass } from 'class-transformer';
import { UserSerialization } from './serialization';
import { ROLES } from 'src/common/constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    private jwt: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private config: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.logger = new Logger();
  }
  async signup(dto: UserRegistrationDto): Promise<Auth> {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.userModel.create({
        ...dto,
        password: hash,
        role: ROLES.USER,
      });

      if (!user) throw new BadRequestException('User not created!');
      let tokens = await this.getToken(user.id, user.role);
      await this.updateRefreshTokenHash(
        user.id,
        tokens.refresh_token,
        user.role,
      );

      const serializedUser = plainToClass(UserSerialization, user);

      await this.emailService.sendEmail(
        user.email,
        'Welcome to Vuedale!',
        'Welcome to Vuedale! We are glad to have you on board!',
      );

      return { user: serializedUser, tokens };
    } catch (error) {
      if (error.code === 11000)
        throw new UnprocessableEntityException({
          message: error.message,
          target: error.keyValue,
          code: 1001,
        });
      throw error;
    }
  }

  async adminSignup(dto: AuthAdminRegistrationDto): Promise<Auth> {
    try {
      const { otp, ...data } = dto;

      if (!otp || !data.phone)
        throw new BadRequestException(
          !otp ? 'OTP is missing!' : 'Phone number should be provided!',
        );

      const hash = await argon.hash(dto.password);

      const user = {} as any;

      if (!user) throw new BadRequestException('User not created!');
      let tokens = await this.getToken(user.id, user?.role);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token, 'ADMIN');

      const serializedUser = plainToClass(UserSerialization, user);

      return { user: serializedUser, tokens };
    } catch (error) {
      throw error;
    }
  }

  async signin(dto: AuthSigninDto): Promise<Auth> {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      // if no user throw exception
      if (!user)
        throw new NotFoundException({
          message: `User with email ${dto.email} not found!`,
        });

      // if (!user?.isActive)

      const pwMatches = await argon.verify(user.password, dto.password);
      if (!pwMatches) throw new UnauthorizedException('Invalid password!');
      const tokens = await this.getToken(user.id, user.role);
      await this.updateRefreshTokenHash(
        user.id,
        tokens.refresh_token,
        user?.role,
      );
      const serializedUser = plainToClass(UserSerialization, user);

      return { user: serializedUser, tokens };
    } catch (error) {
      if (error instanceof TypeError)
        throw new BadRequestException({
          message: 'Invalid type value!',
          target: error?.message,
          code: 1002,
        });

      if (error instanceof ForbiddenException)
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: error.message,
            code: 1000,
          },
          HttpStatus.FORBIDDEN,
        );
      throw new HttpException(
        {
          status: error?.status,
          message: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async adminSignin(dto: AuthSigninDto): Promise<Auth> {
    try {
      const user = { id: '1', role: 'ADMIN' } as any;
      // if no user throw exception
      if (!user)
        throw new NotFoundException({
          message: `User with email ${dto.email} not found!`,
        });

      // if (!user.isActive)
      //   this.prisma.admin.update({
      //     where: {
      //       id: user.id,
      //     },
      //     data: {
      //       isActive: true,
      //     },
      //   });

      // if the user exsits check if the passowrd correct
      const pwMatches = await argon.verify(user.password, dto.password);
      if (!pwMatches) throw new UnauthorizedException('Invalid password!');
      const tokens = await this.getToken(user.id, user.role);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token, 'ADMIN');
      const serializedUser = plainToClass(UserSerialization, user);
      // if (dto.pushToken)
      //   await this.savePushToken(user.id, dto.pushToken, 'admin');

      return { user: serializedUser, tokens };
    } catch (error) {
      if (error instanceof TypeError)
        throw new BadRequestException({
          message: 'Invalid type value!',
          target: error?.message,
          code: 1002,
        });

      if (error instanceof ForbiddenException)
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: error.message,
            code: 1000,
          },
          HttpStatus.FORBIDDEN,
        );
      throw new HttpException(
        {
          status: error?.status,
          message: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshTokens(
    hashedRt: string,
    rt: string,
    userId: string,
    role: string,
  ): Promise<Tokens> {
    try {
      const rtMatches = await argon.verify(hashedRt, rt);
      if (!rtMatches)
        throw new ForbiddenException({ message: 'Acess denied!', code: 5050 });

      const tokens = await this.getToken(userId, role);
      await this.updateRefreshTokenHash(userId, tokens.refresh_token, role);

      return tokens;
    } catch (error) {
      throw new ForbiddenException({ message: 'Acess denied!', code: 5050 });
    }
  }

  async logout(userId: string, role: string) {
    try {
      if (!userId)
        throw new BadRequestException({
          message: 'Invalid value!',
          code: 1002,
        });

      await this.userModel.updateOne({ _id: userId }, { hashedRt: null });
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error,
        });
      throw error;
    }
  }
  //TODO istead of isStaff use role
  async getToken(userId: string, role: string): Promise<Tokens> {
    try {
      const payload = {
        id: userId,
        role,
      };
      const [access_token, refresh_token] = await Promise.all([
        this.jwt.signAsync(payload, {
          expiresIn: '7d',
          secret: this.config.get('JWT_SECRET'),
        }),
        this.jwt.signAsync(payload, {
          expiresIn: '7d',
          secret: this.config.get('RT_SECRET'),
        }),
      ]);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          code: 1002,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateRefreshTokenHash(
    userId: string,
    refresh_token: string,
    role: string,
  ) {
    try {
      const hashedRefreshToken = await argon.hash(refresh_token);

      await this.userModel.updateOne(
        { _id: userId },
        { hashedRt: hashedRefreshToken },
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Refresh token hash update failed!',
          code: 1002,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
