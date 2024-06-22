import { Injectable } from '@nestjs/common';
import { UserCredential } from '@repo/db';
import { PrismaProvider } from '@/providers/prisma/prisma.provider';
import { PrismaBaseRepository } from '@/repositories/base/prisma/prisma.abstract.repository';
import {
  ICreateUserCredentialPayload,
  IFindUserCredentialParams,
  IListUserCredentialParams,
  IUpdateUserCredentialPayload,
  IUserCredentialRepository,
} from '@/repositories/userCredential/user.credential.repository.interface';

@Injectable()
export class PrismaUserCredentialRepository
  extends PrismaBaseRepository
  implements IUserCredentialRepository
{
  constructor(private prisma: PrismaProvider) {
    super();
  }

  async list({
    where,
    orderBy,
    page,
    pageSize,
  }: IListUserCredentialParams): Promise<UserCredential[]> {
    return this.prisma.userCredential.findMany({
      where,
      orderBy,
      ...this.mapPagination({ page, pageSize }),
    });
  }

  async find(params: IFindUserCredentialParams): Promise<UserCredential> {
    return this.prisma.userCredential.findUniqueOrThrow({ where: params });
  }

  async count({ where }: IListUserCredentialParams): Promise<number> {
    return this.prisma.userCredential.count({ where });
  }

  async create(payload: ICreateUserCredentialPayload): Promise<UserCredential> {
    return this.prisma.userCredential.create({ data: payload });
  }

  async update(
    params: IFindUserCredentialParams,
    payload: IUpdateUserCredentialPayload,
  ): Promise<UserCredential> {
    return this.prisma.userCredential.update({ where: params, data: payload });
  }

  async delete(params: IFindUserCredentialParams): Promise<UserCredential> {
    return this.prisma.userCredential.delete({ where: params });
  }
}
