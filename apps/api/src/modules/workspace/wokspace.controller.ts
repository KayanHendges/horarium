import { CurrentUser } from '@/decorators/user/current.user.decorator';
import { JwtPayload } from '@/guards/auth/types';
import { Controller, Get } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async list(@CurrentUser() currentUser: JwtPayload) {
    return this.workspaceService.list(currentUser.id);
  }
}
