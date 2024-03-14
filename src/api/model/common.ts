export interface ResultModel<T = any> {
  code: number
  message: string
  data: T | null
}

export interface ResListModel<T> {
  total: number
  list: T[]
}

export enum FileType {
  Image = 1,
  Video = 2
}
export interface ReturnFile {
  url: string
  thumbnail_url?: string
  duration?: number
  type?: FileType
}
