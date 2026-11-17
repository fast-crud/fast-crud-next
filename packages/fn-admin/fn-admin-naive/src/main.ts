import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";
import { installFnCrud } from "@fast-crud/fast-crud-next";
import { routes } from "./router";
import "@fast-crud/fn-admin-shared/mock";

installFnCrud({ commonOptions: () => ({ table: { size: 14, density: "comfort" } }) });
const router = createRouter({ history: createWebHistory(), routes });
createApp(App).use(router).mount("#app");
