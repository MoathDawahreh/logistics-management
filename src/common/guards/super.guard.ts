import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class SuperGuard implements CanActivate {
  constructor(private config: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headerSecret = request.headers['x-secret'];
    const expectedSecret = this.config.get('HEADER_SECRET');
    if (headerSecret === expectedSecret) {
      return true;
    }
    return false;
  }
}
