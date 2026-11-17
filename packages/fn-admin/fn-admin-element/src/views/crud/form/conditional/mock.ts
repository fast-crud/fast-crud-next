import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

export default mockUtil.buildMock({
  name: 'FnAdminRotations', idGenerator: 810, copyTimes: 1,
  list: [
    { name: '生产证书轮换', owner: '平台组', strategy: '自动轮换', graceDays: 14, target: '证书服务', status: '已启用' },
    { name: '边缘节点密钥', owner: '基础设施', strategy: '人工审批', graceDays: 7, target: '节点网关', status: '已启用' },
    { name: '预发布签名密钥', owner: '安全组', strategy: '自动轮换', graceDays: 30, target: '发布流水线', status: '待启用' },
    { name: '支付网关密钥', owner: '平台组', strategy: '人工审批', graceDays: 7, target: '支付服务', status: '已启用' },
    { name: '测试域名证书', owner: '运维组', strategy: '自动轮换', graceDays: 14, target: '域名平台', status: '已启用' },
    { name: '边缘签名凭证', owner: '基础设施', strategy: '人工审批', graceDays: 3, target: '边缘节点', status: '待启用' },
    { name: '内部服务凭证', owner: '安全组', strategy: '自动轮换', graceDays: 21, target: '身份服务', status: '已启用' },
  ],
})
