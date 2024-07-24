import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaProvider: PrismaProvider) {}

  async getCurrentUser(userId: string) {
    return this.prismaProvider.user.findFirstOrThrow({ where: { id: userId } });
  }
}
