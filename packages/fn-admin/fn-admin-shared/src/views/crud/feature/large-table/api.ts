import type { FnCrudState } from "@fast-crud/fast-crud-next"
import { getPage } from "./mock"

export type LargeTableRow = ReturnType<typeof getPage>["records"][number]
type PageRequest = NonNullable<FnCrudState<LargeTableRow>["request"]["pageRequest"]>

export const pageRequest: PageRequest = async ({ page }) => getPage(page.offset, page.limit)
