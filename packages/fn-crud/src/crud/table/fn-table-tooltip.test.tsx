import { createSSRApp, type FunctionalComponent } from "vue";
import { renderToString, type SSRContext } from "vue/server-renderer";
import { expect, it, vi } from "vitest";
import type { FnRowContext } from "../../types/index.ts";
import FnTable from "./fn-table.vue";

vi.mock("../../components/overlay/fn-tooltip.vue", async (importOriginal) => {
  const { default: FnTooltip } = await importOriginal<typeof import("../../components/overlay/fn-tooltip.vue")>();
  const OpenTooltip: FunctionalComponent<{ content?: string; disabled?: boolean }> = (props, { slots }) => (
    <FnTooltip {...props} open={!props.disabled} v-slots={slots} />
  );
  return { default: OpenTooltip };
});

it("为普通单元格和自定义内容渲染文本提示，空提示沿用单元格原有显示", async () => {
  const context: SSRContext = {};
  const row = { name: "订单服务", owner: "张三", status: "运行中", note: "无备注" };
  const tooltip = vi.fn(({ row, index }: FnRowContext) => `${index + 1}. ${row.owner}`);
  const app = createSSRApp(() => (
    <FnTable data={[row]} columns={{
      name: { key: "name", title: "名称", cell: { ellipsis: true, tooltip: "服务名称说明" } },
      owner: { key: "owner", title: "负责人", cell: { tooltip, render: () => <strong>自定义负责人</strong> } },
      status: { key: "status", title: "状态", cell: { tooltip: "服务状态说明", slots: { default: () => <em>自定义状态</em> } } },
      note: { key: "note", title: "备注", cell: { ellipsis: true, tooltip: () => "" } },
    }} />
  ));
  const html = await renderToString(app, context);
  const descriptions = Array.from(html.matchAll(/aria-describedby="([^"]+)"/g), match => match[1]);

  expect(descriptions).toHaveLength(3);
  for (const id of descriptions) {
    expect(context.teleports?.body).toContain(`id="${id}"`);
  }
  expect(context.teleports?.body).toContain("服务名称说明");
  expect(context.teleports?.body).toContain("1. 张三");
  expect(context.teleports?.body).toContain("服务状态说明");
  expect(tooltip).toHaveBeenCalledWith(expect.objectContaining({ type: "row", row, form: row, index: 0 }));
  expect(html).toContain('tabindex="0"');
  expect(html).toContain("订单服务");
  expect(html).toContain("<strong>自定义负责人</strong>");
  expect(html).toContain("<em>自定义状态</em>");
  expect(html).not.toContain('title="订单服务"');
  expect(html).toContain('title="无备注"');
});
