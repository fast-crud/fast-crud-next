import type { FnTablePageQuery, FnTablePageResult } from "@fast-crud/fast-crud-next";

export interface ComponentDemoRow {
  id: number;
  name: string;
  scope: string;
  ownerId: number;
  enabled: boolean;
  tags: string[];
  longText: string;
  numberText: number;
  buttonText: string;
  linkText: string;
  reviewerId: number;
  scopeMultiple: string[];
  scopeTags: string[];
  scopeDisabled: string;
  switchValue: boolean;
}

export const rows: ComponentDemoRow[] = Array.from({ length: 55 }, (_, index) => ({
  id: index + 1,
  name: `组件示例 ${index + 1}`,
  scope: ["测试", "预发布", "生产"][index % 3],
  ownerId: (index % 8) + 1,
  enabled: index % 2 === 0,
  tags: index % 2 === 0 ? ["基础"] : ["需要复核"],
  longText: `这是一段用于演示文本省略和提示的较长内容 ${index + 1}`,
  numberText: index + 10,
  buttonText: "查看",
  linkText: "打开链接",
  reviewerId: ((index + 3) % 8) + 1,
  scopeMultiple: index % 2 === 0 ? ["测试", "预发布"] : ["生产"],
  scopeTags: index % 2 === 0 ? ["测试"] : ["预发布"],
  scopeDisabled: "测试",
  switchValue: index % 3 === 0,
}));

export const owners = rows.slice(0, 8).map(row => ({ id: row.id, name: `负责人 ${row.id}` }));

let nextId = Math.max(...rows.map(row => row.id), 0) + 1;

export const pageRequest = async (query: FnTablePageQuery): Promise<FnTablePageResult<ComponentDemoRow>> => {
  const keyword = String(query.query.name ?? "").trim();
  const filtered = keyword ? rows.filter(row => row.name.includes(keyword)) : rows;
  return { records: filtered.slice(query.page.offset, query.page.offset + query.page.limit), total: filtered.length };
};

export const ownerPageRequest = async (query: FnTablePageQuery): Promise<FnTablePageResult<{ id: number; name: string }>> => ({
  records: owners.slice(query.page.offset, query.page.offset + query.page.limit),
  total: owners.length,
});

export const request = {
  pageRequest,
  async addRequest(form: Record<string, any>): Promise<void> {
    rows.unshift({ id: nextId++, name: String(form.name ?? ""), scope: String(form.scope ?? "测试"), ownerId: Number(form.ownerId ?? 1), enabled: Boolean(form.enabled), tags: Array.isArray(form.tags) ? form.tags : [], longText: String(form.longText ?? ""), numberText: Number(form.numberText ?? 0), buttonText: String(form.buttonText ?? "查看"), linkText: String(form.linkText ?? "打开链接"), reviewerId: Number(form.reviewerId ?? 1), scopeMultiple: Array.isArray(form.scopeMultiple) ? form.scopeMultiple : [], scopeTags: Array.isArray(form.scopeTags) ? form.scopeTags : [], scopeDisabled: String(form.scopeDisabled ?? "测试"), switchValue: Boolean(form.switchValue) });
  },
  async editRequest(form: Record<string, any>): Promise<void> {
    const row = rows.find(item => item.id === Number(form.id));
    if (row) Object.assign(row, form);
  },
  async delRequest(id: string | number): Promise<void> {
    const index = rows.findIndex(item => item.id === Number(id));
    if (index >= 0) rows.splice(index, 1);
  },
};
