import { NEED_SHOW_BADGE } from './constant'

// token desensitization (retain the first 4 and last 4 digits)
export function filterToken(token) {
  return token && token.toString()
    ? token.toString().replace(/^(Bearer .{4}).*(.{4})$/, '$1****$2')
    : ''
}

// data desensitization (maybe contains password)
export function filterRequestData(data, filterFlag = false) {
  // Keys that need to be filtered out
  const filteredKeys = ['password', 'authorization', 'authorization-2']

  // Number, String, Boolean, Null, Undefined, Symbol, Function
  const dataTypes = ['number', 'string', 'boolean', 'undefined', 'symbol', 'function']
  const dataType = typeof data
  if (dataTypes.includes(dataType)) {
    if (filterFlag) {
      return '[Filtered]'
    } else {
      return data
    }
  }

  // Null
  if (data === null) {
    if (filterFlag) {
      return '[Filtered]'
    } else {
      return null
    }
  }

  // If it is judged to be a complex data type, then recursion is required
  const constructor = data.constructor
  const result = new constructor()
  if (Array.isArray(data)) {
    // Array
    for (let i = 0, length = data.length; i < length; i++) {
      result[i] = filterRequestData(data[i], filterFlag)
    }
  } else {
    // Object
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const flag = filteredKeys.includes(key.toLowerCase())
        result[key] = filterRequestData(data[key], flag)
      }
    }
  }
  return result
}

// Obtain device information, which can distinguish between iOS (iOS9 or above or below), Android, WeChat, Weibo, QQ, Facebook, etc.
export function getDeviceInfo() {
  let isIOS9 = false
  const u = navigator.userAgent
  const ua = u.toLowerCase()

  // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  const isAndroid = u.indexOf('Android') > -1
  const isIOS = ua.indexOf('like mac os x') > 0

  const isApple = ua.indexOf('mac os x') > 0

  const isIosSafari = isIOS && /safari\/[\d.]*$/.test(ua)
  const isOpera = u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1

  const isWechat = u.indexOf('MicroMessenger') > -1
  const isWeibo = u.indexOf('Weibo') > -1
  const isQQ = u.indexOf('QQ/') > -1
  const isFacebook = u.indexOf('FB') > -1
  const isLine = u.indexOf('Line') > -1
  const isIns = u.indexOf('Instagram') > -1
  const isSNSApp = isWechat || isWeibo || isQQ || isFacebook || isLine || isIns

  let version = ''
  if (isIOS) {
    // Ios
    const regStr_saf = /os [\d._]*/gi
    const verinfo = ua.match(regStr_saf)
    version = (verinfo + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.')

    const version_str = version + ''
    if (version_str !== 'undefined' && version_str.length > 0) {
      version = parseInt(version)
      if (version >= 8) {
        // iOS9 or higher
        isIOS9 = true
      }
    }
  }

  const displayMode = getPWADisplayMode()
  const isMobilePWA = (isIOS || isAndroid) && displayMode !== 'browser'
  const isMobilePWAInstall = (isIOS || isAndroid) && displayMode === 'browser'

  return {
    isAndroid,
    isIOS,
    isIOS9,
    isApple,
    isIosSafari,
    isOpera,
    isWechat,
    isQQ,
    isWeibo,
    isFacebook,
    isLine,
    isIns,
    isSNSApp,
    version,
    isMobilePWA,
    isMobilePWAInstall
  }
}

// Determine whether it is opened in pwa mode
export function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
  if (document.referrer.startsWith('android-app://')) {
    return 'twa'
  } else if (navigator.standalone || isStandalone || isMinimalUI) {
    return 'standalone'
  }
  return 'browser'
}
