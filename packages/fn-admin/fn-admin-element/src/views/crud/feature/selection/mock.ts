import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

const options: any = {
  name: 'FnAdminChangeRequests', idGenerator: 7300, copyTimes: 1,
  list: [
    { title: '生产证书续期', requester: '平台组', environment: '生产', status: '待发布', createdAt: '2026-11-16 10:42' },
    { title: '边缘节点配置同步', requester: '基础设施', environment: '预发布', status: '待发布', createdAt: '2026-11-16 09:18' },
    { title: '域名检查规则更新', requester: '平台组', environment: '测试', status: '待发布', createdAt: '2026-11-15 17:36' },
    { title: '旧凭证停用', requester: '安全组', environment: '生产', status: '待发布', createdAt: '2026-11-15 14:05' },
    { title: '站点探测频率调整', requester: '运维组', environment: '生产', status: '待发布', createdAt: '2026-11-14 11:27' },
    { title: 'DNS 记录校验', requester: '基础设施', environment: '预发布', status: '待发布', createdAt: '2026-11-13 16:50' },
  ],
}
const handlers = mockUtil.buildMock(options) as Array<{ path: string; handle: (request: any) => any }>
handlers.push({
  path: '/mock/FnAdminChangeRequests/publish',
  handle({ body }) {
    const selected = new Set((body.ids || []).map(Number))
    for (const record of options.list) if (selected.has(record.id)) record.status = '已发布'
    return { code: 0, msg: 'success', data: null }
  },
})

export default handlers
