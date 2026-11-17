import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface ChangeRequest { id: number; title: string; requester: string; environment: string; status: string; createdAt: string }
const crudApi = createCrudApi<ChangeRequest>('FnAdminChangeRequests')
export const api = { ...crudApi, publish: (ids: Array<string | number>) => crudApi.custom<void>('publish', { ids }) }
