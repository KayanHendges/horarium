import { Prisma, UserCredential } from '@repo/db';
import { IPrismaListParams } from '@/repositories/types';

export type IListUserCredentialParams = IPrismaListParams<
  UserCredential,
  Prisma.UserCredentialWhereInput
>;
export type IFindUserCredentialParams = Prisma.UserCredentialWhereUniqueInput;
export type ICreateUserCredentialPayload =
  Prisma.UserCredentialUncheckedCreateInput;
export type IUpdateUserCredentialPayload =
  Prisma.UserCredentialUncheckedUpdateInput;

export abstract class IUserCredentialRepository {
  abstract list(params: IListUserCredentialParams): Promise<UserCredential[]>;

  abstract find(params: IFindUserCredentialParams): Promise<UserCredential>;

  abstract count(params: IListUserCredentialParams): Promise<number>;

  abstract create(
    payload: ICreateUserCredentialPayload,
  ): Promise<UserCredential>;

  abstract update(
    params: IFindUserCredentialParams,
    payload: IUpdateUserCredentialPayload,
  ): Promise<UserCredential>;

  abstract delete(params: IFindUserCredentialParams): Promise<UserCredential>;
}
