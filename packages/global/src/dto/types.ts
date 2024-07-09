export type OrderBy = 'asc' | 'desc'

export type OrderParam<T> = Record<keyof T, OrderBy>

export type EntityCommonOmit = 'id' | 'createdAt' | 'updatedAt'

export type EntityAuditCommonOmit =
  | EntityCommonOmit
  | 'createdBy'
  | 'lastUpdatedBy'

export interface ResponseList<T> {
  list: T[]
  count: number
  page: number
  pageSize: number
}
