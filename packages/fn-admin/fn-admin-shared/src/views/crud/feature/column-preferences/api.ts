import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  owner: string
  region: string
  note: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoColumnPreferences")
