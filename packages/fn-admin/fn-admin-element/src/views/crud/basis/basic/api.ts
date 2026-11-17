import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface ServiceRecord { id: number; name: string; owner: string; environment: string; status: string; updatedAt: string }
export const api = createCrudApi<ServiceRecord>('ElementBasicServices')
