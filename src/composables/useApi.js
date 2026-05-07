/**
 * API Service Module
 * HiAeo GEO 前端 API 调用封装
 * 
 * 使用说明：
 * 1. 根据后端实际 API 地址修改 BASE_URL
 * 2. 扩展各个 API 方法以匹配后端接口
 * 3. 当前为模拟模式，实际部署时切换到真实 API
 */

import { ref } from 'vue'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 存储 token
let authToken = localStorage.getItem('auth_token')

// ==================== 工具函数 ====================

/**
 * 统一请求封装
 * @param {string} endpoint - API 端点
 * @param {object} options - 请求配置
 * @returns {Promise<object>} 响应数据
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // 添加认证 token
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    const data = await response.json()

    // 处理响应状态
    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    // 如果返回 token，保存到本地
    if (data.token) {
      authToken = data.token
      localStorage.setItem('auth_token', data.token)
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

/**
 * 模拟延迟（开发环境使用）
 * @param {number} ms - 延迟毫秒数
 */
function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ==================== 认证 API ====================

/**
 * 账号密码登录
 * @param {object} data - { account, password }
 */
export async function loginWithPassword(data) {
  // TODO: 替换为真实 API
  // return request('/auth/login', { method: 'POST', body: JSON.stringify(data) })
  
  // 模拟实现
  await delay(1500)
  const mockResponse = {
    success: true,
    message: '登录成功',
    token: 'mock_token_' + Date.now(),
    user: {
      id: 'user_' + Date.now(),
      phone: data.account,
      email: data.account.includes('@') ? data.account : null,
      avatar: null,
      createdAt: new Date().toISOString()
    }
  }
  
  // 保存 token
  authToken = mockResponse.token
  localStorage.setItem('auth_token', mockResponse.token)
  
  console.log('[API] 账号密码登录:', mockResponse)
  return mockResponse
}

/**
 * 短信验证码登录
 * @param {object} data - { phone, code }
 */
export async function loginWithSms(data) {
  // TODO: 替换为真实 API
  // return request('/auth/sms/login', { method: 'POST', body: JSON.stringify(data) })
  
  // 模拟实现
  await delay(1500)
  const mockResponse = {
    success: true,
    message: '登录成功',
    token: 'mock_sms_token_' + Date.now(),
    user: {
      id: 'user_sms_' + Date.now(),
      phone: data.phone,
      avatar: null,
      createdAt: new Date().toISOString()
    }
  }
  
  authToken = mockResponse.token
  localStorage.setItem('auth_token', mockResponse.token)
  
  console.log('[API] 短信验证码登录:', mockResponse)
  return mockResponse
}

/**
 * 用户注册
 * @param {object} data - { phone, code, password }
 */
export async function register(data) {
  // TODO: 替换为真实 API
  // return request('/auth/register', { method: 'POST', body: JSON.stringify(data) })
  
  // 模拟实现
  await delay(1500)
  const mockResponse = {
    success: true,
    message: '注册成功',
    token: 'mock_register_token_' + Date.now(),
    user: {
      id: 'user_new_' + Date.now(),
      phone: data.phone,
      avatar: null,
      createdAt: new Date().toISOString()
    }
  }
  
  authToken = mockResponse.token
  localStorage.setItem('auth_token', mockResponse.token)
  
  console.log('[API] 用户注册:', mockResponse)
  return mockResponse
}

/**
 * 发送登录短信验证码
 * @param {string} phone - 手机号
 */
export async function sendLoginSmsCode(phone) {
  // TODO: 替换为真实 API
  // return request('/auth/sms/send', { method: 'POST', body: JSON.stringify({ phone, type: 'login' }) })
  
  // 模拟实现
  await delay(1000)
  console.log('[API] 发送登录验证码:', phone)
  return {
    success: true,
    message: '验证码已发送',
    expiresIn: 60
  }
}

/**
 * 发送注册短信验证码
 * @param {string} phone - 手机号
 */
export async function sendRegisterSmsCode(phone) {
  // TODO: 替换为真实 API
  // return request('/auth/sms/send', { method: 'POST', body: JSON.stringify({ phone, type: 'register' }) })
  
  // 模拟实现
  await delay(1000)
  console.log('[API] 发送注册验证码:', phone)
  return {
    success: true,
    message: '验证码已发送',
    expiresIn: 60
  }
}

// ==================== 联系表单 API ====================

/**
 * 提交联系表单
 * @param {object} data - { name, company, phone, email, intent, message }
 */
export async function submitContactForm(data) {
  // TODO: 替换为真实 API
  // return request('/contact', { method: 'POST', body: JSON.stringify(data) })
  
  // 模拟实现
  await delay(1500)
  console.log('[API] 提交联系表单:', data)
  return {
    success: true,
    message: '提交成功，我们将在24小时内与您联系',
    ticketId: 'TKT-' + Date.now()
  }
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

/**
 * 登出
 */
export function logout() {
  authToken = null
  localStorage.removeItem('auth_token')
  console.log('[API] 用户已登出')
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
    apiCall,
    // 认证相关
    loginWithPassword: (data) => apiCall(loginWithPassword, data),
    loginWithSms: (data) => apiCall(loginWithSms, data),
    register: (data) => apiCall(register, data),
    sendLoginSmsCode: (phone) => apiCall(sendLoginSmsCode, phone),
    sendRegisterSmsCode: (phone) => apiCall(sendRegisterSmsCode, phone),
    logout,
    isAuthenticated,
    getToken,
    // 联系表单
    submitContactForm: (data) => apiCall(submitContactForm, data)
  }
}

export default {
  loginWithPassword,
  loginWithSms,
  register,
  sendLoginSmsCode,
  sendRegisterSmsCode,
  submitContactForm,
  logout,
  isAuthenticated,
  getToken,
  useApi
}
