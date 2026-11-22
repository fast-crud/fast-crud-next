import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  actor: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoCompactPagination")
