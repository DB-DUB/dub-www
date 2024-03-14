export function validHttpUrl(url: string) {
  return /^http:\/\/|^https:\/\//.test(url)
}
