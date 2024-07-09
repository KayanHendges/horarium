import { Public } from '@/decorators/auth/public.route';
import { AuthService } from '@/modules/auth/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDTO, RegisterUserDTO } from '@repo/global';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: RegisterUserDTO) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  login(@Body() body: LoginUserDTO) {
    return this.authService.login(body);
  }
}
