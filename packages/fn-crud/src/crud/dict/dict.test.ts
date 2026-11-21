import { expect, it, vi } from "vitest";
import { reactive } from "vue";
import { DictStore } from "./dict";

it("多个消费端共享同一份异步字典，加载成功后复用结果", async () => {
  const option = { value: "active", label: "生效中" };
  const getDataFunc = vi.fn(async () => [option]);
  const dict = new DictStore({ data: [], immediate: false, getDataFunc });
  const { current } = reactive({ current: dict });
  const options = current.getOptions();
  expect(current).toBe(dict);
  expect(current.getOptions()).toBe(options);
  await dict.__fetch();
  expect(current.getOptions().value).toEqual([option]);
  expect(getDataFunc).toHaveBeenCalledOnce();
});

it("映射异步字典的嵌套字段和函数标签，保留数值、布尔值与选项元数据", async () => {
  const rows = [
    { state: { id: 0 }, title: "停用", disabled: true },
    { state: { id: false }, title: "未确认" },
    { state: {}, title: "缺少值" },
  ];
  const dict = new DictStore({
    immediate: false,
    value: "state.id",
    label: row => row.title,
    getDataFunc: async () => rows,
  });
  const options = dict.getOptions();
  expect(options.value).toEqual([]);
  await dict.__fetch();
  expect(options.value).toMatchObject([
    { value: 0, label: "停用", disabled: true },
    { value: false, label: "未确认" },
  ]);
  expect(rows[0]).not.toHaveProperty("value");
});
