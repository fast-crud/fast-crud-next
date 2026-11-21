import { computed, useId, type Ref } from "vue";
import FnCheckbox from "../components/selection/fn-checkbox.vue";
import FnRadio from "../components/selection/fn-radio.vue";
import { getFnTableRowKey } from "../crud/table/row-key";
import type { FnCrudColumn, FnCrudOptions, FnRowContext, FnRowSelectOptions, FnTableRow, FnTableRowSelectionChange } from "../types/index";

export function createRowSelectionColumn(options: {
  rowSelect: FnRowSelectOptions;
  selectedRowKeys: string[];
  pageKeys: string[];
  radioName: string;
  getRecordId: (row: FnTableRow, index: number) => string;
  changeSelection: (change: FnTableRowSelectionChange) => void;
  togglePageSelection: (selected: boolean) => void;
}): FnCrudColumn {
  const selectedCount = options.pageKeys.filter(key => options.selectedRowKeys.includes(key)).length;
  const isSingle = options.rowSelect.type === "single";
  return {
    key: "__fn_selection_column",
    title: "",
    cell: {
      width: 56,
      order: -Infinity,
      fixed: options.rowSelect.fixed ?? undefined,
      resizable: false,
      class: "fn-table-selection-column",
      slots: {
        header: () => isSingle ? null : <FnCheckbox
          aria-label={options.rowSelect.title || "选择当前页"}
          modelValue={options.pageKeys.length > 0 && selectedCount === options.pageKeys.length}
          indeterminate={selectedCount > 0 && selectedCount < options.pageKeys.length}
          disabled={options.pageKeys.length === 0}
          onChange={options.togglePageSelection}
        />,
      },
      render: ({ row, index }: FnRowContext) => isSingle
        ? <FnRadio
            class="fn-table-checkbox"
            name={options.radioName}
            modelValue={options.selectedRowKeys[0]}
            value={options.getRecordId(row, index)}
            aria-label={`选择第 ${index + 1} 条记录`}
            onChange={() => options.changeSelection({ type: "row", row, index, selected: true })}
          />
        : <FnCheckbox
            class="fn-table-checkbox"
            aria-label={`选择第 ${index + 1} 条记录`}
            modelValue={options.selectedRowKeys.includes(options.getRecordId(row, index))}
            onChange={selected => options.changeSelection({ type: "row", row, index, selected })}
          />,
    },
  };
}

export function useSelection(props: FnCrudOptions, data: Ref<FnTableRow[]>) {
  const selectedRowKeys = computed(() => (props.rowSelect?.selectedRowKeys || []).map(String));
  const rowSelectionName = `fn-crud-selection-${useId()}`;
  const canBatchDelete = computed(() => selectedRowKeys.value.length > 0 && Boolean(props.request.delRequest));

  function getRecordId(row: FnTableRow, index = data.value.indexOf(row)): string {
    return String(getFnTableRowKey(row, index, props.table?.rowKey));
  }

  function updateSelection(keys: string[]): void {
    props.rowSelect?.onChange?.([...keys]);
  }

  function changeSelection(change: FnTableRowSelectionChange): void {
    const nextKeys = new Set(selectedRowKeys.value);
    if (change.type === "row") {
      const key = getRecordId(change.row, change.index);
      if (props.rowSelect?.type === "single") {
        updateSelection(change.selected ? [key] : []);
        return;
      }
      if (change.selected) {
        nextKeys.add(key);
      } else {
        nextKeys.delete(key);
      }
    } else {
      if (change.selected && !props.rowSelect?.crossPage) {
        nextKeys.clear();
      }
      for (let index = 0; index < data.value.length; index++) {
        const key = getRecordId(data.value[index], index);
        if (change.selected) {
          nextKeys.add(key);
        } else {
          nextKeys.delete(key);
        }
      }
    }
    updateSelection(Array.from(nextKeys));
  }

  function togglePageSelection(selected: boolean): void {
    changeSelection({ type: "page", selected });
  }

  function getSelectedRowKeys(): string[] {
    return [...selectedRowKeys.value];
  }

  function clearSelectedRowKeys(): void {
    updateSelection([]);
  }

  function syncSelectionForRows(rows: FnTableRow[]): void {
    if (!props.rowSelect?.crossPage) {
      const currentKeys = new Set(rows.map((row, index) => getRecordId(row, index)));
      const keys = selectedRowKeys.value.filter(key => currentKeys.has(key));
      if (keys.length !== selectedRowKeys.value.length) {
        props.rowSelect?.onChange?.(keys);
      }
    }
  }

  const selectionColumn = computed(() => {
    if (!props.rowSelect) return undefined;
    const pageKeys = data.value.map((row, index) => getRecordId(row, index));
    return createRowSelectionColumn({
      rowSelect: props.rowSelect,
      selectedRowKeys: selectedRowKeys.value,
      pageKeys,
      radioName: rowSelectionName,
      getRecordId,
      changeSelection,
      togglePageSelection,
    });
  });

  return {
    selectedRowKeys,
    rowSelectionName,
    canBatchDelete,
    selectionColumn,
    getRecordId,
    changeSelection,
    togglePageSelection,
    getSelectedRowKeys,
    clearSelectedRowKeys,
    syncSelectionForRows,
  };
}
