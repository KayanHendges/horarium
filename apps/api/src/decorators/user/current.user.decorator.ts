import { JwtPayload } from '@/guards/auth/types';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: any, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();

    const user = request?.user;

    if (!user) throw new UnauthorizedException();

    return request?.user;
  },
);
