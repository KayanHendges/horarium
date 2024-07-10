interface WhereDefaultParams<T> {
  in?: T[];
  notIn?: T[];
  lt?: T;
  lte?: T;
  gt?: T;
  gte?: T;
  not?: T;
}

interface WhereStringParams extends WhereDefaultParams<string> {
  constains?: string;
  startsWith?: string;
  endsWidth?: string;
}

type WhereNumberParams = WhereDefaultParams<number>;

type WhereDateTimeParams = WhereDefaultParams<Date>;

type WhereBooleanParams = Pick<WhereDefaultParams<boolean>, 'not'>;

export type WhereParams<T> = {
  [P in keyof T]?:
    | typeof P
    | (P extends number
        ? WhereDefaultParams<number>
        : P extends string
          ? WhereStringParams
          : P extends Date
            ? WhereBooleanParams
            : P extends boolean
              ? WhereBooleanParams
              : never);
};

type OrderBy = 'asc' | 'desc';

type OrderParam<T> = Record<keyof T, OrderBy>;

interface Pagination {
  page: number;
  pageSize: number;
}

interface ListParams<T> extends Partial<Pagination> {
  where?: WhereParams<T>;
  orderBy?: OrderParam<T>;
}

interface RepositoryMetaProperties {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RepositoryEntity<T extends Record<string, any>> extends T {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

type RepositoryCreateParams<T extends RepositoryEntity<T>> = Omit<
  T,
  keyof RepositoryMetaProperties
> &
  Partial<RepositoryMetaProperties>;

type RepositoryUpdateParams<T extends Record<string, any>> = Partial<
  Omit<RepositoryCreateParams<T>, 'id'>
>;

interface IPagination {
  page?: number;
  pageSize?: number;
}

interface IPrismaListParams<T, W> {
  where?: W;
  orderBy?: OrderParam<T>;
  page?: number;
  pageSize?: number;
}
