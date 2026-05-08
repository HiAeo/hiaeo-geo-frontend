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

// AI 引擎配置
const mockAIEngines = [
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', logo: '🔮', status: 'available', models: ['deepseek-chat', 'deepseek-coder'] },
  { id: 'doubao', name: '豆包', provider: '字节跳动', logo: '🫛', status: 'available', models: ['doubao-pro-32k', 'doubao-lite-32k'] },
  { id: 'wenxin', name: '文心一言', provider: '百度', logo: '🟠', status: 'available', models: ['ernie-4.0-8k', 'ernie-3.5-8k'] },
  { id: 'kimi', name: 'Kimi', provider: '月之暗面', logo: '🌙', status: 'available', models: ['moonshot-v1-128k', 'moonshot-v1-32k'] },
  { id: 'qwen', name: '通义千问', provider: '阿里云', logo: '🐎', status: 'available', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'] },
  { id: 'zhipu', name: '智谱清言', provider: '智谱AI', logo: '💎', status: 'available', models: ['glm-4', 'glm-4-flash', 'glm-3-turbo'] },
]

// Mock AI 诊断结果
function mockDiagnoseResult(engineId, brandData) {
  const engine = mockAIEngines.find(e => e.id === engineId) || mockAIEngines[0]
  return {
    engineId: engine.id,
    engineName: engine.name,
    engineLogo: engine.logo,
    timestamp: new Date().toISOString(),
    overallScore: Math.floor(Math.random() * 20) + 70,
    dimensions: [
      { name: '品牌定位', score: Math.floor(Math.random() * 30) + 60, findings: ['品牌定位清晰，核心价值主张明确', '建议强化差异化竞争优势'] },
      { name: '视觉识别', score: Math.floor(Math.random() * 30) + 65, findings: ['视觉系统一致性良好', '可考虑优化移动端适配'] },
      { name: '传播策略', score: Math.floor(Math.random() * 30) + 55, findings: ['传播渠道覆盖较全面', '内容策略有提升空间'] },
      { name: '用户互动', score: Math.floor(Math.random() * 30) + 60, findings: ['用户反馈机制健全', '建议加强社区运营'] },
      { name: '品牌声誉', score: Math.floor(Math.random() * 30) + 70, findings: ['网络口碑良好', '可进一步建设品牌故事'] },
    ],
    recommendations: [
      '建议优化品牌核心信息的传达方式',
      '加强社交媒体内容矩阵建设',
      '建立品牌健康度监测体系',
      '考虑与行业KOL进行合作推广',
    ],
    contentSuggestions: [
      { type: 'slogan', content: '品牌口号建议：精准传递核心价值' },
      { type: 'tagline', content: '品牌故事开篇建议：引发情感共鸣' },
    ],
    summary: `${brandData.name}品牌诊断完成，综合得分${Math.floor(Math.random() * 20) + 70}分，在品牌定位和视觉识别方面表现良好，建议重点优化传播策略和用户互动环节。`
  }
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

// ==================== 订阅 API ====================

// Mock 套餐数据
const mockPlans = [
  {
    id: 'free',
    name: '免费版',
    price: 0,
    originalPrice: 0,
    period: '永久',
    features: ['1次基础诊断', '1个AI引擎', '10条轻量问题', '基础看板', '社区支持'],
    limits: { diagnosisEngines: 1, diagnosisQuestions: 10, strategyTypes: 1, contentPerMonth: 0, competitors: 0, hubViews: ['basic'], apiAccess: false, dedicatedSupport: false, dataIsolation: false },
  },
  {
    id: 'basic',
    name: '基础版',
    price: 999,
    originalPrice: 1299,
    period: '月付',
    features: ['全引擎诊断', '100+条问题', '基础策略生成', '完整看板', '邮件支持'],
    limits: { diagnosisEngines: 6, diagnosisQuestions: 100, strategyTypes: 3, contentPerMonth: 10, competitors: 1, hubViews: ['basic', 'operator'], apiAccess: false, dedicatedSupport: false, dataIsolation: false },
  },
  {
    id: 'pro',
    name: '专业版',
    price: 2999,
    originalPrice: 3999,
    period: '月付',
    features: ['全引擎深度诊断', '全部策略类型', '100篇/月内容生成', '3个竞品监控', '全角色视图', '优先邮件支持'],
    limits: { diagnosisEngines: 6, diagnosisQuestions: 200, strategyTypes: 5, contentPerMonth: 100, competitors: 3, hubViews: ['basic', 'operator', 'boss'], apiAccess: false, dedicatedSupport: false, dataIsolation: false },
    recommended: true,
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 9999,
    originalPrice: 12999,
    period: '月起',
    features: ['无限诊断', '无限内容生成', '无限竞品监控', '私有化部署', 'API对接', '专属客户成功经理', '数据隔离', '7x12小时支持'],
    limits: { diagnosisEngines: -1, diagnosisQuestions: -1, strategyTypes: -1, contentPerMonth: -1, competitors: -1, hubViews: ['basic', 'operator', 'boss', 'tech'], apiAccess: true, dedicatedSupport: true, dataIsolation: true },
  },
]

/**
 * 获取所有可用套餐
 */
export async function getPlans() {
  if (USE_MOCK) {
    await mockDelay()
    return mockPlans
  }
  return request('/subscription/plans')
}

/**
 * 获取单个套餐详情
 */
export async function getPlanById(planId) {
  if (USE_MOCK) {
    await mockDelay()
    return mockPlans.find(p => p.id === planId) || null
  }
  return request(`/subscription/plans/${planId}`)
}

/**
 * 获取当前订阅状态
 */
export async function getCurrentSubscription() {
  if (USE_MOCK) {
    await mockDelay()
    // 模拟返回免费版
    return {
      id: null,
      planId: 'free',
      planName: '免费版',
      status: 'free',
      startDate: null,
      endDate: null,
      features: mockPlans[0].features,
      limits: mockPlans[0].limits,
    }
  }
  return request('/subscription/current')
}

/**
 * 创建订阅
 */
export async function createSubscription(data) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: 'sub_' + Date.now(),
      planId: data.planType,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      price: mockPlans.find(p => p.id === data.planType)?.price || 0,
      orderId: 'order_' + Date.now(),
    }
  }
  return request('/subscription/create', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * 取消订阅
 */
export async function cancelSubscription(subscriptionId) {
  if (USE_MOCK) {
    await mockDelay()
    return { message: '订阅已取消', effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
  }
  return request(`/subscription/cancel/${subscriptionId}`, {
    method: 'PUT',
  })
}

/**
 * 升级订阅
 */
export async function upgradeSubscription(newPackageId) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: 'sub_' + Date.now(),
      planId: newPackageId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      creditsEarned: Math.floor(Math.random() * 100),
      message: '升级成功！',
    }
  }
  return request('/subscription/upgrade', {
    method: 'PUT',
    body: JSON.stringify({ newPackageId }),
  })
}

