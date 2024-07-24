import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Workspace } from '@repo/db';

export const CurrentWorkspace = createParamDecorator(
  (_: any, context: ExecutionContext): Workspace => {
    const request = context.switchToHttp().getRequest();

    const workspace = request?.workspace;

    if (!workspace) throw new UnauthorizedException();

    return request?.workspace;
  },
);
