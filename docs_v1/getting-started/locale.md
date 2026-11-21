# 配置 FnCrud 语言

在应用入口调用 `installFnCrud`，并在页面调用 `useFnCrud` 初始化之前设置 `locale`。

```ts
import { installFnCrud } from "@fast-crud/fast-crud-next";

installFnCrud({ locale: "en-US" });
```

`locale` 支持 `zh-CN`（简体中文）和 `en-US`（英语），省略时使用 `zh-CN`。`commonOptions` 可以与 `locale` 一起传入。

应用运行期间可传入响应式语言配置。修改 `locale.value` 后，当前页面的默认文案随之更新。

```ts
import { ref } from "vue";
import { installFnCrud, type FnCrudLocale } from "@fast-crud/fast-crud-next";

const locale = ref<FnCrudLocale>("zh-CN");
installFnCrud({ locale });

function switchToEnglish() {
  locale.value = "en-US";
}
```

当前词表涵盖 `useFnCrud` 生成的添加、批量操作、批量删除和编辑弹窗标题。公共配置可覆盖默认译文，页面配置优先于公共配置。

词表位于 `packages/fn-crud/src/locale/zh` 和 `packages/fn-crud/src/locale/en`。两种语言都按 `crud` 和 `components` 分组，每个模块使用独立的词表文件。目前 `crud/actionbar.ts` 存放操作栏文案，`crud/form-dialog.ts` 存放表单弹窗文案。
