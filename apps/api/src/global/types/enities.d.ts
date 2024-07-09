import { RepositoryMetaProperties } from '@/repositories/types';

interface ContructorProps<
  T extends RepositoryMetaProperties & Record<string, any>,
> extends Omit<T, keyof RepositoryMetaProperties> {
  id?: string;
  updatedAt?: string;
  createdAt?: string;
}