/**
 * 续费订阅
 */
export async function renewSubscription(data) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: 'sub_' + Date.now(),
      planId: data?.planType || 'pro',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      creditsEarned: Math.floor(Math.random() * 100),
      message: '续费成功！',
    }
  }
  return request('/subscription/renew', {
    method: 'PUT',
  })
}

/**
 * 获取订阅历史
 */
export async function getSubscriptionHistory() {
  if (USE_MOCK) {
    await mockDelay()
    return [
      {
        id: 'sub_1',
        planId: 'pro',
        planName: '专业版',
        status: 'active',
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        diagnosisUsed: 5,
        diagnosisLimit: 200,
      },
      {
        id: 'sub_2',
        planId: 'basic',
        planName: '基础版',
        status: 'cancelled',
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        diagnosisUsed: 30,
        diagnosisLimit: 100,
      },
    ]
  }
  return request('/subscription/history')
}

/**
 * 设置自动续费
 */
export async function setAutoRenew(subscriptionId, autoRenew) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, autoRenew }
  }
  return request(`/subscription/${subscriptionId}/auto-renew`, {
    method: 'PUT',
    body: JSON.stringify({ autoRenew }),
  })
}

// ==================== 积分 API ====================

/**
 * 获取积分余额
 */
export async function getCreditsBalance() {
  if (USE_MOCK) {
    await mockDelay()
    return { balance: Math.floor(Math.random() * 10000) }
  }
  return request('/credits/balance')
}

/**
 * 获取积分详情
 */
export async function getCreditsInfo() {
  if (USE_MOCK) {
    await mockDelay()
    return {
      balance: Math.floor(Math.random() * 10000),
      totalEarned: Math.floor(Math.random() * 50000),
      totalConsumed: Math.floor(Math.random() * 40000),
    }
  }
  return request('/credits/info')
}

/**
 * 获取积分交易记录
 */
export async function getCreditsTransactions(params = {}) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      transactions: [
        { id: '1', type: 'earn', amount: 100, description: '订阅专业版赠送', createdAt: new Date().toISOString() },
        { id: '2', type: 'consume', amount: 50, description: '品牌诊断消耗', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      ],
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    }
  }
  const queryString = new URLSearchParams(params).toString()
  return request(`/credits/transactions${queryString ? '?' + queryString : ''}`)
}

