export const columnKeys = Array.from({ length: 99 }, (_, index) => `value${index + 1}`)

export function getPage(offset: number, limit: number, rowNumber?: string | number) {
  const rowCount = 300
  const search = String(rowNumber ?? "").trim()
  const id = Number(search)
  const total = search ? Number(Number.isInteger(id) && id >= 1 && id <= rowCount) : rowCount
  const records = Array.from({ length: Math.max(0, Math.min(limit, total - offset)) }, (_, index) => {
    const rowId = search ? id : offset + index + 1
    return { ...Object.fromEntries(columnKeys.map((key, column) => [key, `${rowId}-${column + 1}`])), id: rowId }
  })
  return { records, total }
}
