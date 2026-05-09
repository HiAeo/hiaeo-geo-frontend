import request from './request'

export const subscriptionApi = {
  // 获取当前订阅
  getCurrent: () => {
    return request('/subscription/current')
  },
  
  // 获取订阅历史
  getHistory: () => {
    return request('/subscription/history')
  },
  
  // 创建订阅
  create: (data) => {
    return request('/subscription', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 升级订阅
  upgrade: (packageId) => {
    return request('/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ packageId })
    })
  },
  
  // 续费订阅
  renew: () => {
    return request('/subscription/renew', {
      method: 'POST'
    })
  },
  
  // 取消订阅
  cancel: () => {
    return request('/subscription/cancel', {
      method: 'POST'
    })
  },
  
  // 获取套餐列表
  getPackages: () => {
    return request('/package')
  },
  
  // 获取套餐详情
  getPackage: (id) => {
    return request(`/package/${id}`)
  }
}

export const creditApi = {
  // 获取积分余额
  getBalance: () => {
    return request('/credit/balance')
  },
  
  // 获取积分历史
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/credit/history${query ? '?' + query : ''}`)
  },
  
  // 充值积分
  recharge: (data) => {
    return request('/credit/recharge', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
