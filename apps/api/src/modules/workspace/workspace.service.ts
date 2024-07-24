import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { isObjectId } from '@/utils/regex';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateWorkspaceDTO,
  ListWorkspacesResponse,
  Workspace,
} from '@repo/global';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaProvider: PrismaProvider) {}

  async list(userId: string): Promise<ListWorkspacesResponse> {
    const list = await this.prismaProvider.workspace.findMany({
      where: { memberships: { some: { userId } } },
    });

    return { list, count: list.length };
  }

  async create(
    userId: string,
    { uniqueName: givenUniqueName, name, type }: CreateWorkspaceDTO,
  ) {
    if (givenUniqueName && isObjectId(givenUniqueName))
      throw new BadRequestException('Unique name cannot be a ObjectId');

    const uniqueName = givenUniqueName || userId;

    const workspaceNameExists = await this.prismaProvider.workspace.findUnique({
      where: { uniqueName },
    });

    if (workspaceNameExists)
      throw new ConflictException(
        'Workspace with this unique name already exists.',
      );

    const ownWorkspaces = await this.prismaProvider.workspace.findMany({
      where: { memberships: { some: { userId, role: 'OWNER' } } },
    });

    const personalWorkspaces = ownWorkspaces.filter(
      (w) => w.type === 'personal',
    );
    const sharedWorkspaces = ownWorkspaces.filter((w) => w.type === 'shared');

    if (type === 'personal' && personalWorkspaces.length)
      throw new ForbiddenException(
        'You can only be owner of 1 personal workspace.',
      );

    if (type === 'shared' && sharedWorkspaces.length >= 2)
      throw new ForbiddenException(
        'You can only be owner of 2 shared workspaces.',
      );

    const createdWorkspace = await this.prismaProvider.workspace.create({
      data: {
        name,
        uniqueName,
        type,
        memberships: { create: { userId, role: 'OWNER' } },
      },
    });

    return createdWorkspace;
  }

  async enableWorkspace(workspace: Workspace) {
    const enabledWorkspace = await this.prismaProvider.workspace.update({
      where: { id: workspace.id },
      data: { active: true },
    });

    if (!enabledWorkspace) throw new NotFoundException('Workspace not found');

    return;
  }

  async disableWorkspace(workspace: Workspace) {
    if (workspace.type === 'personal')
      throw new BadRequestException('Personal workspaces cannot be deleted');

    const disabledWorkspace = await this.prismaProvider.workspace.update({
      where: { id: workspace.id },
      data: { active: false },
    });

    if (!disabledWorkspace) throw new NotFoundException('Workspace not found');

    return;
  }
}
