import axios from 'axios'
import * as Sentry from '@sentry/vue'
import { getToken } from '@/utils/auth'
import { validHttpUrl } from '@/utils/validate'
import { AxiosCanceler } from '@/utils/cancel-token'
import { RequestErr } from '@/utils/CustomErr'
import router from '../router'

import codes from '@/api/config/code'
import { useUserStore, useUserStoreWithOut } from '@/stores/modules/user'

import type {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios'
import type { ResultModel } from '@/api/model/common'
import { SpecialCodeEnum } from '@/api/model/enums'

import ToastManager from '@/components/Toast/ToastManager.ts'

export interface ExtraConfig {
  msg: string
}

interface RequestConfig extends AxiosRequestConfig {
  extraConfig?: ExtraConfig
}

// create an axios instance
const service: AxiosInstance = axios.create({
  // baseURL: '/api/backend',
  baseURL: '/api',
  timeout: 30000
})

const axiosCanceler = new AxiosCanceler()
const logoutUrl = '/user/logout'

// request interceptor
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    axiosCanceler.addPending(config)
    if (token && config.url && !validHttpUrl(config.url)) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    console.log('response', response)

    const userStore = useUserStoreWithOut()

    const url = response.config.url || ''

    if (validHttpUrl(url)) {
      return response.data
    }

    if (url === logoutUrl) {
      axiosCanceler.removeAllPending()
    }

    const { data, code, config, msg } = response?.data

    if (code === SpecialCodeEnum.Normal) {
      response && axiosCanceler.removePending(config)
      return data
    } else {
      ToastManager().closeAll()
      if (Object.hasOwnProperty.call(codes, code)) {
        ToastManager().showToast(codes[code], 'error')
      } else if (code === SpecialCodeEnum.ServiceCustomError) {
        ToastManager().showToast(msg, 'error')
        config && axiosCanceler.removePending(config)
        return Promise.reject({ ...response.data, hasToast: true })
      } else if (code === SpecialCodeEnum.LolNotEnoughError) {
        ToastManager().showToast('Not enough balance', 'warn')
        useUserStore().getUserInfo()
      }

      if (code === SpecialCodeEnum.NoAuthorization) {
        axiosCanceler.removeAllPending()
        if (url !== logoutUrl) {
          userStore.logout().then(() => {
            router.push('/login')
          })
        }
      }
      response && axiosCanceler.removePending(config)
      return Promise.reject(response.data)
    }
  },
  error => {
    const { response, config } = error
    if (!axios.isCancel(error) && response && response?.data) {
      const { code = 0 } = response.data
      const userStore = useUserStoreWithOut()
      const url = config.url || ''
      
      if (url === logoutUrl) {
        axiosCanceler.removeAllPending()
      }

      if (code === SpecialCodeEnum.NoAuthorization) {
        axiosCanceler.removeAllPending()
        if (config.url !== logoutUrl) {
          userStore.logout().then(() => {
            router.push('/login')
          })
        }
      } else {
        config && axiosCanceler.removePending(config)
        const sentryErr = response || error
        const customErr = new RequestErr(sentryErr)
        Sentry.captureException(customErr)
      }
      ToastManager().closeAll()
      if (Object.hasOwnProperty.call(codes, code)) {
        ToastManager().showToast(codes[code], 'error')
      } else if (!code) {
        ToastManager().showToast('Something went wrong.', 'error')
      }

      if (code === SpecialCodeEnum.NoAuthorization) {
        axiosCanceler.removeAllPending()
        if (config.url !== logoutUrl) {
          userStore.logout().then(() => {
            router.push('/login')
          })
        }
      }
      return Promise.reject(response)
    } else {
      if (!(axios.isCancel(error) || error.message === 'Request aborted')) {
        ToastManager().closeAll()
        if (error.message === 'Network Error') {
          ToastManager().showToast('No internet connection. Please check and try again.', 'error')
        } else if (error.message.includes('timeout')) {
          ToastManager().showToast('Request timed out. Please try again later.', 'error')
        } else {
          console.log('other error', error)
          const customErr = new RequestErr(error)
          Sentry.captureException(customErr)
        }
      }
      return Promise.reject(error)
    }
  }
)

const request = <T = any>(config: RequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    service
      .request<any, AxiosResponse<ResultModel>>(config)
      .then(res => {
        resolve((res as unknown) as Promise<T>)
      })
      .catch(e => {
        reject(e)
      })
  })
}

export default request
