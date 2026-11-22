import mockUtil from "../../../../mock/base"

const values = ["邮件", "短信", "站内信", "邮件", "站内信"]

export default mockUtil.buildMock({
  name: "FnAdminDemoRowActions",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((channel, index) => ({ name: "通知规则 " + (index + 1), channel })),
})
