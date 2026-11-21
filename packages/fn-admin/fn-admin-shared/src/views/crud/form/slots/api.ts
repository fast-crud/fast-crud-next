import { createCrudApi } from "@fast-crud/fn-admin-shared/mock/crud-api";

export interface WorkflowRecord {
  id: number;
  name: string;
  owner: string;
  environment: string;
  status: string;
}

export const api = createCrudApi<WorkflowRecord>("FnAdminFormSlots");
