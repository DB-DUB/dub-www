import Cookies from 'js-cookie'
import { TOKEN, USE_WEB_FLAG } from '@/utils/constant'

export const TokenPrefix = 'Bearer '

export function getToken() {
  const cookieToken = Cookies.get(TOKEN)
  if (cookieToken) {
    if (!localStorage.getItem(TOKEN)) {
      setToken(cookieToken)
    }
    Cookies.remove(TOKEN)
  }
  return localStorage.getItem(TOKEN)
}

export function setToken(token: string) {
  return localStorage.setItem(TOKEN, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN)
}

export function getUseWebFlag() {
  return Cookies.get(USE_WEB_FLAG)
}

export function setUseWebFlag(status: number) {
  return Cookies.set(USE_WEB_FLAG, String(status), { expires: 365 * 99 })
}

export function removeAllCookies() {
  const cookies = document.cookie
  const list = cookies.split(';').map(item => item.trim())
  const reg = /([^=]+?)=(.+)/

  const map = {}
  list.forEach(str => {
    const res = reg.exec(str)
    if (res && res[1] && res[2]) {
      map[res[1]] = res[2]
    }
  })
  for (const k in map) {
    // Cookies.set(k, map[k], { expires: -1 })
    Cookies.remove(k)
  }
}
