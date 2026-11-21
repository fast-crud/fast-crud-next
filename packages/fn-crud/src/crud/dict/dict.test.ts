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
