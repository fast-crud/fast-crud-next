import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface RuleRecord { id: number; name: string; scope: string; mode: string; threshold: number; enabled: boolean }
export const api = createCrudApi<RuleRecord>('NaiveComputeRules')
