import { PaginationAndSortDTO } from 'project-common';
import { OrderParam, Pagination, WhereParams } from '@/repositories/types';

type Query<T extends Record<keyof T, any>> = PaginationAndSortDTO<T> &
  Partial<T>;

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
  return { orderBy, page, pageSize, where: where as WhereParams<T> };
};
