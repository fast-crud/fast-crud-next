import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  status: string
  region: string
  owner: string
  schedule: string
  note: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoFixedColumns")
