import { ZodBody } from '@/decorators/dto/zod-body.decorator';
import { Permission } from '@/decorators/permission/permission.decorator';
import { CurrentUser } from '@/decorators/user/current.user.decorator';
import { CurrentWorkspace } from '@/decorators/user/current.workspace.decorator';
import { JwtPayload } from '@/guards/auth/types';
import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
  CreateWorkspaceDTO,
  createWorkspaceSchema,
  Workspace,
} from '@repo/global';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async list(@CurrentUser() currentUser: JwtPayload) {
    return this.workspaceService.list(currentUser.id);
  }

  @Post()
  async createWorkspace(
    @CurrentUser() currentUser: JwtPayload,
    @ZodBody(createWorkspaceSchema)
    body: CreateWorkspaceDTO,
  ) {
    return this.workspaceService.create(currentUser.id, body);
  }

  @Patch(':id/enable')
  @Permission('enable', 'Workspace')
  async enableWorkspace(@CurrentWorkspace() currentWorkspace: Workspace) {
    return this.workspaceService.enableWorkspace(currentWorkspace);
  }

  @Delete(':id')
  @Permission('disable', 'Workspace')
  async disableWorkspace(@CurrentWorkspace() currentWorkspace: Workspace) {
    return this.workspaceService.disableWorkspace(currentWorkspace);
  }
}
