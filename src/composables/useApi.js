/**
 * API Service Module
 * HiAeo GEO 前端 API 调用封装
 * 
 * API Base URL: http://localhost:3000/api/v1
 */

// Mock 模式：设置为 true 以使用模拟数据（后端未运行时）
const USE_MOCK = true

import { ref, readonly } from 'vue'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

// 存储 token
let authToken = localStorage.getItem('auth_token')
let refreshToken = localStorage.getItem('refresh_token')
let currentUser = ref(null)

// ==================== Mock 数据 ====================

function mockDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock 用户数据
const mockUsers = [
  { id: '1', email: 'alice@example.com', nickname: 'Alice Chen', company: 'TechCorp', industry: '互联网', website: 'https://techcorp.com', subscriptionTier: 'enterprise', credits: 15000, isActive: true, createdAt: '2025-01-15T10:30:00Z', lastLoginAt: '2026-05-07T09:00:00Z' },
  { id: '2', email: 'bob@example.com', nickname: 'Bob Wang', company: 'StartupXYZ', industry: '金融', website: 'https://startupxyz.com', subscriptionTier: 'pro', credits: 5500, isActive: true, createdAt: '2025-03-20T14:20:00Z', lastLoginAt: '2026-05-08T11:30:00Z' },
  { id: '3', email: 'carol@example.com', nickname: 'Carol Liu', company: '', industry: '', website: '', subscriptionTier: 'free', credits: 100, isActive: true, createdAt: '2025-06-10T09:15:00Z', lastLoginAt: '2026-04-25T16:45:00Z' },
  { id: '4', email: 'david@example.com', nickname: 'David Zhang', company: 'InnovateLab', industry: '教育', website: 'https://innovatelab.edu', subscriptionTier: 'pro', credits: 3200, isActive: true, createdAt: '2025-08-05T11:00:00Z', lastLoginAt: '2026-05-06T14:20:00Z' },
  { id: '5', email: 'emma@example.com', nickname: 'Emma Sun', company: 'GlobalMedia', industry: '媒体', website: 'https://globalmedia.com', subscriptionTier: 'enterprise', credits: 25000, isActive: true, createdAt: '2024-12-01T08:30:00Z', lastLoginAt: '2026-05-08T08:00:00Z' },
  { id: '6', email: 'frank@example.com', nickname: 'Frank Li', company: '', industry: '', website: '', subscriptionTier: 'free', credits: 50, isActive: false, createdAt: '2025-09-12T15:40:00Z', lastLoginAt: '2025-09-15T10:00:00Z' },
  { id: '7', email: 'grace@example.com', nickname: 'Grace Yang', company: 'DesignStudio', industry: '设计', website: 'https://designstudio.co', subscriptionTier: 'pro', credits: 4800, isActive: true, createdAt: '2025-04-18T13:25:00Z', lastLoginAt: '2026-05-07T17:30:00Z' },
  { id: '8', email: 'henry@example.com', nickname: 'Henry Wu', company: 'EduPlatform', industry: '教育', website: 'https://eduplatform.com', subscriptionTier: 'enterprise', credits: 18000, isActive: true, createdAt: '2025-02-28T10:00:00Z', lastLoginAt: '2026-05-08T10:15:00Z' },
  { id: '9', email: 'ivy@example.com', nickname: 'Ivy Chen', company: '', industry: '', website: '', subscriptionTier: 'free', credits: 200, isActive: true, createdAt: '2026-01-05T09:30:00Z', lastLoginAt: '2026-05-05T12:00:00Z' },
  { id: '10', email: 'jack@example.com', nickname: 'Jack Lin', company: 'ECommercePro', industry: '电商', website: 'https://ecommercepro.io', subscriptionTier: 'pro', credits: 6200, isActive: true, createdAt: '2025-07-22T14:10:00Z', lastLoginAt: '2026-05-08T13:45:00Z' }
]

async function mockLogin(data) {
  await mockDelay()
  console.log('[Mock] 登录请求:', data)
  const mockUser = {
    id: 'mock-user-1',
    email: data.email,
    nickname: data.email.split('@')[0],
    createdAt: new Date().toISOString()
  }
  return {
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    user: mockUser
  }
}

