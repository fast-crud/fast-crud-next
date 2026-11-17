import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

export default mockUtil.buildMock({
  name: 'NaiveBasicServices', idGenerator: 1040, copyTimes: 1,
  list: [
    { name: '证书自动续期', owner: '平台组', environment: '生产', status: '运行中', updatedAt: '2026-11-16 10:42' },
    { name: '边缘节点同步', owner: '基础设施', environment: '生产', status: '运行中', updatedAt: '2026-11-16 09:18' },
    { name: '域名健康检查', owner: '平台组', environment: '预发布', status: '待发布', updatedAt: '2026-11-15 17:36' },
    { name: '旧证书清理', owner: '安全组', environment: '生产', status: '已暂停', updatedAt: '2026-11-15 14:05' },
    { name: '站点可用性巡检', owner: '运维组', environment: '测试', status: '运行中', updatedAt: '2026-11-14 11:27' },
  ],
})
