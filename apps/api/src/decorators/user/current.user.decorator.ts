import { JwtPayload } from '@/guards/auth/types';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

//TODO: add keyof type from jwt payload into the data object, so we can have autocomplete for the user object

export const CurrentUser = createParamDecorator(
  (_: any, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();

    const user = request?.user;

    if (!user) throw new UnauthorizedException();

    return request?.user;
  },
);
