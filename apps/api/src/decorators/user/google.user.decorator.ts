import { GoogleUserPayload } from '@/guards/google/google-oauth.strategy';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GoogleUser = createParamDecorator(
  (_: any, context: ExecutionContext): GoogleUserPayload => {
    const request = context.switchToHttp().getRequest();

    const user = request?.user;

    if (!user) throw new UnauthorizedException();

    return request?.user;
  },
);
