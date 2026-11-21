import { markRaw, ref } from "vue";
import type { DictOption, DictOptionsRef, FnDictStore, FnTableRow } from "../../types/index.ts";
import { UnMergeable } from "../../components/use/use-merge";

export type { DictComponentType, DictOption, DictOptionsRef as DictPropsRef, DictValue, GetDictOptionsRef as GetDictPropsRef } from "../../types/index.ts";

export class DictStore extends UnMergeable implements FnDictStore {
  __options: DictOptionsRef = ref([]);
  value?: string;
  label?: string | ((row: FnTableRow) => string);
  getData?: () => Promise<DictOption[]>;
  getNodesByValues?: (values: Array<string | number>) => Promise<FnTableRow[]>;
  fetching = false;
  private request?: Promise<void>;

  constructor(opts: {
    data: DictOption[];
    value?: string;
    label?: string | ((row: FnTableRow) => string);
    getDataFunc?: () => Promise<DictOption[]>;
    getNodesByValues?: (values: Array<string | number>) => Promise<FnTableRow[]>;
    immediate?: boolean;
  }) {
    super();
    markRaw(this);
    this.__options.value = opts.data;
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
    this.request = Promise.resolve().then(getData).then(options => {
      this.__options.value = options;
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
