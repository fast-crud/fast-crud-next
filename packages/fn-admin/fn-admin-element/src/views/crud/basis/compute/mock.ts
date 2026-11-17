import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

export default mockUtil.buildMock({
  name: 'ElementComputeTasks', idGenerator: 300, copyTimes: 1,
  list: [
    { task: '生产证书轮换', owner: '平台组', priority: 'P0', budget: 120, progress: 76, status: 'running' },
    { task: '边缘节点巡检', owner: '基础设施', priority: 'P1', budget: 80, progress: 48, status: 'running' },
    { task: '历史域名归档', owner: '安全组', priority: 'P2', budget: 36, progress: 100, status: 'done' },
    { task: 'DNS 故障复盘', owner: '平台组', priority: 'P0', budget: 60, progress: 24, status: 'blocked' },
  ],
})
