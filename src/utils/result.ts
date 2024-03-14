import { Recoverable } from 'repl'

export function successResult<T = Recoverable>(data: T, { message = 'Request success' } = {}) {
  return {
    code: 10000,
    data,
    message,
    status: 'ok'
  }
}
export function errorResult(message = 'Request failed', { code = -1, data = null } = {}) {
  return {
    code,
    data,
    message,
    status: 'fail'
  }
}

export interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization
}
