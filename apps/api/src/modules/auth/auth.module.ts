import { config } from '@/config/index';
import { JwtGuard } from '@/guards/auth/auth.guard';
import { JwtStrategy } from '@/guards/auth/strategies/jwt.strategy';
import { GoogleOauthGuard } from '@/guards/google/google-oauth.guard';
import { GoogleStrategy } from '@/guards/google/google-oauth.strategy';
import { PermissionGuard } from '@/guards/permission/permission.guard';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { MailerProvider } from '@/providers/mailer/mailer.provider';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

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
    MailerProvider,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: GoogleOauthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AuthModule {}
