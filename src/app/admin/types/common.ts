export interface PaginationInfo {
  page: number
  limit: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
}
