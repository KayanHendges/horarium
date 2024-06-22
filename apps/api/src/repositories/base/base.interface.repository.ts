import {
  ListParams,
  RepositoryCreateParams,
  RepositoryEntity,
  RepositoryUpdateParams,
  WhereParams,
} from '@/repositories/types';

export type EntityUniqueParams<T, PK extends keyof T> = {
  [K in PK]?: T[K];
};

export abstract class IBaseRepository<
  Entity extends RepositoryEntity<Entity>,
  UniqueKeys extends keyof Entity,
> {
  abstract list(params: ListParams<Entity>): Promise<Entity[]>;

  abstract find(
    uniqueParam: EntityUniqueParams<Entity, UniqueKeys>,
  ): Promise<Entity>;

  abstract count(param: WhereParams<Entity>): Promise<number>;

  abstract create(payload: RepositoryCreateParams<Entity>): Promise<Entity>;

  abstract update(
    uniqueParam: EntityUniqueParams<Entity, UniqueKeys>,
    payload: RepositoryUpdateParams<Entity>,
  ): Promise<Entity>;

  abstract delete(
    uniqueParam: EntityUniqueParams<Entity, UniqueKeys>,
  ): Promise<Entity>;
}
