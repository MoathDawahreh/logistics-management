import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.role)
      throw new ForbiddenException({
        message: 'You are not authorized to access this resource',
        code: 1,
      });

    return this.matchRoles(roles, user.role);
  }

  // matchRoles(validRoles: string[], userRoles: string[]): boolean {
  //   return userRoles.some((role) => validRoles.includes(role));
  // }
  matchRoles(validRoles: string[], userRole: string): boolean {
    return validRoles.includes(userRole);
  }
}
