import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'

export interface TaskRecord { id: number; task: string; owner: string; priority: 'P0' | 'P1' | 'P2'; budget: number; progress: number; status: 'running' | 'blocked' | 'done' }
export const api = createCrudApi<TaskRecord>('ElementComputeTasks')
