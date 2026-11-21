import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface Rotation { id: number; name: string; owner: string; strategy: string; graceDays: number; target: string; status: string }
export const api = createCrudApi<Rotation>('FnAdminRotations')
