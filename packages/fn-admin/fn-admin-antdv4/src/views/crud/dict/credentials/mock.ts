import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

const options = {
  name: 'FnAdminCredentials', idGenerator: 4100, copyTimes: 1,
  list: [
    { name: '生产证书轮换', owner: '平台组', scope: '生产', status: 'active', expiresAt: '2026-12-18' },
    { name: '边缘节点 API', owner: '基础设施', scope: '生产', status: 'active', expiresAt: '2027-02-03' },
    { name: '预发布域名校验', owner: '平台组', scope: '预发布', status: 'review', expiresAt: '2026-11-29' },
    { name: '旧系统同步', owner: '安全组', scope: '测试', status: 'disabled', expiresAt: '2026-10-30' },
    { name: '站点可用性巡检', owner: '运维组', scope: '生产', status: 'active', expiresAt: '2027-01-15' },
    { name: '测试环境 DNS 校验', owner: '基础设施', scope: '测试', status: 'review', expiresAt: '2026-12-05' },
    { name: '归档系统凭证', owner: '安全组', scope: '预发布', status: 'disabled', expiresAt: '2026-10-12' },
    { name: '应用网关证书', owner: '平台组', scope: '生产', status: 'active', expiresAt: '2027-03-22' },
  ],
}
const handlers = mockUtil.buildMock(options) as Array<{ path: string; handle: (request: any) => any }>
const page = handlers[0]
const pageRequest = page.handle
page.handle = (request) => {
  const result = pageRequest(request)
  result.data.tabsCounts = Object.fromEntries(['active', 'review', 'disabled'].map((status) => [status, options.list.filter((item) => item.status === status).length]))
  return result
}

export default handlers
