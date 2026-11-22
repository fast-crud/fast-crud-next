import { createCrudApi } from "../../../../mock/crud-api"

export interface DemoRow {
  id: number
  name: string
  email: string
}

export const api = createCrudApi<DemoRow>("FnAdminDemoFormValidation")
