import { describe, expect, it } from 'vitest'
import { registerMockModules } from '@fast-crud/fn-admin-shared/mock'
import { api as basicApi } from './basis/basic/api'
import { api as computeApi } from './basis/compute/api'
import { api as requestMockApi } from './basis/request-mock/api'
import { api as credentialsApi } from './dict/credentials/api'
import { api as selectionApi } from './feature/selection/api'
import { api as conditionalApi } from './form/conditional/api'
import { api as formSlotsApi } from './form/slots/api'

registerMockModules(import.meta.glob<{ default?: Array<{ path: string; handle: (request: any) => any }> }>('./**/mock.ts', { eager: true }))

const query = { page: { offset: 0, limit: 20 }, query: {} }

describe('Ant Design Vue CRUD page mocks', () => {
  it('registers each categorized page mock and serves its page endpoint', async () => {
    const results = await Promise.all([
      basicApi.pageRequest(query),
      computeApi.pageRequest(query),
      requestMockApi.pageRequest(query),
      credentialsApi.pageRequest(query),
      selectionApi.pageRequest(query),
      conditionalApi.pageRequest(query),
      formSlotsApi.pageRequest(query),
    ])

    expect(results.map((result) => result.total)).toEqual([5, 3, 12, 8, 6, 7, 4])
    expect(results.every((result) => result.records.length > 0)).toBe(true)
  })

  it('returns dictionary tab counts and publishes selected change requests', async () => {
    const credentials = await credentialsApi.pageRequest(query)
    expect(credentials.tabsCounts).toEqual({ active: 4, review: 2, disabled: 2 })

    const pending = await selectionApi.pageRequest({ ...query, query: { status: '待发布' } })
    await selectionApi.publish([pending.records[0].id])
    const published = await selectionApi.pageRequest({ ...query, query: { status: '已发布' } })
    expect(published.total).toBe(1)
  })
})
