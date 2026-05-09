import request from './request'

export const publishApi = {
  // 发布内容
  publish: (data) => {
    return request('/publish', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 批量发布
  batchPublish: (data) => {
    return request('/publish/batch', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 获取发布列表
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/publish${query ? '?' + query : ''}`)
  },
  
  // 获取发布详情
  get: (id) => {
    return request(`/publish/${id}`)
  },
  
  // 取消发布
  cancel: (id) => {
    return request(`/publish/${id}/cancel`, {
      method: 'POST'
    })
  },
  
  // 重新发布
  retry: (id) => {
    return request(`/publish/${id}/retry`, {
      method: 'POST'
    })
  },
  
  // 复制内容
  copy: (id) => {
    return request(`/publish/${id}/copy`, {
      method: 'POST'
    })
  },
  
  // 导出内容
  export: (data) => {
    return request('/publish/export', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 获取平台状态
  getPlatformStatus: () => {
    return request('/publish/platforms/status')
  }
}
