import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UserRepositoryModule } from '@/repositories/user/user.repository.module';
import { UserCredentialRepositoryModule } from '@/repositories/userCredential/user.credential.repository.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config/index';
import { JwtStrategy } from '@/guards/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@/guards/auth/auth.guard';
import { ClaimGuard } from '@/guards/claim/claim.guard';

@Module({
  imports: [
    UserRepositoryModule,
    UserCredentialRepositoryModule,
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: config.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: ClaimGuard },
  ],
})
export class AuthModule {}
