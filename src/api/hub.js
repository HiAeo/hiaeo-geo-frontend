/**
 * Hub 驾驶舱 API (Phase 4 增强)
 */
import request from './request'

const BASE_URL = '/api/hub'

// ==================== 基础 API ====================

export const getStats = (brandId) => {
  return request(`${BASE_URL}/stats`, {
    method: 'GET',
    params: { brandId },
  })
}

export const getBossView = (brandId) => {
  return request(`${BASE_URL}/boss-view`, {
    method: 'GET',
    params: { brandId },
  })
}

export const getOpsView = (brandId) => {
  return request(`${BASE_URL}/ops-view`, {
    method: 'GET',
    params: { brandId },
  })
}

export const getTechView = (brandId) => {
  return request(`${BASE_URL}/tech-view`, {
    method: 'GET',
    params: { brandId },
  })
}

export const getBrandRanking = () => {
  return request(`${BASE_URL}/brand-ranking`, { method: 'GET' })
}

export const getVisibilityTrend = (period = '30d') => {
  return request(`${BASE_URL}/visibility-trend`, {
    method: 'GET',
    params: { period },
  })
}

export const getPendingTasks = (brandId) => {
  return request(`${BASE_URL}/pending-tasks`, {
    method: 'GET',
    params: { brandId },
  })
}

export const getSuggestions = (brandId) => {
  return request(`${BASE_URL}/suggestions`, {
    method: 'GET',
    params: { brandId },
  })
}

// ==================== Phase 4: 知识库联动 API ====================

/**
 * 获取知识库健康度指标
 */
export const getKnowledgeHealth = () => {
  return request(`${BASE_URL}/knowledge-health`, { method: 'GET' })
}

/**
 * 获取知识库统计概览
 */
export const getKnowledgeStats = () => {
  return request(`${BASE_URL}/knowledge-stats`, { method: 'GET' })
}

/**
 * 获取知识库完整度趋势
 */
export const getKnowledgeTrend = (days = 30) => {
  return request(`${BASE_URL}/knowledge-trend`, {
    method: 'GET',
    params: { days },
  })
}

/**
 * 获取诊断与知识库关联数据
 */
export const getKnowledgeDiagnosisCorrelation = () => {
  return request(`${BASE_URL}/knowledge-diagnosis-correlation`, { method: 'GET' })
}

export default {
  // 基础
  getStats,
  getBossView,
  getOpsView,
  getTechView,
  getBrandRanking,
  getVisibilityTrend,
  getPendingTasks,
  getSuggestions,
  // Phase 4
  getKnowledgeHealth,
  getKnowledgeStats,
  getKnowledgeTrend,
  getKnowledgeDiagnosisCorrelation,
}
