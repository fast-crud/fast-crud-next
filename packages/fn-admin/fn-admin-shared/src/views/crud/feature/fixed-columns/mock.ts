import mockUtil from "../../../../mock/base"

const values = ["正常", "待复核", "正常", "异常", "正常"]

export default mockUtil.buildMock({
  name: "FnAdminDemoFixedColumns",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((status, index) => ({ name: "巡检任务 " + (index + 1), status, region: index % 2 ? "华北" : "华东", owner: ["平台组", "运维组"][index % 2], schedule: "每天 09:00", note: "检查部署状态与告警记录" })),
})
