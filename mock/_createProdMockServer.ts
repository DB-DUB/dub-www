import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
// batch load mock files
const modules: Record<string, any> = import.meta.glob('./mock/*.ts', { eager: true })

const mockModules: Array<string> = []
Object.keys(modules).forEach(key => {
  if (key.includes('/_')) {
    return
  }
  mockModules.push(...modules[key].default)
})

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
