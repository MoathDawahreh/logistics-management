import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/interfaces';
import { ROLES } from 'src/common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: { id: string; role: string }) {
    try {
      const user = await this.userService.findOne(payload.id);

      if (!user)
        throw new NotFoundException({ message: 'User not found!', code: 900 });

      if (!user.isActive)
        throw new ForbiddenException({
          message:
            'Your account has been deactivated, please contact your admin!',
          code: 403,
        });
      return user;
    } catch (error) {
      if (error?.response?.code === 403) {
        throw new ForbiddenException(error?.response);
      }
      throw new UnauthorizedException({
        message: 'Unauthorized!',
        code: 401,
        error,
      });
    }
  }
}
