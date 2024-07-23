import { z } from 'zod'

import { EntityAuditCommonOmit, EntityCommonOmit, OrderBy } from './types'

type OrderByObject<T> = Record<keyof T, OrderBy>

export const entityCommonOmit: EntityCommonOmit[] = [
  'id',
  'updatedAt',
  'createdAt',
]

export const entityAuditCommonOmit: (
  | EntityCommonOmit
  | EntityAuditCommonOmit
)[] = [...entityCommonOmit, 'createdBy', 'lastUpdatedBy']

export function orderByFromString<T extends Record<keyof T, unknown>>(
  param: string,
): OrderByObject<T> | string {
  const splitted = param.split('_')
  const key = splitted[0].length ? splitted[0] : null
  const direction = splitted[1]?.length ? splitted[1] : 'asc'

  if (!key) return ''

  if (!['asc', 'desc'].includes(direction)) return ''

  return { [key]: direction } as OrderByObject<T>
}

export const paginationAndSortDTO = z.object({
  page: z.number().positive().optional().default(1),
  pageSize: z.number().positive().max(1000).optional().default(100),
  orderBy: z.string().optional(),
})

export type PaginationAndSortDTO = z.infer<typeof paginationAndSortDTO>

export interface ListItems<T> {
  list: T[]
  count: number
}
