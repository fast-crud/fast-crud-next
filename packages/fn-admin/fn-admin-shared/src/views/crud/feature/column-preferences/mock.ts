import mockUtil from "../../../../mock/base"

const values = ["平台组", "支撑组", "运维组", "平台组", "数据组"]

export default mockUtil.buildMock({
  name: "FnAdminDemoColumnPreferences",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((owner, index) => ({ name: "资产 " + (index + 1), owner, region: index % 2 ? "华北" : "华东", note: "内部服务" })),
})
