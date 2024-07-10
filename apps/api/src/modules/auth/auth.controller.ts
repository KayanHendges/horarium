import { Public } from '@/decorators/auth/public.route';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from '@/pipes/zodValidationPipe';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  loginUserDTO,
  LoginUserDTO,
  registerUserDTO,
  RegisterUserDTO,
} from '@repo/global';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(registerUserDTO))
  register(@Body() body: RegisterUserDTO) {
    return this.authService.register(body);
  }

  @Public()
  @Post('sign-in')
  @UsePipes(new ZodValidationPipe(loginUserDTO))
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }
}
