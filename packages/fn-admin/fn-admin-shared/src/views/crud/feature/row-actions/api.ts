import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  channel: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoRowActions")
