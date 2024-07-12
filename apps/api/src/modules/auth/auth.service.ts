import { JwtPayload } from '@/guards/auth/types';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@repo/db';
import {
  LoginUserDTO,
  LoginUserResponse,
  RegisterUserDTO,
  RegisterUserResponse,
} from '@repo/global';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaProvider: PrismaProvider,
  ) {}

  async register(user: RegisterUserDTO): Promise<RegisterUserResponse> {
    const { password, ...payload } = user;
    const passwordHash = bcrypt.hashSync(password, 8);

    const userWithSameEmail = await this.prismaProvider.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userWithSameEmail)
      throw new ConflictException(
        `User with email "${userWithSameEmail.email}" already exists.`,
      );

    const createdUser = await this.prismaProvider.user.create({
      data: {
        ...payload,
        accounts: { create: { provider: 'PASSWORD', passwordHash } },
      },
    });

    return createdUser;
  }

  async login({ email, password }: LoginUserDTO): Promise<LoginUserResponse> {
    const userFound = await this.prismaProvider.user.findFirst({
      where: { email },
    });

    if (!userFound) throw new UnauthorizedException('Invalid credentials.');

    const accountFound = await this.prismaProvider.account.findFirst({
      where: { userId: userFound.id, provider: 'PASSWORD' },
    });

    if (!accountFound || !accountFound.passwordHash)
      throw new UnauthorizedException(
        'User does not have a password, use social login.',
      );

    const passwordMatch = bcrypt.compareSync(
      password,
      accountFound.passwordHash,
    );

    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials.');

    return this.generateToken(userFound);
  }

  private async generateToken({ id }: User): Promise<LoginUserResponse> {
    const payload: JwtPayload = {
      id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
