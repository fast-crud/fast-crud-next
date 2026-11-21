import { describe, expect, it } from 'vitest'
import { copyDemoRows } from './copy-demo-rows'

describe('copyDemoRows', () => {
  it('copies five seed records eleven times with unique ids', () => {
    const rows = copyDemoRows(Array.from({ length: 5 }, (_, index) => ({ id: index + 1, name: `Record ${index + 1}` })))

    expect(rows).toHaveLength(55)
    expect(new Set(rows.map(row => row.id)).size).toBe(55)
    expect(rows.slice(0, 5).map(row => row.name)).toEqual(rows.slice(50).map(row => row.name))
  })
})
