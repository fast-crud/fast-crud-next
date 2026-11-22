import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  window: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoFormModes")
