export function usePageVisibility() {
  let hidden = 'hidden'
  let visibilityChange = 'visibilitychange'

  function getSupportedProperty() {
    if (typeof document === 'undefined') return

    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }
  }
  getSupportedProperty()

  function isPageHidden() {
    if (typeof hidden !== 'string') return false
    return document[hidden]
  }

  return { isPageHidden, visibilityChange }
}