async function mockRegister(data) {
  await mockDelay()
  console.log('[Mock] 注册请求:', data)
  const mockUser = {
    id: 'mock-user-' + Date.now(),
    email: data.email,
    nickname: data.nickname || data.email.split('@')[0],
    phone: data.phone,
    createdAt: new Date().toISOString()
  }
  return {
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    user: mockUser
  }
}

// Mock 管理员 API
async function mockGetAdminUserList(params = {}) {
  await mockDelay()
  console.log('[Mock] 获取用户列表:', params)
  
  let filtered = [...mockUsers]
  
  // 搜索过滤
  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(u => u.email.toLowerCase().includes(search))
  }
  
  // 订阅等级过滤
  if (params.subscriptionTier) {
    filtered = filtered.filter(u => u.subscriptionTier === params.subscriptionTier)
  }
  
  // 状态过滤
  if (params.isActive !== '' && params.isActive !== undefined) {
    filtered = filtered.filter(u => u.isActive === (params.isActive === 'true'))
  }
  
  // 分页
  const page = params.page || 1
  const limit = params.limit || 10
  const start = (page - 1) * limit
  const end = start + limit
  const paginated = filtered.slice(start, end)
  
  return {
    data: paginated,
    total: filtered.length,
    page,
    limit
  }
}

async function mockGetAdminStats() {
  await mockDelay()
  console.log('[Mock] 获取统计数据')
  
  const total = mockUsers.length
  const active = mockUsers.filter(u => u.isActive).length
  const pro = mockUsers.filter(u => u.subscriptionTier === 'pro').length
  const enterprise = mockUsers.filter(u => u.subscriptionTier === 'enterprise').length
  
  return {
    totalUsers: total,
    activeUsers: active,
    freeUsers: total - pro - enterprise,
    proUsers: pro,
    enterpriseUsers: enterprise
  }
}

async function mockGetAdminUserById(id) {
  await mockDelay()
  console.log('[Mock] 获取用户详情:', id)
  const user = mockUsers.find(u => u.id === id)
  if (!user) throw new Error('用户不存在')
  return user
}

async function mockUpdateAdminUser(id, data) {
  await mockDelay()
  console.log('[Mock] 更新用户:', id, data)
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) throw new Error('用户不存在')
  Object.assign(mockUsers[index], data)
  return mockUsers[index]
}

async function mockDeleteAdminUser(id) {
  await mockDelay()
  console.log('[Mock] 删除用户:', id)
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) throw new Error('用户不存在')
  mockUsers.splice(index, 1)
  return { success: true }
}

// ==================== 工具函数 ====================

/**
 * 统一请求封装
 * @param {string} endpoint - API 端点
 * @param {object} options - 请求配置
 * @returns {Promise<object>} 响应数据
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  console.log(`[API] 请求开始: ${endpoint}`, options)
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // 添加认证 token
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时
    
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log(`[API] 收到响应: ${endpoint}, status: ${response.status}`)

    const data = await response.json()
    console.log(`[API] 响应数据: ${endpoint}`, data)

    // 处理响应状态
    if (!response.ok) {
      // Token 过期，尝试刷新
      if (response.status === 401 && refreshToken && !options._retry) {
        options._retry = true
        const refreshed = await tryRefreshToken()
        if (refreshed) {
          // 重新发起请求
          headers['Authorization'] = `Bearer ${authToken}`
          const retryResponse = await fetch(url, {
            ...options,
            headers
          })
          const retryData = await retryResponse.json()
          if (!retryResponse.ok) {
            throw new Error(retryData.message || '请求失败')
          }
          return retryData
        } else {
          // 刷新失败，清除登录状态
          clearAuth()
          throw new Error('登录已过期，请重新登录')
        }
      }
      throw new Error(data.message || '请求失败')
    }

    // 如果返回新 token，保存到本地
    if (data.accessToken) {
      authToken = data.accessToken
      localStorage.setItem('auth_token', data.accessToken)
    }
    if (data.refreshToken) {
      refreshToken = data.refreshToken
      localStorage.setItem('refresh_token', data.refreshToken)
    }

    return data
  } catch (error) {
    console.error(`[API] 请求失败 [${endpoint}]:`, error)
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请检查网络或后端服务是否运行')
    }
    throw error
  }
}

/**
 * 尝试刷新 Token
 */
