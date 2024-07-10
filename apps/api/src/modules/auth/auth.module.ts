import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config/index';
import { JwtStrategy } from '@/guards/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@/guards/auth/auth.guard';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: config.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaProvider,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AuthModule {}
