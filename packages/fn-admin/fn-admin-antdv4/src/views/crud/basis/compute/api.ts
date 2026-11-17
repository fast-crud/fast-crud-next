import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface Order { id: number; product: string; quantity: number; unitPrice: number; tier: string; total: number }
export const api = createCrudApi<Order>('FnAdminCompute')
