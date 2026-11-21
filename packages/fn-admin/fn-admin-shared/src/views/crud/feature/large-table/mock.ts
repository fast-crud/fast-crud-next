export const columnKeys = Array.from({ length: 99 }, (_, index) => `value${index + 1}`)

export function getPage(offset: number, limit: number) {
  const total = 300
  const records = Array.from({ length: Math.max(0, Math.min(limit, total - offset)) }, (_, index) => {
    const id = offset + index + 1
    return { ...Object.fromEntries(columnKeys.map((key, column) => [key, `${id}-${column + 1}`])), id }
  })
  return { records, total }
}
