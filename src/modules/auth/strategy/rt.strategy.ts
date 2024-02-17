// refresh token strategy

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { ROLES } from 'src/common/constants';

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: string; role: string }) {
    try {
      //todo: get user from db
      const user = { venue: { id: '1' } };

      if (!user) throw new NotFoundException('User not found!');

      const refreshToken = req
        .get('authorization')
        .replace('Bearer', '')
        .trim();
      // user.refreshToken = refreshToken;

      return {
        ...user,
        refreshToken,
      };

      // return { ...user, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Unauthorized!');
    }
  }
}
