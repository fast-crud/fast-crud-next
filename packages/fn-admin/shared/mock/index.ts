import AxiosMockAdapter from 'axios-mock-adapter'
import { mockAxios } from './http'

interface MockHandler {
  path: string
  method?: string
  handle: (request: { body: any; params: Record<string, any> }) => any | Promise<any>
}

const modules = import.meta.glob<{ default?: MockHandler[] }>(['./common/mock.*.ts', './*.mock.ts'], { eager: true })
const mock = new AxiosMockAdapter(mockAxios, { delayResponse: 180 })

export function registerMockModules(modulesToRegister: Record<string, { default?: MockHandler[] }>): void {
  for (const module of Object.values(modulesToRegister)) {
    for (const handler of module.default || []) {
      mock.onAny(new RegExp(handler.path)).reply(async (config) => {
        const params = { ...(config.params || {}) }
        if (config.url?.includes('?')) {
          for (const [key, value] of new URLSearchParams(config.url.split('?')[1])) params[key] = value
        }
        let body: any = config.data || {}
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body)
          } catch {
            body = {}
          }
        }
        const result = await handler.handle({ body, params })
        return [200, { code: result.code, msg: result.msg, data: result.data }]
      })
    }
  }
}

registerMockModules(modules)