// ==================== 订单 API ====================

/**
 * 创建订单
 */
export async function createOrder(data) {
  if (USE_MOCK) {
    await mockDelay()
    const planPrices = { free: 0, basic: 999, pro: 2999, enterprise: 9999 }
    const planNames = { free: '免费版', basic: '基础版', pro: '专业版', enterprise: '企业版' }
    const amount = (planPrices[data.planType] || 0) * (data.duration || 1)
    return {
      id: 'ORD' + Date.now(),
      planType: data.planType,
      planName: planNames[data.planType] || data.planType,
      duration: data.duration || 1,
      amount: amount,
      originalAmount: amount,
      discount: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }
  return request('/order/create', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * 获取订单列表
 */
export async function getOrderList(params = {}) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      orders: [],
      total: 0,
      page: 1,
      limit: 10,
    }
  }
  const queryString = new URLSearchParams(params).toString()
  return request(`/order/list${queryString ? '?' + queryString : ''}`)
}

/**
 * 获取订单详情
 */
export async function getOrderDetail(orderId) {
  if (USE_MOCK) {
    await mockDelay()
    return null
  }
  return request(`/order/${orderId}`)
}

/**
 * 支付订单
 */
export async function payOrder(orderId, paymentMethod) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: orderId,
      status: 'paid',
      paidAt: new Date().toISOString(),
      transactionId: 'TXN' + Date.now(),
    }
  }
  return request('/order/pay', {
    method: 'POST',
    body: JSON.stringify({ orderId, paymentMethod }),
  })
}

/**
 * 取消订单
 */
export async function cancelOrder(orderId, reason) {
  if (USE_MOCK) {
    await mockDelay()
    return { message: '订单已取消' }
  }
  return request('/order/cancel', {
    method: 'PUT',
    body: JSON.stringify({ orderId, reason }),
  })
}

/**
 * 获取订单统计
 */
export async function getOrderStats() {
  if (USE_MOCK) {
    await mockDelay()
    return {
      totalOrders: 0,
      totalSpent: 0,
      paidOrders: 0,
      pendingOrders: 0,
    }
  }
  return request('/order/stats/summary')
}

/**
 * 验证优惠券
 */
export async function validateCoupon(code, orderAmount, packageId) {
  if (USE_MOCK) {
    await mockDelay()
    const coupons = {
      'WELCOME10': { valid: true, discount: 10, message: '新用户立减10%' },
      'YEAR20': { valid: true, discount: 20, message: '年付立减20%' },
      'HIAEO50': { valid: true, discount: 50, message: '限时优惠50元' },
    }
    const result = coupons[code.toUpperCase()]
    if (result) {
      return {
        ...result,
        discount: result.discount,
        discountAmount: Math.round(orderAmount * result.discount / 100),
      }
    }
    return { valid: false, message: '优惠券不存在' }
  }
  return request('/orders/coupon/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderAmount, packageId }),
  })
}

/**
 * 获取我的优惠券
 */
export async function getMyCoupons() {
  if (USE_MOCK) {
    await mockDelay()
    return [
      { id: '1', code: 'WELCOME10', name: '新用户券', value: 10, type: 'percentage', endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  }
  return request('/orders/coupons')
}

/**
 * 申请退款
 */
export async function refundOrder(orderId, reason) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      refundNo: 'REFUND' + Date.now(),
      refundAmount: 2999,
      status: 'pending',
      message: '退款申请已提交',
    }
  }
  return request(`/orders/${orderId}/refund`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  })
}

/**
 * 获取退款记录
 */
export async function getRefundList() {
  if (USE_MOCK) {
    await mockDelay()
    return []
  }
  return request('/orders/refunds')
}

/**
 * 发起支付
 */
export async function initiatePayment(orderId, paymentMethod) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      payment: {
        id: 'pay_' + Date.now(),
        paymentNo: 'PAY' + Date.now(),
        status: 'pending',
      },
      success: true,
      paymentUrl: paymentMethod === 'alipay' 
        ? `https://openapi.alipay.com/gateway.do?mock=true`
        : `weixin://wxpay/bizpayurl?mock=true`,
      tradeNo: 'MOCK' + Date.now(),
    }
  }
  return request(`/orders/${orderId}/pay`, {
    method: 'POST',
    body: JSON.stringify({ paymentMethod }),
  })
}

/**
 * 查询支付状态
 */
