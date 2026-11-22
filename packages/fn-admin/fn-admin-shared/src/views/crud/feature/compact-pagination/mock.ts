import mockUtil from "../../../../mock/base"

const values = ["王宁", "陈晨", "林安", "周平", "李珂"]

export default mockUtil.buildMock({
  name: "FnAdminDemoCompactPagination",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((actor, index) => ({ name: "审计事件 " + (index + 1), actor })),
})
