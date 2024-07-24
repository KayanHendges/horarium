import {
  PERMISSION_KEY,
  PermissionParameters,
} from '@/decorators/permission/permission.decorator';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getUserPermission, Workspace } from '@repo/global';
import { JwtPayload } from '../auth/types';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
  workspace?: Workspace;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaProvider: PrismaProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as AuthenticatedRequest;
    const { user, url } = request;

    const [workspacePath] = url.match(/^\/workspace\/\w*/g) || [];

    if (!workspacePath) return true;

    const [_, __, workspaceId] = workspacePath.split('/');

    const membership = await this.prismaProvider.membership.findFirst({
      where: { userId: user.id, workspaceId },
      include: { workspace: true },
    });

    if (!membership)
      throw new ForbiddenException('You are not member of this workspace.');

    request.workspace = membership.workspace;

    const abilities = this.reflector.getAllAndOverride<PermissionParameters>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!abilities) return true;

    const { can } = getUserPermission(user.id, membership.role);

    return can(...abilities);
  }
}
