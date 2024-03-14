import { InjectVconsole } from '../../vite-plugin-inject-vconsole/index'

export const InjectVconsolePlugin = ({ isProd, isBuild }) => {
  return InjectVconsole({
    isProd,
    isBuild
  })
}
