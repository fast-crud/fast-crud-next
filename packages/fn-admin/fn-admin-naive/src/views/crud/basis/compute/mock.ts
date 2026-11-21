import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

export default mockUtil.buildMock({
  name: 'NaiveComputeRules', idGenerator: 0, copyTimes: 11,
  list: [
    { name: '生产证书临期提醒', scope: '生产', mode: '邮件', threshold: 14, enabled: true },
    { name: '预发布域名巡检', scope: '预发布', mode: 'Webhook', threshold: 30, enabled: true },
    { name: '测试环境清理', scope: '测试', mode: '站内信', threshold: 7, enabled: false },
  ],
})
