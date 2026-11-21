import { markRaw } from "vue";
import FnInput from "../../components/input/fn-input.vue";
import FnSelect from "../../components/selection/fn-select.vue";
import FnDictLabel from "../dict/fn-dict-label.vue";
import type { FnCrudColumnType } from "../types";

const input = markRaw(FnInput);
const select = markRaw(FnSelect);
const dictLabel = markRaw(FnDictLabel);
const textInput = { name: input };
const passwordInput = { name: input, type: "password" };
const numberInput = { name: input, type: "number" };
const selectInput = { name: select };

export const builtinColumnTypes: Record<string, FnCrudColumnType> = {
  text: { form: { component: textInput }, search: { component: textInput } },
  password: { form: { component: passwordInput }, search: { component: passwordInput } },
  textarea: { form: { component: { name: input, multiline: true } }, search: { component: textInput } },
  number: { form: { component: numberInput }, search: { component: numberInput } },
  select: { form: { component: selectInput }, search: { component: selectInput } },
  "dict-select": ({ dict }) => ({
    cell: { dict, component: { name: dictLabel } },
    search: { dict, component: { name: select, clearable: true } },
    form: { dict, component: selectInput },
  }),
  colspan: { form: { span: 24 } },
};
