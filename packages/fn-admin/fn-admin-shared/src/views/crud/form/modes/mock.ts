import mockUtil from "../../../../mock/base"

const values = ["周一", "周二", "周三", "周四", "周五"]

export default mockUtil.buildMock({
  name: "FnAdminDemoFormModes",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((window, index) => ({ name: "维护窗口 " + (index + 1), window })),
})
