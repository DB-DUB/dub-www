import isEmpty from 'lodash-es/isEmpty'
import { WalletType } from '@/api/model/web3'
import { defineStore } from 'pinia'
import store from '@/stores'
import { resetRouter } from '@/router'
import type { UserInfoModel, LoginResultModel, LoginFormModel } from '@/api/model/user'

import { login, logout, bindUserWallet, disposable2Token, getUserDetail } from '@/api/user'
import { getToken, setToken, removeAllCookies } from '@/utils/auth'
import { usePermissionStoreWithOut } from './permission'
import { unsubscribe } from '@/utils/register-service.worker'
import { useAta, useConnection, usePubkey } from '@/utils/web3/connection'
import { calcGasorExchangeDub, getDub } from '@/api/web3'
import { watch } from 'vue'
import { useWeb3Const } from '@/utils/web3/base'
import { PublicKey } from '@solana/web3.js'
import * as splToken from '@solana/spl-token'
import { SubName, pubSubUtil } from '@/utils/pub-sub'

export interface UserState {
  userInfo: UserInfoModel
  roles: Array<number | string>
  estimateGas?: number
}

const OriginInfo: UserInfoModel = {
  id: '',
  nickname: '',
  avatar: '',
  address: undefined,
  lol: '',
  dub: '',
  physical: 0,
  physical_max: 0
}

let disposeAddress
let userDUBChangeKey
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: { ...OriginInfo },
    roles: [],
    estimateGas: undefined
  }),
  getters: {
    userName: state => state.userInfo.nickname,
    address: state => state.userInfo.address
  },
  persist: [
    {
      key: 'userInfo',
      paths: ['userInfo']
    }
  ],
  actions: {
    register() {
      disposeAddress = watch(
        () => this.address,
        address => {
          if (!isEmpty(address)) {
            this.syncDub()
            this.calcEstimateGas()
            userDUBChangeKey = this.listenUserDubChange()
          } else {
            userDUBChangeKey && useConnection().removeAccountChangeListener(userDUBChangeKey)
          }
        },
        { immediate: true }
      )
    },
    dispose() {
      disposeAddress && disposeAddress()
      userDUBChangeKey && useConnection().removeAccountChangeListener(userDUBChangeKey)
    },
    login(loginForm: LoginFormModel): Promise<LoginResultModel> {
      return new Promise((resolve, reject) => {
        login(loginForm)
          .then(res => {
            setToken(res.token)
            resolve(res)
            console.log('here login success:', res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    tmpTokenLogin(tmpToken: string) {
      return new Promise((resolve, reject) => {
        disposable2Token(tmpToken)
          .then(res => {
            setToken(res.token)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getUserInfo(type = 'login') {
      return new Promise((resolve, reject) => {
        getUserDetail()
          .then(res => {
            this.setUserInfo({
              ...res.user, 
              ...res.userPhysical
            })
            if (type === 'login') {
              this.roles = ['user']
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    setUserInfo(userInfo: UserInfoModel) {
      if (this.userInfo == null || this.userInfo.id !== userInfo.id) {
        this.userInfo = userInfo
      } else {
        this.userInfo = { ...userInfo, dub: this.userInfo.dub }
      }
    },
    updateUserInfo(userInfo: Partial<UserInfoModel>) {
      if (this.userInfo != null) {
        this.userInfo = { ...this.userInfo, ...userInfo }
      }
    },
    async syncDub() {
      if (!isEmpty(this.userInfo?.address)) {
        const resp = await getDub()
        if (resp != null) {
          this.userInfo = { ...this.userInfo, dub: String(resp?.dubAmt) }
        }
      }
    },
    resetInfo() {
      this.$reset()
    },
    logout() {
      return new Promise((resolve, reject) => {
        const token = getToken()
        if (token) {
          logout()
            .then(() => {
              this.reset()
              resolve({})
            })
            .catch(() => {
              this.reset()
              resolve({})
            })
        } else {
          this.reset()
        }
      })
    },
    reset() {
      this.roles = []
      this.resetInfo()
      localStorage.clear()
      sessionStorage.clear()
      removeAllCookies()
      resetRouter()

      const permissionStore = usePermissionStoreWithOut()
      permissionStore.setRoutes([])
      unsubscribe() // unsubscribe the browser push
      pubSubUtil.emit(SubName.Logout)
    },
    async bindWallet(type: WalletType) {
      const pubKey = await usePubkey(type)
      const address = pubKey.toBase58()
      bindUserWallet(type, address)
      this.userInfo.address = address
      this.userInfo.type = type
    },
    async calcEstimateGas() {
      this.estimateGas = await calcGasorExchangeDub(useWeb3Const().exchange.DUB2LOL.min)
    },
    async listenUserDubChange() {
      const ata = await useAta(new PublicKey(String(this.userInfo.address)))
      return useConnection().onAccountChange(
        ata,
        (updatedAccountInfo, _context) => {
          const resp = splToken.AccountLayout.decode(updatedAccountInfo.data)
          const dubAmt = Number(resp.amount) / useWeb3Const().DUB_DECIMALS
          this.userInfo = { ...this.userInfo, dub: String(dubAmt) }
        },
        'confirmed'
      )
    }
  }
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
