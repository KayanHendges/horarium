import { config } from '@/config';
import { GoogleRoute } from '@/decorators/auth/google.route';
import { Public } from '@/decorators/auth/public.route';
import { ZodBody } from '@/decorators/dto/zod-body.decorator';
import { GoogleUser } from '@/decorators/user/google.user.decorator';
import { GoogleUserPayload } from '@/guards/google/google-oauth.strategy';
import { AuthService } from '@/modules/auth/auth.service';
import { Controller, Get, Logger, Post, Res } from '@nestjs/common';
import {
  loginUserDTO,
  LoginUserDTO,
  registerUserDTO,
  RegisterUserDTO,
  RequestPasswordRecoveryDTO,
  requestPasswordRecoverySchema,
  ResetPasswordDTO,
  resetPasswordSchema,
} from '@repo/global';
import { Response } from 'express';
import { googleErrorCallbackUrl } from './utils';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@ZodBody(registerUserDTO) body: RegisterUserDTO) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  async login(@ZodBody(loginUserDTO) body: LoginUserDTO) {
    return await this.authService.login(body);
  }

  @Public()
  @GoogleRoute()
  @Get('google/callback')
  async loginGoogle(
    @GoogleUser() user: GoogleUserPayload,
    @Res() res: Response,
  ) {
    try {
      const { accessToken } = await this.authService.loginGoogle(user);

      const redirectUrl = new URL(
        `/api/auth/callback?access_token=${accessToken}`,
        config.WEB_URL,
      );

      res.redirect(redirectUrl.toString());
    } catch (_err) {
      this.logger.warn(_err);
      res.redirect(googleErrorCallbackUrl.toString());
    }
  }

  @Public()
  @Post('recovery-password')
  async recoveryPassword(
    @ZodBody(requestPasswordRecoverySchema) body: RequestPasswordRecoveryDTO,
  ) {
    return await this.authService.requestPasswordRecovery(body);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@ZodBody(resetPasswordSchema) body: ResetPasswordDTO) {
    return await this.authService.resetPassword(body);
  }
}
