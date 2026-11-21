import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { installFnCrud } from "@fast-crud/fast-crud-next";
import { router } from "./router";
import "@fast-crud/fn-admin-shared/mock";

installFnCrud({ commonOptions: () => ({ table: { size: 14, density: "comfort" } }) });
createApp(App).use(router).mount("#app");
