import type { Plugin } from 'vite'
import { Window } from 'happy-dom'
interface InjectVconsoleOptions {
  isProd?: Boolean
  isBuild?: Boolean
}

const InjectVconsole = (options: InjectVconsoleOptions = {}): Plugin => {
  const { isProd = false, isBuild = true } = options
  return {
    name: 'vite-plugin-inject-vconsole',
    enforce: 'post',
    transformIndexHtml(raw: string) {
      const window = new Window()
      const { document } = window
      document.body.innerHTML = raw
      if (!isProd && isBuild) {
        // const script1 = document.createElement('script')
        // script1.src = 'https://unpkg.com/vconsole@3.2.0/dist/vconsole.min.js'
        // const script2 = document.createElement('script')
        // script2.innerText = 'new VConsole()'
        // const fragment = document.createDocumentFragment()
        // fragment.appendChild(script1)
        // fragment.appendChild(script2)
        document.body.innerHTML = raw.replace(
          '</body>',
          `<script src="https://unpkg.com/vconsole@3.2.0/dist/vconsole.min.js"></script>
          <script>new VConsole()</script>
          </body>`
        )
      }
      return document.body.innerHTML
    }
  }
}

export { InjectVconsole }
