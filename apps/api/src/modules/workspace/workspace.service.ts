import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaProvider: PrismaProvider) {}

  async list(userId: string) {
    return this.prismaProvider.workspace.findMany({
      where: { membership: { some: { userId } } },
    });
  }

  async create() {}
}
