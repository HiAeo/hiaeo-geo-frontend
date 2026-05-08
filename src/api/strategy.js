import request from './request'

export const strategyApi = {
  // 获取策略列表
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/strategy${query ? '?' + query : ''}`)
  },
  
  // 获取策略详情
  get: (id) => {
    return request(`/strategy/${id}`)
  },
  
  // 生成策略
  generate: (data) => {
    return request('/strategy/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 更新策略
  update: (id, data) => {
    return request(`/strategy/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // 删除策略
  delete: (id) => {
    return request(`/strategy/${id}`, {
      method: 'DELETE'
    })
  },
  
  // 执行策略
  execute: (id) => {
    return request(`/strategy/${id}/execute`, {
      method: 'POST'
    })
  }
}
