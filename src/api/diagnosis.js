import request from './request'

export const diagnosisApi = {
  // 获取诊断列表
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/diagnosis${query ? '?' + query : ''}`)
  },
  
  // 获取诊断任务详情
  get: (id) => {
    return request(`/diagnosis/${id}`)
  },
  
  // 创建诊断任务
  create: (data) => {
    return request('/diagnosis', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 获取品牌诊断结果
  getBrandDiagnosis: (brandId) => {
    return request(`/diagnosis/brand/${brandId}`)
  },
  
  // 执行诊断
  execute: (id) => {
    return request(`/diagnosis/${id}/execute`, {
      method: 'POST'
    })
  },
  
  // 获取诊断报告
  getReport: (taskId) => {
    return request(`/diagnosis/${taskId}/report`)
  },
  
  // 获取诊断历史
  getHistory: (brandId, page = 1, pageSize = 10) => {
    return request(`/diagnosis/history?brandId=${brandId}&page=${page}&pageSize=${pageSize}`)
  }
}
