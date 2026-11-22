import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  version: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoSingleSelection")
