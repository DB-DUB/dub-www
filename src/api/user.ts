import request from '@/utils/request'

import type { LoginFormModel, LoginResultModel } from './model/user'
import { WalletType } from './model/web3'

// Log in
export function login(data: LoginFormModel): Promise<LoginResultModel> {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// Sign out
export function logout(): Promise<void> {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// Get user details
export function getUserDetail() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// Bind wallet address
export function bindUserWallet(type: WalletType, address: string) {
  return request({
    url: '/user/bind_address',
    method: 'post',
    data: { type, address }
  })
}

// token exchange disposable token
export function token2Disposable() {
  return request<{ disposable_token: string }>({
    url: '/user/token_to_disposable',
    method: 'post'
  })
}

// disposable token exchange token
export function disposable2Token(disposable_token: string) {
  return request<{ token: string }>({
    url: '/user/disposable_to_token',
    method: 'post',
    data: { disposable_token }
  })
}
