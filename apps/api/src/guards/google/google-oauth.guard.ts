import { IS_GOOGLE_ROUTE } from '@/decorators/auth/google.route';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isGoogleRoute = this.reflector.getAllAndOverride<boolean>(
      IS_GOOGLE_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (!isGoogleRoute) {
      return true;
    }

    return super.canActivate(context);
  }
}
