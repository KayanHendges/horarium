import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaProvider],
})
export class UserModule {}
