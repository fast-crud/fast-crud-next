import { describe, expect, it } from 'vitest'
import { parse } from 'vue/compiler-sfc'
import '@fast-crud/fn-admin-shared/mock'
import { api as basicApi } from './basis/basic/api'
import { api as computeApi } from './basis/compute/api'
import { api as requestMockApi } from './basis/request-mock/api'
import { api as credentialsApi } from './dict/credentials/api'
import { api as selectionApi } from './feature/selection/api'
import { api as conditionalApi } from './form/conditional/api'
import { api as formSlotsApi } from './form/slots/api'

const query = { page: { offset: 0, limit: 55 }, query: {} }

const demoApis = ["basis/sorting", "basis/quick-search", "feature/fixed-columns", "feature/column-preferences", "feature/single-selection", "feature/row-actions", "feature/compact-pagination", "feature/header-filters", "form/modes", "form/validation"]

const demoSources = import.meta.glob<string>('./*/*/index.vue', { query: '?raw', import: 'default' })

it.each(demoApis)('renders FnCrud directly inside the page container for %s', async (path) => {
  const source = await demoSources[`./${path}/index.vue`]()
  const { descriptor } = parse(source)
  const page = descriptor.template?.ast?.children[0]
  const childTags = page && 'tag' in page
    ? page.children.map((child) => 'tag' in child ? child.tag : undefined)
    : []

  expect(childTags).toContain('FnCrud')
})

it.each(demoApis)('serves records for %s', async (path) => {
  const modules = import.meta.glob<{ api: typeof basicApi }>('./*/*/api.ts')
  const { api } = await modules[`./${path}/api.ts`]()
  const result = await api.pageRequest({ ...query, page: { offset: 0, limit: 5 } })
  expect(result.total).toBe(55)
  expect(result.records).toHaveLength(5)
})

describe('Shared CRUD page mocks', () => {
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

    expect(results.map((result) => result.total)).toEqual([55, 55, 55, 55, 55, 55, 55])
    expect(results.every((result) => result.records.length === 55)).toBe(true)
  })

  it('returns dictionary tab counts and publishes selected change requests', async () => {
    const credentials = await credentialsApi.pageRequest(query)
    expect(credentials.tabsCounts).toEqual({ active: 33, review: 11, disabled: 11 })

    const pending = await selectionApi.pageRequest({ ...query, query: { status: '待发布' } })
    await selectionApi.publish([pending.records[0].id])
    const published = await selectionApi.pageRequest({ ...query, query: { status: '已发布' } })
    expect(published.total).toBe(1)
  })
})
