import { config } from '@/config';
import { Public } from '@/decorators/auth/public.route';
import { GoogleUser } from '@/decorators/user/google.user.decorator';
import { GoogleOauthGuard } from '@/guards/google/google-oauth.guard';
import { GoogleUserPayload } from '@/guards/google/google-oauth.strategy';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from '@/pipes/zodValidationPipe';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserDTO))
  register(@Body() body: RegisterUserDTO) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginUserDTO))
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
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
      const redirectUrl = new URL(`/auth/sign-in`, config.WEB_URL);

      res.redirect(redirectUrl.toString());
    }
  }

  @Public()
  @Post('recovery-password')
  @UsePipes(new ZodValidationPipe(requestPasswordRecoverySchema))
  async recoveryPassword(@Body() body: RequestPasswordRecoveryDTO) {
    return await this.authService.requestPasswordRecovery(body);
  }

  @Public()
  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return await this.authService.resetPassword(body);
  }
}
