import { filterToken, filterRequestData } from '@/utils/common'

export class RequestErr extends Error {
  public name
  public message
  constructor(error) {
    super()
    this.name = 'Request Error'
    this.stack = new Error().stack
    let requestData
    const errorData = error?.config?.data
    try {
      requestData = JSON.parse(errorData.toString())
    } catch {
      requestData = errorData
    }
    this.message = error
      ? {
          request: {
            type: error?.config?.type,
            url: error?.config?.url,
            params: error?.config?.params,
            headers: filterRequestData(error?.config?.headers),
            Authorization: filterToken(error?.config?.headers?.Authorization),
            data: filterRequestData(requestData)
          },
          response: error?.response
            ? {
                status: error?.response?.status,
                statusText: error?.response?.statusText || error?.message,
                body: error?.response?.data
              }
            : {
                code: error?.status,
                name: error?.statusText || error?.message,
                message: error?.data
              },
          version: import.meta.env.VITE_APP_VERSION
        }
      : {
          data: 'Default Message',
          version: import.meta.env.VITE_APP_VERSION
        }
    console.log('Request error msg:', this.message, error)
  }
}
