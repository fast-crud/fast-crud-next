import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface Credential { id: number; name: string; owner: string; scope: string; status: string; expiresAt: string }
export const api = createCrudApi<Credential>('FnAdminCredentials')
