import { createApp } from "vue";
import { installFnCrud, uiContext } from "@fast-crud/fast-crud-next";
import "ant-design-vue/dist/reset.css";
import "@fast-crud/fast-crud-next/theme/tokens.css";
import "./style.css";
import App from "./App.vue";
import { registerMockModules } from "@fast-crud/fn-admin-shared/mock";
import { message, notification } from "ant-design-vue";
import { router } from "./router";

const crudMockModules = import.meta.glob<{ default?: Array<{ path: string; handle: (request: any) => any }> }>("./views/crud/**/mock.ts", { eager: true });
registerMockModules(crudMockModules);
installFnCrud({ commonOptions: () => ({ table: { size: 14, density: "comfort" } }) });
uiContext.setServices({ notification, message });
createApp(App).use(router).mount("#app");
