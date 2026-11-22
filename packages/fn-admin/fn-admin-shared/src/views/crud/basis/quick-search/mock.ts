import mockUtil from "../../../../mock/base"

const values = ["待处理", "已完成", "待处理", "已完成", "已完成"]

export default mockUtil.buildMock({
  name: "FnAdminDemoQuickSearch",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((status, index) => ({ name: "工单 " + (index + 1), status })),
})
