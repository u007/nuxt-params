import { TablePaginationConfig } from "ant-design-vue"

export enum Sort {
  Asc = 'Asc',
  Desc = 'Desc',
}
export interface SortParam {
  field: string
  dir: string
}

// export interface fetchInclude {
//   model: BaseModel
//   localField: any
//   foreignField: any
// }

export interface fetchIncludeObject {
  include: fetchInclude
}

export interface fetchInclude {
  [key: string]: boolean | fetchIncludeObject
}
export interface fetchListParam<T> {
  page: number
  limit: number
  sorts: SortParam[]
  filters?: Record<string, any>
  onRow?: (row: any, index: number) => Promise<T>
  include?: fetchInclude
}

export type ListFetchEvent = {
  fetchParam: fetchListParam<any>,
  pagination: TablePaginationConfig,
  filters?: Record<string, any>,
  result: fetchListResult,
}

export type fetchListResult = {
  list: any[]
  page: number
  limit: number
  count: number
}
