import { PaginationAndSortDTO } from '@repo/global';
import { OrderParam, Pagination, WhereParams } from '@/global/types/repository';

type Query<T extends Record<keyof T, any>> = PaginationAndSortDTO & Partial<T>;

interface QueryService<T> extends Pagination {
  where?: WhereParams<T>;
  orderBy?: OrderParam<T>;
}

export const mapQueryToService = <T extends Record<keyof T, any>>({
  orderBy,
  page,
  pageSize,
  ...where
}: Query<T>): QueryService<T> => {
  return { page, pageSize, where: where as WhereParams<T> };
};
