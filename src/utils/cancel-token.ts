import type { AxiosRequestConfig } from 'axios'
import { cloneDeep } from 'lodash-es'

// Identification and cancellation functions for storing each request
const pendingMap = new Map<string, AbortController>()

const getPendingUrl = (config: AxiosRequestConfig): string => {
  if (!config) return ''
  const { params } = config
  const tmpParams = cloneDeep(params)
  delete tmpParams?.pos
  delete tmpParams?.limit
  const searchParams = new URLSearchParams(tmpParams)
  const queryString = searchParams.toString()
  return `${config.method}:${config.url}?${queryString}`
}

export class AxiosCanceler {
  /**
   * addPending
   * @param config
   */
  public addPending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config)
    const controller = new AbortController()
    config.signal = config.signal || controller.signal
    if (!pendingMap.has(url)) {
      pendingMap.set(url, controller)
    }
  }

  /**
   * removeAllPending
   */
  public removeAllPending(): void {
    pendingMap.forEach(abortController => {
      if (abortController) {
        abortController.abort()
      }
    })
    this.reset()
  }

  /**
   * removePending
   * @param config
   */
  public removePending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
      // If the current request is waiting, cancel it and remove it from waiting
      const abortController = pendingMap.get(url)
      if (abortController) {
        abortController.abort(url)
      }
      pendingMap.delete(url)
    }
  }

  /**
   * reset
   */
  public reset(): void {
    pendingMap.clear()
  }
}
