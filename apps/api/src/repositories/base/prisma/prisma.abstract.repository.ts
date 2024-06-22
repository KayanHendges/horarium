import { IPagination } from '@/repositories/types';

export abstract class PrismaBaseRepository {
  protected mapPagination({ page, pageSize }: IPagination) {
    const take = pageSize ? pageSize : undefined;
    const skip = page && take ? (page - 1) * take : undefined;

    return { take, skip };
  }
}