async function tryRefreshToken() {
  if (!refreshToken) return false
  
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.accessToken) {
        authToken = data.accessToken
        localStorage.setItem('auth_token', data.accessToken)
        if (data.refreshToken) {
          refreshToken = data.refreshToken
          localStorage.setItem('refresh_token', data.refreshToken)
        }
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}

/**
 * 清除认证状态
 */
function clearAuth() {
  authToken = null
  refreshToken = null
  currentUser.value = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
}

// ==================== 认证 API ====================

/**
 * 账号密码登录
 * @param {object} data - { email, password }
 */
export async function loginWithPassword(data) {
  // Mock 模式
  if (USE_MOCK) {
    const result = await mockLogin(data)
    if (result.user) {
      currentUser.value = result.user
      localStorage.setItem('user_info', JSON.stringify(result.user))
    }
    return result
  }
  
  const result = await request('/auth/login', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  })
  
  // 保存用户信息
  if (result.user) {
    currentUser.value = result.user
    localStorage.setItem('user_info', JSON.stringify(result.user))
  }
  
  console.log('[API] 账号密码登录成功:', result)
  return result
}

/**
 * 用户注册
 * @param {object} data - { email, password, nickname }
 */
export async function register(data) {
  // Mock 模式
  if (USE_MOCK) {
    const result = await mockRegister(data)
    if (result.user) {
      currentUser.value = result.user
      localStorage.setItem('user_info', JSON.stringify(result.user))
    }
    return result
  }
  
  const result = await request('/auth/register', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  })
  
  // 保存用户信息
  if (result.user) {
    currentUser.value = result.user
    localStorage.setItem('user_info', JSON.stringify(result.user))
  }
  
  console.log('[API] 用户注册成功:', result)
  return result
}

/**
 * 退出登录
 */
export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    clearAuth()
    console.log('[API] 用户已登出')
  }
}

/**
 * 发送登录短信验证码
 * @param {string} phone - 手机号
 */
export async function sendLoginSmsCode(phone) {
  return request('/auth/sms/send', { 
    method: 'POST', 
    body: JSON.stringify({ phone, type: 'login' }) 
  })
}

/**
 * 发送注册短信验证码
 * @param {string} phone - 手机号
 */
export async function sendRegisterSmsCode(phone) {
  return request('/auth/sms/send', { 
    method: 'POST', 
    body: JSON.stringify({ phone, type: 'register' }) 
  })
}

// ==================== 用户 API ====================

/**
 * 获取用户信息
 */
export async function getUserProfile() {
  const result = await request('/users/profile')
  currentUser.value = result
  localStorage.setItem('user_info', JSON.stringify(result))
  return result
}

/**
 * 更新用户信息
 * @param {object} data - { nickname, avatar, company, industry, website }
 */
export async function updateUserProfile(data) {
  const result = await request('/users/profile', { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  })
  currentUser.value = result
  localStorage.setItem('user_info', JSON.stringify(result))
  return result
}

/**
 * 修改密码
 * @param {object} data - { oldPassword, newPassword }
 */
export async function changePassword(data) {
  const result = await request('/users/password', { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  })
  return result
}

// ==================== 联系表单 API ====================

/**
 * 提交联系表单
 * @param {object} data - { name, company, phone, email, intent, message }
 */
export async function submitContactForm(data) {
  return request('/contact', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  })
}

// ==================== 管理员 API ====================

/**
 * 获取用户列表（管理员）
 * @param {object} params - { page, limit, search, subscriptionTier, isActive }
 */
export async function getAdminUserList(params = {}) {
  // Mock 模式
  if (USE_MOCK) {
    return mockGetAdminUserList(params)
  }
  
  const queryString = new URLSearchParams(params).toString()
  return request(`/users/admin/list${queryString ? '?' + queryString : ''}`)
}