export async function queryPaymentStatus(orderId, paymentMethod) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, tradeStatus: 'NOTPAY' }
  }
  return request(`/orders/${orderId}/pay/query?paymentMethod=${paymentMethod}`, {
    method: 'POST',
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

// ==================== AI 引擎 API ====================

/**
 * 获取可用 AI 引擎列表
 */
export async function getAIEngines() {
  if (USE_MOCK) {
    await mockDelay()
    return mockAIEngines
  }
  return request('/ai/engines')
}

/**
 * 获取 AI 引擎健康状态
 */
export async function getAIEngineHealth() {
  if (USE_MOCK) {
    await mockDelay()
    return mockAIEngines.map(e => ({
      engineId: e.id,
      engineName: e.name,
      status: Math.random() > 0.1 ? 'healthy' : 'unhealthy',
      responseTime: Math.floor(Math.random() * 500) + 100,
    }))
  }
  return request('/ai/engines/health')
}

/**
 * 使用指定 AI 引擎进行品牌诊断
 * @param {string} engineId - 引擎 ID (deepseek, doubao, wenxin, kimi, qwen, zhipu)
 * @param {object} brandData - 品牌数据
 */
export async function diagnoseWithAI(engineId, brandData) {
  if (USE_MOCK) {
    await mockDelay(2000) // 模拟更长的 API 调用时间
    return mockDiagnoseResult(engineId, brandData)
  }
  return request(`/ai/diagnose?engine=${engineId}`, {
    method: 'POST',
    body: JSON.stringify(brandData),
  })
}

/**
 * 多引擎批量品牌诊断
 * @param {string[]} engineIds - 引擎 ID 数组
 * @param {object} brandData - 品牌数据
 */
export async function diagnoseWithMultipleAI(engineIds, brandData) {
  if (USE_MOCK) {
    await mockDelay(3000)
    return engineIds.map(engineId => mockDiagnoseResult(engineId, brandData))
  }
  return request('/ai/diagnose/batch', {
    method: 'POST',
    body: JSON.stringify({ engines: engineIds, brandData }),
  })
}

/**
 * 使用 AI 生成品牌内容
 * @param {object} params - { engineId, contentType, brandData, context }
 */
export async function generateAIContent(params) {
  if (USE_MOCK) {
    await mockDelay(1500)
    const templates = {
      slogan: [
        '连接世界，赋能品牌',
        '创新驱动，价值引领',
        '科技赋能，商业增长',
      ],
      tagline: [
        '让品牌更有温度',
        '专注品牌数字化转型',
        '打造您的专属品牌力',
      ],
      bio: [
        '我们是一家专注于品牌策略的数字营销公司，致力于帮助企业建立强大的品牌形象。',
        '以创新为核心，以数据为驱动，为品牌提供全方位的数字化解决方案。',
      ],
      description: [
        '提供专业的品牌诊断、策略规划、内容创作等一站式服务。',
        '帮助企业洞察市场趋势，优化品牌定位，提升品牌影响力。',
      ],
    }
    const contentList = templates[params.contentType] || templates.slogan
    return {
      content: contentList[Math.floor(Math.random() * contentList.length)],
      engineId: params.engineId || 'deepseek',
      timestamp: new Date().toISOString(),
    }
  }
  return request('/ai/content/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

/**
 * AI 聊天对话
 * @param {string} engineId - 引擎 ID
 * @param {string} message - 用户消息
 * @param {object} context - 上下文（可选）
 */
export async function chatWithAI(engineId, message, context = {}) {
  if (USE_MOCK) {
    await mockDelay(1000)
    const responses = [
      '您好！关于品牌建设，我建议从明确定位开始。',
      '根据您的需求，推荐关注用户洞察和内容策略。',
      '品牌诊断是一个持续优化的过程，建议定期进行。',
      '好的，我会为您提供专业的品牌分析建议。',
    ]
    return {
      engineId: engineId || 'deepseek',
      reply: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
    }
  }
  return request('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ engineId, message, context }),
  })
}

// ==================== 内容管理 API ====================

/**
 * 获取内容列表
 */
export async function getContents(params = {}) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      contents: [
        { id: '1', title: '品牌问答指南', type: 'article', status: 'published', createdAt: new Date().toISOString() },
        { id: '2', title: '小红书种草文案', type: 'social_post', status: 'draft', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', title: '产品描述优化', type: 'product_description', status: 'draft', createdAt: new Date(Date.now() - 3600000).toISOString() },
      ],
      total: 3,
    }
  }
  const queryString = new URLSearchParams(params).toString()
  return request(`/contents${queryString ? '?' + queryString : ''}`)
}

/**
 * 获取内容详情
 */
export async function getContentById(contentId) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: contentId,
      title: '品牌问答指南',
      type: 'article',
      content: '# 品牌问答指南\n\n这是一篇关于品牌问答的内容...',
      status: 'draft',
      createdAt: new Date().toISOString(),
    }
  }
  return request(`/contents/${contentId}`)
}

