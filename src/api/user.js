import request from './request'

export const userApi = {
  // 用户注册
  register: (data) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 用户登录
  login: (data) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 退出登录
  logout: () => {
    return request('/auth/logout', {
      method: 'POST'
    })
  },
  
  // 获取用户信息
  getProfile: () => {
    return request('/user/profile')
  },
  
  // 更新用户信息
  updateProfile: (data) => {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // 修改密码
  changePassword: (data) => {
    return request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // 获取用户列表 (管理员)
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/user${query ? '?' + query : ''}`)
  },
  
  // 删除用户 (管理员)
  delete: (id) => {
    return request(`/user/${id}`, {
      method: 'DELETE'
    })
  }
}

export const hubApi = {
  // 获取统计数据
  getStats: () => {
    return request('/hub/stats')
  },
  
  // 获取老板视图
  getBossView: () => {
    return request('/hub/boss-view')
  },
  
  // 获取运营视图
  getOpsView: () => {
    return request('/hub/ops-view')
  },
  
  // 获取技术视图
  getTechView: () => {
    return request('/hub/tech-view')
  },
  
  // 获取品牌排名
  getBrandRanking: () => {
    return request('/hub/brand-ranking')
  },
  
  // 获取可见度趋势
  getVisibilityTrend: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/hub/visibility-trend${query ? '?' + query : ''}`)
  },
  
  // 获取待处理任务
  getPendingTasks: () => {
    return request('/hub/pending-tasks')
  },
  
  // 获取运营建议
  getSuggestions: () => {
    return request('/hub/suggestions')
  }
}
