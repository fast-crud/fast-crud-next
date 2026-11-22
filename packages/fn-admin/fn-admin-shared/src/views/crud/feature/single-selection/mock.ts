import mockUtil from "../../../../mock/base"

const values = ["1.2.0", "1.3.0", "2.0.0", "2.1.0", "2.2.0"]

export default mockUtil.buildMock({
  name: "FnAdminDemoSingleSelection",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((version, index) => ({ name: "发布单 " + (index + 1), version })),
})
