import { createSSRApp, type FunctionalComponent } from "vue";
import { renderToString, type SSRContext } from "vue/server-renderer";
import { expect, it, vi } from "vitest";
import { fnUiServicesKey, uiContext } from "../../components/provider/context";
import type { FnModalProps, FnTableSelectProps } from "../../types/index";
import { DictStore } from "../dict/dict";
import FnTableSelect from "./fn-table-select.vue";

let clickRow = false;
vi.mock("../fn-crud.vue", () => ({
  default: (props: { table?: { onRowClick?: (row: Record<string, any>, index: number) => void } }) => {
    if (clickRow) {
      props.table?.onRowClick?.({ id: 1, name: "负责人甲" }, 0);
    }
    return null;
  },
}));

vi.mock("../../components/overlay/fn-modal.vue", async importOriginal => {
  const { default: FnModal } = await importOriginal<typeof import("../../components/overlay/fn-modal.vue")>();
  // SSR 无法点击触发器，直接渲染已打开的弹窗以验证传入的配置。
  const OpenModal: FunctionalComponent<FnModalProps> = (props, { slots }) => (
    <FnModal {...props} open v-slots={slots} />
  );
  OpenModal.inheritAttrs = false;
  return { default: OpenModal };
});

async function renderDialog(dialog?: FnTableSelectProps["dialog"]) {
  const app = createSSRApp(FnTableSelect, {
    title: "选择记录",
    dialog,
    dict: new DictStore({ label: "name" }),
    crudOptions: {
      columns: {},
      search: { show: false },
      request: { pageRequest: async () => ({ records: [], total: 0 }) },
    },
  });
  app.provide(fnUiServicesKey, uiContext.getServices());
  const context: SSRContext = {};
  await renderToString(app, context);
  return context.teleports?.body;
}

it("未指定弹窗宽度时使用 FnModal 的默认宽度", async () => {
  expect(await renderDialog()).toContain('style="width:920px;"');
});

it("将自定义宽度、标题和按钮文案传给弹窗，保留按钮的默认配置", async () => {
  const html = await renderDialog({
    width: "70vw",
    title: "选择发布单",
    buttons: { confirm: { text: "选中此项" } },
  });

  expect(html).toContain('style="width:70vw;"');
  expect(html).toContain("选择发布单");
  expect(html).toContain("选中此项");
  expect(html).toContain("请选择一条记录");
  expect(html).toMatch(/<button[^>]* disabled[^>]* aria-label="选中此项"/);
  expect(html).not.toContain("重置");
});

it("单击表格行时暂存该行并更新选择摘要", async () => {
  clickRow = true;
  const html = await renderDialog();
  clickRow = false;

  expect(html).toContain("已选择：负责人甲");
});
