import { JwtPayload } from '@/guards/auth/types';
import { MailerProvider } from '@/providers/mailer/mailer.provider';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import {
  ConflictException,
  GoneException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { User } from '@repo/db';
import {
  LoginUserDTO,
  LoginUserResponse,
  RegisterUserDTO,
  RegisterUserResponse,
  RequestPasswordRecoveryDTO,
  ResetPasswordDTO,
} from '@repo/global';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaProvider: PrismaProvider,
    private readonly mailerProvider: MailerProvider,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async register(user: RegisterUserDTO): Promise<RegisterUserResponse> {
    const { password, ...payload } = user;
    const passwordHash = this.hashPassword(password);

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

  async requestPasswordRecovery({ email }: RequestPasswordRecoveryDTO) {
    const user = await this.prismaProvider.user.findUnique({
      where: { email },
    });

    if (!user) return;

    await this.prismaProvider.token.updateMany({
      where: { userId: user.id },
      data: { active: false },
    });

    const code = Math.random().toString().substring(2, 8);
    const maxAge = 1000 * 60 * 10; // 10 minutes
    const expiresAt = new Date(new Date().getTime() + maxAge);

    await this.prismaProvider.token.create({
      data: { code, expiresAt, type: 'PASSWORD_RECOVER', userId: user.id },
    });

    this.mailerProvider
      .recoveryPasswordCode({ code, username: user.name }, email)
      .catch(() =>
        this.logger.error(
          `Failed to send password recovery code to email ${email}`,
        ),
      );

    return;
  }

  async resetPassword({ email, code, password }: ResetPasswordDTO) {
    const tokenFromCode = await this.prismaProvider.token.findFirst({
      where: { code, user: { email } },
    });

    if (!tokenFromCode) throw new UnauthorizedException();

    const isExpired = new Date().getTime() > tokenFromCode.expiresAt.getTime();

    if (!tokenFromCode.active || isExpired)
      throw new GoneException('Token has been dropped or is expired.');

    const passwordHash = this.hashPassword(password);

    await this.prismaProvider.token.update({
      where: { id: tokenFromCode.id },
      data: { active: false },
    });

    const accountFound = await this.prismaProvider.account.findFirst({
      where: { userId: tokenFromCode.userId, provider: 'PASSWORD' },
    });

    if (accountFound) {
      await this.prismaProvider.account.update({
        where: { id: accountFound.id },
        data: { passwordHash },
      });
    } else {
      await this.prismaProvider.account.create({
        data: { userId: tokenFromCode.userId, provider: 'PASSWORD' },
      });
    }

    return;
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  }

  private async generateToken({ id }: User): Promise<LoginUserResponse> {
    const payload: JwtPayload = {
      id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  @Cron('0 0 0 * * *')
  async clearTokens() {
    this.logger.log('starting to delete expired tokens.');
    const { count } = await this.prismaProvider.token.deleteMany({
      where: { active: false, expiresAt: { lte: new Date() } },
    });

    this.logger.log(
      `Expired cleaning token finished. Total deleted: ${count}.`,
    );
  }
}
