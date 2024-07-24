import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { Module } from '@nestjs/common';
import { WorkspaceController } from './wokspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, PrismaProvider],
})
export class WorkspaceModule {}
