import { Injectable } from '@nestjs/common';
import { User } from '@repo/db';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { PrismaBaseRepository } from '@/repositories/base/prisma/prisma.abstract.repository';
import {
  ICreateUserPayload,
  IFindUserParams,
  IListUserParams,
  IUpdateUserPayload,
  IUserRepository,
} from '@/repositories/user/user.repository.interface';

@Injectable()
export class PrismaUserRepository
  extends PrismaBaseRepository
  implements IUserRepository
{
  constructor(private prisma: PrismaProvider) {
    super();
  }

  async list({
    where,
    orderBy,
    page,
    pageSize,
  }: IListUserParams): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
      orderBy,
      ...this.mapPagination({ page, pageSize }),
    });
  }

  async find(params: IFindUserParams): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: params });
  }

  async count({ where }: IListUserParams): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async create(payload: ICreateUserPayload): Promise<User> {
    return this.prisma.user.create({ data: payload });
  }

  async update(
    params: IFindUserParams,
    payload: IUpdateUserPayload,
  ): Promise<User> {
    return this.prisma.user.update({ where: params, data: payload });
  }

  async delete(params: IFindUserParams): Promise<User> {
    return this.prisma.user.delete({ where: params });
  }
}
