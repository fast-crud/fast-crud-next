import mockUtil from '@fast-crud/fn-admin-shared/mock/base'

export default mockUtil.buildMock({
  name: 'FnAdminCompute', idGenerator: 300, copyTimes: 1,
  list: [
    { product: '边缘节点套餐', quantity: 4, customPrice: false, unitPrice: 680, tier: '标准', total: 2720 },
    { product: '证书托管套餐', quantity: 12, customPrice: true, unitPrice: 120, tier: '批量', total: 1440 },
    { product: '健康检查套餐', quantity: 2, customPrice: false, unitPrice: 980, tier: '标准', total: 1960 },
  ],
})
