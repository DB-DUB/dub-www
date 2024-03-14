/**
 * @name ConfigCompressPlugin
 * @description Enable .gz compression
 */
import viteCompression from 'vite-plugin-compression'
import { COMPRESSION } from '../../constant'

export const ConfigCompressPlugin = () => {
  if (COMPRESSION) {
    return viteCompression({
      verbose: true,
      disable: false, // Enable compression (do not disable it)
      deleteOriginFile: false, // Delete source file
      threshold: 10240, // Minimum file size before compression
      algorithm: 'gzip', // Compression algorithm
      ext: '.gz' // File type
    })
  }
  return []
}
