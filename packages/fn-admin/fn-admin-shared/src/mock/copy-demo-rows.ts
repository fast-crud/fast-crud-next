export function copyDemoRows<Row extends { id: number }>(rows: Row[]): Row[] {
  const seed = rows.slice(0, 5);
  const repeated: Row[] = [];
  let nextId = Math.max(...seed.map(row => row.id)) + 1;

  for (let copy = 0; copy < 11; copy++) {
    repeated.push(...seed.map(row => ({ ...row, id: copy === 0 ? row.id : nextId++ })));
  }

  return repeated;
}