/**
 * 创建内容
 */
export async function createContent(data) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: 'content_' + Date.now(),
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }
  }
  return request('/contents', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * 更新内容
 */
export async function updateContent(contentId, data) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, ...data }
  }
  return request(`/contents/${contentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * 删除内容
 */
export async function deleteContent(contentId) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true }
  }
  return request(`/contents/${contentId}`, { method: 'DELETE' })
}

/**
 * 复制内容到剪贴板
 */
export async function copyContent(contentId) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, copied: true }
  }
  return request(`/contents/${contentId}/copy`, { method: 'POST' })
}

/**
 * 导出内容
 */
export async function exportContent(contentId, format) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      url: `https://example.com/export/${contentId}.${format}`,
      success: true,
    }
  }
  return request(`/contents/${contentId}/export?format=${format}`)
}

/**
 * 生成内容
 */
export async function generateContent(params) {
  if (USE_MOCK) {
    await mockDelay(2000)
    return {
      content: {
        title: '生成的标题',
        body: '# 生成的内容\n\n这是AI生成的内容...',
        type: params.type || 'article',
      },
      success: true,
    }
  }
  return request('/contents/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

/**
 * 审核内容
 */
export async function reviewContent(contentId, approved, feedback) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      success: true,
      status: approved ? 'approved' : 'rejected',
      feedback,
    }
  }
  return request(`/contents/${contentId}/review`, {
    method: 'PUT',
    body: JSON.stringify({ approved, feedback }),
  })
}

// ==================== 语义库 API ====================

/**
 * 获取语义实体类型
 */
export async function getSemanticEntityTypes() {
  if (USE_MOCK) {
    await mockDelay()
    return {
      types: [
        { id: 'brand', name: '品牌实体', description: '品牌名、创始人名、产品名' },
        { id: 'industry', name: '行业术语', description: '行业标准名词、技术词汇' },
        { id: 'scenario', name: '用户场景', description: '使用场景、问题类型、需求类型' },
        { id: 'competitor', name: '竞品关系', description: '竞品名称、可对比维度' },
        { id: 'sentiment', name: '情感词汇', description: '正向词、负向词、中性词' },
        { id: 'cta', name: '行动引导', description: 'CTA词汇、链接标识符' },
      ],
    }
  }
  return request('/semantic/entity-types')
}

/**
 * 获取语义实体列表
 */
export async function getSemanticEntities(type) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      entities: [
        { id: '1', type: 'brand', value: '魔鲸GEO', category: 'brand' },
        { id: '2', type: 'brand', value: 'MirusAI', category: 'brand' },
        { id: '3', type: 'industry', value: 'GEO优化', category: 'industry' },
      ],
      total: 3,
    }
  }
  return request(`/semantic/entities?type=${type}`)
}

/**
 * 创建语义实体
 */
export async function createSemanticEntity(data) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: 'entity_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    }
  }
  return request('/semantic/entities', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * 更新语义实体
 */
export async function updateSemanticEntity(entityId, data) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, ...data }
  }
  return request(`/semantic/entities/${entityId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * 删除语义实体
 */
export async function deleteSemanticEntity(entityId) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true }
  }
  return request(`/semantic/entities/${entityId}`, { method: 'DELETE' })
}

/**
 * 获取内容模板列表
 */
export async function getContentTemplates(engine) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      templates: [
        { id: '1', name: 'DeepSeek风格', engine: 'deepseek', content: '结构化、逻辑清晰、引用数据' },
        { id: '2', name: '豆包风格', engine: 'doubao', content: '口语化、轻松有趣、适合社交传播' },
        { id: '3', name: '文心一言风格', engine: 'wenxin', content: '专业严谨、官方正式' },
        { id: '4', name: 'Kimi风格', engine: 'kimi', content: '详细全面、长文本友好' },
      ],
    }
  }
  return request(`/semantic/templates?engine=${engine || ''}`)
}

/**
 * 创建内容模板
 */
export async function createContentTemplate(data) {
  if (USE_MOCK) {
    await mockDelay()
    return { id: 'template_' + Date.now(), ...data, createdAt: new Date().toISOString() }
  }
  return request('/semantic/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * 更新内容模板
 */
export async function updateContentTemplate(templateId, data) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, ...data }
  }
  return request(`/semantic/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * 删除内容模板
 */
export async function deleteContentTemplate(templateId) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true }
  }
  return request(`/semantic/templates/${templateId}`, { method: 'DELETE' })
}

