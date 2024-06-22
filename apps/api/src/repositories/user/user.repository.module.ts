import { Module } from '@nestjs/common';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { PrismaUserRepository } from '@/repositories/user/implementations/prisma.user.repository';
import { IUserRepository } from '@/repositories/user/user.repository.interface';
@Module({
  controllers: [],
  providers: [
    PrismaProvider,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserRepositoryModule {}
