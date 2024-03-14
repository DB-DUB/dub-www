// convert Data URI to Blob object
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

export function dataURItoFile(dataURI: string, type: string) {
  const blob = dataURItoBlob(dataURI)

  const fileType = type === 'png' ? 'image/png' : 'image/jpeg'
  const fileName = type === 'png' ? 'image.png' : 'image.jpeg'

  // Convert blob object to file object
  const file = new File([blob], fileName, { type: fileType })
  return file
}

export function getThumbnail(originUrl: string, options: { width: number, height: number } = { width: 400, height: 400 }): string {
  const regex = /^data:image\/[a-zA-Z]+;base64,/i
  if (regex.test(originUrl)) {
    return originUrl
  }

  // aws cdn
  if (/^https:\/\/public.scorethedub.com\//.test(originUrl)) {
    if (options?.width && options?.height) {
      return originUrl.replace(/^https:\/\/public.scorethedub.com\//g, `https://publics.scorethedub.com/${options.width}x${options.height}/`)
    }
  }

  return originUrl
}
