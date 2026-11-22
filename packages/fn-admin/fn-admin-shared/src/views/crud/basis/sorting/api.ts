import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  latency: number
}

export const api = createCrudApi<DemoRow>("FnAdminDemoSorting")
