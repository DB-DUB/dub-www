export interface LoginFormModel {
  username: string
  password: string
}

export interface LoginResultModel {
  id: number
  token: string
  privileges: number[]
}

export interface AdminInfoModel {
  id: number
  username: string
  privileges: number[]
  created_at?: number | string
}

export interface GetAdminListParams {
  pos: number
  limit: number
  username?: string
}

export interface AddEditAdminModel {
  username: string
  password: string
  privileges: number[]
}
