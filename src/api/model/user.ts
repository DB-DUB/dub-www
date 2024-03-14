import { WalletType } from './web3'

export interface UserInfoModel {
  id: string
  nickname: string
  avatar: string
  address?: string
  lol?: string
  dub?: string
  physical: number
  physical_max: number
  type?: WalletType
}

export interface LoginResultModel {
  token: string
}

export enum LoginSourceEnum {
  App = 1,
  Web = 2,
  PWA = 3
}

export interface LoginFormModel {
  data: {
    google: {
      access_token: string
    }
  }
  source: LoginSourceEnum
}
