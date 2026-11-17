import { describe, expect, it } from 'vitest'
import './index'
import { requestMock } from './http'
import type { ServiceRecord } from './types'

describe('axios mock adapter CRUD endpoints', () => {
  it('pages and filters records through the shared mock routes', async () => {
    const result = await requestMock<{ records: ServiceRecord[]; total: number }>({
      method: 'get',
      url: '/mock/FnCrudServices/page',
      data: { page: { offset: 0, limit: 5 }, query: { owner: '平台组' } },
    })

    expect(result.total).toBeGreaterThan(0)
    expect(result.records).toHaveLength(4)
    expect(result.records.every((record) => record.owner === '平台组')).toBe(true)
  })

  it('adds, updates, and deletes a record through the copied buildMock routes', async () => {
    const added = await requestMock<ServiceRecord>({ method: 'post', url: '/mock/FnCrudServices/add', data: { name: '接口 mock 测试', owner: '平台组' } })
    await requestMock({ method: 'post', url: '/mock/FnCrudServices/update', data: { id: added.id, status: '运行中' } })
    await requestMock({ method: 'post', url: '/mock/FnCrudServices/delete', params: { id: added.id } })

    const page = await requestMock<{ records: ServiceRecord[]; total: number }>({ method: 'get', url: '/mock/FnCrudServices/page', data: { page: { offset: 0, limit: 20 }, query: { name: '接口 mock 测试' } } })
    expect(page.total).toBe(0)
  })
})
