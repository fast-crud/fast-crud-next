import mockUtil from "../../../../mock/base"

const values = ["在线", "离线", "维护", "在线", "离线"]

export default mockUtil.buildMock({
  name: "FnAdminDemoHeaderFilters",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((status, index) => ({ name: "节点 " + (index + 1), status, region: index % 2 ? "华北" : "华东" })),
})
