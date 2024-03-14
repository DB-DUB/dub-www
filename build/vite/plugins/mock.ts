/**
 * @name ConfigMockPlugin
 * @description mockjs for mock server data
 */
import { viteMockServe } from 'vite-plugin-mock'
export const ConfigMockPlugin = (isBuild: boolean) => {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    // localEnabled: true,
    prodEnabled: false,
    // https://github.com/anncwb/vite-plugin-mock/issues/9
    injectCode: `
       import { setupProdMockServer } from '../mock/_createProdMockServer';
       setupProdMockServer();
       `
  })
}
