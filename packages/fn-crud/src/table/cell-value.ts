import type { FnTableRow } from "../types/index";

export function updateCellValue(row: FnTableRow | undefined, key: string, value: unknown): void {
  if (!row) return;

  const keys = key.split(".");
  const field = keys.pop();
  if (!field) return;

  let target = row;
  for (const nestedKey of keys) {
    const nested = target[nestedKey];
    if (typeof nested !== "object" || nested === null) return;
    target = nested;
  }
  target[field] = value;
}
