import mockUtil from "@fast-crud/fn-admin-shared/mock/base";

export default mockUtil.buildMock({
  name: "FnAdminFormSlots",
  idGenerator: 1260,
  copyTimes: 1,
  list: [
    { name: "生产发布流程", owner: "平台组", environment: "生产", status: "待审批" },
    { name: "边缘节点升级", owner: "基础设施", environment: "预发布", status: "草稿" },
    { name: "证书轮换计划", owner: "安全组", environment: "生产", status: "已启用" },
    { name: "域名巡检任务", owner: "运维组", environment: "测试", status: "草稿" },
  ],
});