/**
 * 风格适配转换
 */
export async function adaptStyle(content, targetEngine) {
  if (USE_MOCK) {
    await mockDelay(1500)
    return {
      originalContent: content,
      adaptedContent: `[${targetEngine}风格] ${content}`,
      targetEngine,
    }
  }
  return request('/semantic/adapt-style', {
    method: 'POST',
    body: JSON.stringify({ content, targetEngine }),
  })
}

// ==================== 发布管理 API ====================

/**
 * 复制内容到剪贴板
 */
export async function copyToClipboard(text) {
  if (USE_MOCK) {
    await mockDelay(100)
    return { success: true, copied: true }
  }
  return request('/publish/copy', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

/**
 * 导出内容为文件
 */
export async function exportAsFile(contentId, format) {
  if (USE_MOCK) {
    await mockDelay(500)
    return {
      success: true,
      downloadUrl: `/api/v1/publish/export/${contentId}.${format}`,
    }
  }
  return request(`/publish/export/${contentId}?format=${format}`)
}

/**
 * 推送到CMS系统
 */
export async function pushToCMS(contentId, cmsConfig) {
  if (USE_MOCK) {
    await mockDelay(2000)
    return {
      success: true,
      message: '内容已推送到CMS系统',
      cmsUrl: cmsConfig.url,
    }
  }
  return request('/publish/cms', {
    method: 'POST',
    body: JSON.stringify({ contentId, cmsConfig }),
  })
}

/**
 * 触发Webhook
 */
export async function triggerWebhook(contentId, webhookUrl) {
  if (USE_MOCK) {
    await mockDelay(1000)
    return {
      success: true,
      message: 'Webhook已触发',
      webhookUrl,
    }
  }
  return request('/publish/webhook', {
    method: 'POST',
    body: JSON.stringify({ contentId, webhookUrl }),
  })
}

/**
 * 获取发布指引
 */
export async function getPublishGuide(contentId, platform) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      contentId,
      platform,
      steps: [
        { step: 1, title: '登录平台', description: '访问目标平台后台' },
        { step: 2, title: '创建内容', description: '按照指引创建内容' },
        { step: 3, title: '发布内容', description: '审核后发布' },
      ],
      tips: ['建议在工作日发布', '注意内容格式适配'],
    }
  }
  return request(`/publish/guide/${contentId}?platform=${platform}`)
}

/**
 * 保存CMS配置
 */
export async function saveCMSConfig(config) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, configId: 'cms_' + Date.now() }
  }
  return request('/publish/cms/config', {
    method: 'POST',
    body: JSON.stringify(config),
  })
}

/**
 * 获取CMS配置列表
 */
export async function getCMSConfigs() {
  if (USE_MOCK) {
    await mockDelay()
    return {
      configs: [
        { id: 'cms_1', name: 'WordPress', url: 'https://example.com/xmlrpc.php', status: 'active' },
        { id: 'cms_2', name: 'Typecho', url: 'https://blog.example.com/xmlrpc.php', status: 'active' },
      ],
    }
  }
  return request('/publish/cms/configs')
}

/**
 * 删除CMS配置
 */
export async function deleteCMSConfig(configId) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true }
  }
  return request(`/publish/cms/config/${configId}`, { method: 'DELETE' })
}

// ==================== 策略管理 API ====================

/**
 * 获取策略任务列表
 */
export async function getStrategyTasks(params = {}) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      tasks: [
        { id: '1', name: '品牌问答策略', type: 'faq', status: 'completed', createdAt: new Date().toISOString() },
        { id: '2', name: '产品描述策略', type: 'product', status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', name: '行业观点策略', type: 'opinion', status: 'running', createdAt: new Date(Date.now() - 3600000).toISOString() },
      ],
      total: 3,
    }
  }
  const queryString = new URLSearchParams(params).toString()
  return request(`/strategy/tasks${queryString ? '?' + queryString : ''}`)
}

/**
 * 创建策略任务
 */
export async function createStrategyTask(data) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: 'task_' + Date.now(),
      name: data.name,
      type: data.type,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }
  return request('/strategy/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * 获取策略任务详情
 */
export async function getStrategyTaskById(taskId) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      id: taskId,
      name: '品牌问答策略',
      type: 'faq',
      status: 'completed',
      contents: [
        { id: 'c1', title: 'Q1: 你们的服务有什么优势？', content: '我们提供专业的GEO优化服务...', status: 'draft' },
        { id: 'c2', title: 'Q2: 如何收费？', content: '我们提供灵活的定价方案...', status: 'draft' },
      ],
      createdAt: new Date().toISOString(),
    }
  }
  return request(`/strategy/tasks/${taskId}`)
}

