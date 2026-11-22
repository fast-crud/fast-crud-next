import { expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, type PropType } from 'vue'
import { renderToString } from 'vue/server-renderer'
import type { FnCrudOptions } from '@fast-crud/fast-crud-next'
import RequestMockView from './index.vue'

let columns: FnCrudOptions['columns']

vi.mock('@fast-crud/fast-crud-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@fast-crud/fast-crud-next')>()
  return {
    ...actual,
    FnCrud: defineComponent({
      props: { columns: { type: Object as PropType<FnCrudOptions['columns']>, required: true } },
      setup(props) {
        columns = props.columns
        return () => null
      },
    }),
  }
})

it('状态列使用字典标签、新增默认值和同一份表头筛选选项', async () => {
  await renderToString(createSSRApp(RequestMockView))

  const status = columns.status
  const options = status.dict?.getOptions().value
  expect(options?.map(({ value }) => value)).toEqual(['运行中', '待发布', '已暂停'])
  expect(status).toMatchObject({
    type: 'dict-select',
    search: { show: false },
    form: { value: '待发布' },
    cell: { filter: { options } },
  })
  expect(status.cell).not.toHaveProperty('render')
})
