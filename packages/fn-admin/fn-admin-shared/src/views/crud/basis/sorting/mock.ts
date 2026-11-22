import mockUtil from "../../../../mock/base"

const values = [180,35,280,92,120]

export default mockUtil.buildMock({
  name: "FnAdminDemoSorting",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((latency, index) => ({ name: "接口调用 " + (index + 1), latency })),
})
