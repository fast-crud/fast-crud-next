import type { FnTablePageQuery, FnTablePageResult } from '@fast-crud/fn-crud/crud'
import { requestMock } from './http'

export function createCrudApi<Row>(name: string) {
  const path = `/mock/${name}`
  return {
    pageRequest: (query: FnTablePageQuery) => requestMock<FnTablePageResult<Row>>({
      method: 'get',
      url: `${path}/page`,
      data: { ...query, sort: query.sort || { prop: '', asc: true } },
    }),
    addRequest: (form: Record<string, any>) => requestMock({ method: 'post', url: `${path}/add`, data: form }),
    editRequest: (form: Record<string, any>) => requestMock({ method: 'post', url: `${path}/update`, data: form }),
    delRequest: (id: string | number) => requestMock({ method: 'post', url: `${path}/delete`, params: { id }, data: {} }),
    custom: <Result>(endpoint: string, data: unknown) => requestMock<Result>({ method: 'post', url: `${path}/${endpoint}`, data }),
  }
}
