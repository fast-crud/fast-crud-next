import { markRaw, ref } from "vue";
import get from "lodash-es/get";
import type { DictOption, DictOptionsRef, FnDictStore, FnTableRow } from "../../types/index.ts";
import { UnMergeable } from "../../components/use/use-merge";

export type { DictComponentType, DictOption, DictOptionsRef as DictPropsRef, DictValue, GetDictOptionsRef as GetDictPropsRef } from "../../types/index.ts";

export class DictStore extends UnMergeable implements FnDictStore {
  __options: DictOptionsRef = ref([]);
  value?: string;
  label?: string | ((row: FnTableRow) => string);
  getData?: () => Promise<FnTableRow[]>;
  getNodesByValues?: (values: Array<string | number>) => Promise<FnTableRow[]>;
  fetching = false;
  private request?: Promise<void>;

  constructor(opts: {
    data?: DictOption[];
    value?: string;
    label?: string | ((row: FnTableRow) => string);
    getDataFunc?: () => Promise<FnTableRow[]>;
    getNodesByValues?: (values: Array<string | number>) => Promise<FnTableRow[]>;
    immediate?: boolean;
  }) {
    super();
    markRaw(this);
    this.__options.value = opts.data ?? [];
    this.value = opts.value;
    this.label = opts.label;
    this.getData = opts.getDataFunc;
    this.getNodesByValues = opts.getNodesByValues;
    if (opts.immediate !== false) {
      this.getOptions();
    }
  }

  getOptions(): DictOptionsRef {
    if (!this.request && this.getData) {
      void this.__fetch().catch(error => console.error("[FnCrud] 加载字典失败", error));
    }
    return this.__options;
  }

  async __fetch(): Promise<void> {
    if (this.request) return this.request;
    if (!this.getData) return;
    const getData = this.getData.bind(this);
    this.fetching = true;
    this.request = Promise.resolve().then(getData).then(rows => {
      const valuePath = this.value ?? "value";
      const label = this.label ?? "label";
      this.__options.value = rows.flatMap((row): DictOption[] => {
        const value = get(row, valuePath);
        if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return [];
        const text = typeof label === "function" ? label(row) : get(row, label);
        return [{ ...row, value, label: String(text ?? value) }];
      });
    });
    try {
      await this.request;
    } catch (error) {
      this.request = undefined;
      throw error;
    } finally {
      this.fetching = false;
    }
  }
}
