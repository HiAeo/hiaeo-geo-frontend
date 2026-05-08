import request from './request'

export const brandApi = {
  // 获取品牌列表
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/brand${query ? '?' + query : ''}`)
  },
  
  // 获取品牌详情
  get: (id) => {
    return request(`/brand/${id}`)
  },
  
  // 创建品牌
  create: (data) => {
    return request('/brand', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 更新品牌
  update: (id, data) => {
    return request(`/brand/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // 删除品牌
  delete: (id) => {
    return request(`/brand/${id}`, {
      method: 'DELETE'
    })
  },
  
  // 获取品牌诊断
  getDiagnosis: (id) => {
    return request(`/diagnosis/brand/${id}`)
  }
}