/**
 * 生成策略内容
 */
export async function generateStrategyContent(taskId, params) {
  if (USE_MOCK) {
    await mockDelay(2000)
    return {
      contents: [
        { id: 'c_' + Date.now(), title: '生成的问答标题', content: '生成的内容...', type: params.type || 'faq' },
      ],
      message: '内容生成成功',
    }
  }
  return request(`/strategy/tasks/${taskId}/generate`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

/**
 * 获取生成的内容列表
 */
export async function getGeneratedContents(taskId) {
  if (USE_MOCK) {
    await mockDelay()
    return {
      contents: [
        { id: '1', title: 'Q1', content: '内容1', type: 'faq', status: 'draft' },
        { id: '2', title: 'Q2', content: '内容2', type: 'faq', status: 'draft' },
      ],
    }
  }
  return request(`/strategy/contents?taskId=${taskId}`)
}

/**
 * 审核内容
 */
export async function approveContent(contentId, approved) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true, status: approved ? 'approved' : 'rejected' }
  }
  return request(`/strategy/contents/${contentId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ approved }),
  })
}

/**
 * 删除策略任务
 */
export async function deleteStrategyTask(taskId) {
  if (USE_MOCK) {
    await mockDelay()
    return { success: true }
  }
  return request(`/strategy/tasks/${taskId}`, { method: 'DELETE' })
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
    // 订阅相关
    getPlans: () => apiCall(getPlans),
    getPlanById: (id) => apiCall(getPlanById, id),
    getCurrentSubscription: () => apiCall(getCurrentSubscription),
    createSubscription: (data) => apiCall(createSubscription, data),
    cancelSubscription: (id) => apiCall(cancelSubscription, id),
    upgradeSubscription: (newPackageId) => apiCall(upgradeSubscription, newPackageId),
    renewSubscription: (data) => apiCall(renewSubscription, data),
    getSubscriptionHistory: () => apiCall(getSubscriptionHistory),
    setAutoRenew: (subscriptionId, autoRenew) => apiCall(setAutoRenew, subscriptionId, autoRenew),
    // 积分相关
    getCreditsBalance: () => apiCall(getCreditsBalance),
    getCreditsInfo: () => apiCall(getCreditsInfo),
    getCreditsTransactions: (params) => apiCall(getCreditsTransactions, params),
    // 订单相关
    createOrder: (data) => apiCall(createOrder, data),
    getOrderList: (params) => apiCall(getOrderList, params),
    getOrderDetail: (id) => apiCall(getOrderDetail, id),
    payOrder: (orderId, paymentMethod) => apiCall(payOrder, orderId, paymentMethod),
    cancelOrder: (orderId, reason) => apiCall(cancelOrder, orderId, reason),
    getOrderStats: () => apiCall(getOrderStats),
    validateCoupon: (code, orderAmount, packageId) => apiCall(validateCoupon, code, orderAmount, packageId),
    getMyCoupons: () => apiCall(getMyCoupons),
    refundOrder: (orderId, reason) => apiCall(refundOrder, orderId, reason),
    getRefundList: () => apiCall(getRefundList),
    initiatePayment: (orderId, paymentMethod) => apiCall(initiatePayment, orderId, paymentMethod),
    queryPaymentStatus: (orderId, paymentMethod) => apiCall(queryPaymentStatus, orderId, paymentMethod),
    // 管理员相关
    getAdminUserList: (params) => apiCall(getAdminUserList, params),
    getAdminStats: () => apiCall(getAdminStats),
    getAdminUserById: (id) => apiCall(getAdminUserById, id),
    updateAdminUser: (id, data) => apiCall(updateAdminUser, id, data),
    deleteAdminUser: (id) => apiCall(deleteAdminUser, id),
    resetAdminUserPassword: (id, newPassword) => apiCall(resetAdminUserPassword, id, newPassword),
    // AI 引擎相关
    getAIEngines: () => apiCall(getAIEngines),
    getAIEngineHealth: () => apiCall(getAIEngineHealth),
    diagnoseWithAI: (engineId, brandData) => apiCall(diagnoseWithAI, engineId, brandData),
    diagnoseWithMultipleAI: (engineIds, brandData) => apiCall(diagnoseWithMultipleAI, engineIds, brandData),
    generateAIContent: (params) => apiCall(generateAIContent, params),
    chatWithAI: (engineId, message, context) => apiCall(chatWithAI, engineId, message, context),
    // 策略相关
    getStrategyTasks: (params) => apiCall(getStrategyTasks, params),
    createStrategyTask: (data) => apiCall(createStrategyTask, data),
    getStrategyTaskById: (id) => apiCall(getStrategyTaskById, id),
    generateStrategyContent: (taskId, params) => apiCall(generateStrategyContent, taskId, params),
    getGeneratedContents: (taskId) => apiCall(getGeneratedContents, taskId),
    approveContent: (contentId, approved) => apiCall(approveContent, contentId, approved),
    deleteStrategyTask: (id) => apiCall(deleteStrategyTask, id),
    // 内容相关
    getContents: (params) => apiCall(getContents, params),
    getContentById: (id) => apiCall(getContentById, id),
    createContent: (data) => apiCall(createContent, data),
    updateContent: (id, data) => apiCall(updateContent, id, data),
    deleteContent: (id) => apiCall(deleteContent, id),
    copyContent: (id) => apiCall(copyContent, id),
    exportContent: (id, format) => apiCall(exportContent, id, format),
    generateContent: (params) => apiCall(generateContent, params),
    reviewContent: (id, approved, feedback) => apiCall(reviewContent, id, approved, feedback),
    // 发布相关
    copyToClipboard: (text) => apiCall(copyToClipboard, text),
    exportAsFile: (id, format) => apiCall(exportAsFile, id, format),
    pushToCMS: (id, config) => apiCall(pushToCMS, id, config),
    triggerWebhook: (id, url) => apiCall(triggerWebhook, id, url),
    getPublishGuide: (id, platform) => apiCall(getPublishGuide, id, platform),
    saveCMSConfig: (config) => apiCall(saveCMSConfig, config),
    getCMSConfigs: () => apiCall(getCMSConfigs),
    deleteCMSConfig: (id) => apiCall(deleteCMSConfig, id),
    // 语义库相关
    getSemanticEntityTypes: () => apiCall(getSemanticEntityTypes),
    getSemanticEntities: (type) => apiCall(getSemanticEntities, type),
    createSemanticEntity: (data) => apiCall(createSemanticEntity, data),
    updateSemanticEntity: (id, data) => apiCall(updateSemanticEntity, id, data),
    deleteSemanticEntity: (id) => apiCall(deleteSemanticEntity, id),
    getContentTemplates: (engine) => apiCall(getContentTemplates, engine),
    createContentTemplate: (data) => apiCall(createContentTemplate, data),
    updateContentTemplate: (id, data) => apiCall(updateContentTemplate, id, data),
    deleteContentTemplate: (id) => apiCall(deleteContentTemplate, id),
    adaptStyle: (content, engine) => apiCall(adaptStyle, content, engine),
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
  // 订阅相关
  getPlans,
  getPlanById,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
  upgradeSubscription,
  renewSubscription,
  getSubscriptionHistory,
  setAutoRenew,
  // 积分相关
  getCreditsBalance,
  getCreditsInfo,
  getCreditsTransactions,
  // 订单相关
  createOrder,
  getOrderList,
  getOrderDetail,
  payOrder,
  cancelOrder,
  getOrderStats,
  validateCoupon,
  getMyCoupons,
  refundOrder,
  getRefundList,
  initiatePayment,
  queryPaymentStatus,
  // 管理员相关
  getAdminUserList,
  getAdminStats,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  // AI 引擎相关
  getAIEngines,
  getAIEngineHealth,
  diagnoseWithAI,
  diagnoseWithMultipleAI,
  generateAIContent,
  chatWithAI,
  // 策略相关
  getStrategyTasks,
  createStrategyTask,
  getStrategyTaskById,
  generateStrategyContent,
  getGeneratedContents,
  approveContent,
  deleteStrategyTask,
  // 内容相关
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  copyContent,
  exportContent,
  generateContent,
  reviewContent,
  // 发布相关
  copyToClipboard,
  exportAsFile,
  pushToCMS,
  triggerWebhook,
  getPublishGuide,
  saveCMSConfig,
  getCMSConfigs,
  deleteCMSConfig,
  // 语义库相关
  getSemanticEntityTypes,
  getSemanticEntities,
  createSemanticEntity,
  updateSemanticEntity,
  deleteSemanticEntity,
  getContentTemplates,
  createContentTemplate,
  updateContentTemplate,
  deleteContentTemplate,
  adaptStyle,
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
