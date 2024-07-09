import { Prisma, User } from '@repo/db';
import { IPrismaListParams } from '@/repositories/types';

export type IListUserParams = IPrismaListParams<User, Prisma.UserWhereInput>;
export type IFindUserParams = Prisma.UserWhereUniqueInput;
export type ICreateUserPayload = Prisma.UserCreateInput;
export type IUpdateUserPayload = Prisma.UserUpdateInput;

export abstract class IUserRepository {
  abstract list(params: IListUserParams): Promise<User[]>;

  abstract find(params: IFindUserParams): Promise<User>;

  abstract count(params: IListUserParams): Promise<number>;

  abstract create(payload: ICreateUserPayload): Promise<User>;

  abstract update(
    params: IFindUserParams,
    payload: IUpdateUserPayload,
  ): Promise<User>;

  abstract delete(params: IFindUserParams): Promise<User>;
}
