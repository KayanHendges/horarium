import { CurrentUser } from '@/decorators/user/current.user.decorator';
import { JwtPayload } from '@/guards/auth/types';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@CurrentUser() currentUser: JwtPayload) {
    return this.userService.getCurrentUser(currentUser.id);
  }
}
