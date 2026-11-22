import { markRaw, type Component } from "vue";
import FnInput from "../../components/input/fn-input.vue";
import FnSelect from "../../components/selection/fn-select.vue";
import FnRadioGroup from "../../components/selection/fn-radio-group.vue";
import FnCheckboxGroup from "../../components/selection/fn-checkbox-group.vue";
import FnDictTag from "../../components/tag/fn-dict-tag.vue";
import type { FnCrudColumn, FnCrudColumnType, FnCrudColumnTypeOptions } from "../types";

const input = markRaw(FnInput);
const dictTag = markRaw(FnDictTag);
const textInput = { name: input };
const passwordInput = { name: input, type: "password" };
const numberInput = { name: input, type: "number" };
const selectInput = { name: markRaw(FnSelect) };

function dictChoices(name: Component, multiple = false) {
  const control = markRaw(name);
  return ({ dict }: Readonly<FnCrudColumn>): FnCrudColumnTypeOptions => {
    const options = dict?.getOptions();
    const component = { name: control, options };
    return {
      cell: { component: { name: dictTag, options } },
      search: { component: { ...component, ...selectInput, multiple, clearable: true } },
      form: { component },
    };
  };
}

export const builtinColumnTypes: Record<string, FnCrudColumnType> = {
  text: { form: { component: textInput }, search: { component: textInput } },
  password: { form: { component: passwordInput }, search: { component: passwordInput } },
  textarea: { form: { component: { name: input, multiline: true } }, search: { component: textInput } },
  number: { form: { component: numberInput }, search: { component: numberInput } },
  select: { form: { component: selectInput }, search: { component: selectInput } },
  "dict-select": dictChoices(FnSelect),
  "dict-radio": dictChoices(FnRadioGroup),
  "dict-checkbox": dictChoices(FnCheckboxGroup, true),
  colspan: { form: { span: 24 } },
};
