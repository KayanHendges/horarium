import { Public } from '@/decorators/auth/public.route';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from '@/pipes/zodValidationPipe';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
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