/**
 * 获取用户统计数据（管理员）
 */
export async function getAdminStats() {
  // Mock 模式
  if (USE_MOCK) {
    return mockGetAdminStats()
  }
  
  return request('/users/admin/stats')
}

/**
 * 获取用户详情（管理员）
 * @param {string} id - 用户 ID
 */
export async function getAdminUserById(id) {
  // Mock 模式
  if (USE_MOCK) {
    return mockGetAdminUserById(id)
  }
  
  return request(`/users/admin/${id}`)
}

/**
 * 更新用户信息（管理员）
 * @param {string} id - 用户 ID
 * @param {object} data - 更新数据
 */
export async function updateAdminUser(id, data) {
  // Mock 模式
  if (USE_MOCK) {
    return mockUpdateAdminUser(id, data)
  }
  
  return request(`/users/admin/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  })
}

/**
 * 删除用户（管理员）
 * @param {string} id - 用户 ID
 */
export async function deleteAdminUser(id) {
  // Mock 模式
  if (USE_MOCK) {
    return mockDeleteAdminUser(id)
  }
  
  return request(`/users/admin/${id}`, { method: 'DELETE' })
}

/**
 * 重置用户密码（管理员）
 * @param {string} id - 用户 ID
 * @param {string} newPassword - 新密码
 */
export async function resetAdminUserPassword(id, newPassword) {
  return request(`/users/admin/${id}/reset-password`, { 
    method: 'PUT', 
    body: JSON.stringify({ newPassword }) 
  })
}

// ==================== 认证状态管理 ====================

/**
 * 获取当前 token
 */
export function getToken() {
  return authToken || localStorage.getItem('auth_token')
}

/**
 * 检查是否已登录
 */
export function isAuthenticated() {
  return !!getToken()
}

// ==================== 导出 composable ====================

/**
 * API Composable
 * 在 Vue 组件中使用的便捷封装
 */
export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const apiCall = async (fn, ...args) => {
    loading.value = true
    error.value = null
    try {
      const result = await fn(...args)
      return result
    } catch (err) {
      error.value = err.message || '请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    currentUser: readonly(currentUser),
    apiCall,
    // 认证相关
    loginWithPassword: (data) => apiCall(loginWithPassword, data),
    loginWithSms: (data) => apiCall(loginWithPassword, data), // 短信登录暂用相同接口
    register: (data) => apiCall(register, data),
    sendLoginSmsCode: (phone) => apiCall(sendLoginSmsCode, phone),
    sendRegisterSmsCode: (phone) => apiCall(sendRegisterSmsCode, phone),
    logout,
    isAuthenticated,
    getToken,
    // 用户相关
    getUserProfile: () => apiCall(getUserProfile),
    updateUserProfile: (data) => apiCall(updateUserProfile, data),
    changePassword: (data) => apiCall(changePassword, data),
    // 联系表单
    submitContactForm: (data) => apiCall(submitContactForm, data),
    // 管理员相关
    getAdminUserList: (params) => apiCall(getAdminUserList, params),
    getAdminStats: () => apiCall(getAdminStats),
    getAdminUserById: (id) => apiCall(getAdminUserById, id),
    updateAdminUser: (id, data) => apiCall(updateAdminUser, id, data),
    deleteAdminUser: (id) => apiCall(deleteAdminUser, id),
    resetAdminUserPassword: (id, newPassword) => apiCall(resetAdminUserPassword, id, newPassword)
  }
}

// 导出所有 API 方法
export default {
  loginWithPassword,
  loginWithSms: loginWithPassword, // 短信登录暂用相同接口
  register,
  sendLoginSmsCode,
  sendRegisterSmsCode,
  submitContactForm,
  logout,
  isAuthenticated,
  getToken,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAdminUserList,
  getAdminStats,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  useApi
}

// 初始化：从 localStorage 恢复用户状态
function initAuthState() {
  const savedUser = localStorage.getItem('user_info')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
    } catch (e) {
      console.error('Failed to parse saved user:', e)
    }
  }
}

// 页面加载时初始化
if (typeof window !== 'undefined') {
  initAuthState()
}
