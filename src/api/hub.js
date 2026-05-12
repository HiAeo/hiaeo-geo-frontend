/**
 * Hub 驾驶舱 API - 架构重塑 2.0
 * 包含工作流状态聚合、品牌数据中枢
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

// ==================== 知识库联动 API ====================

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

// ==================== 架构重塑 2.0: 工作流状态聚合 API ====================

/**
 * 获取品牌数据中枢（整合所有模块数据）
 */
export const getBrandCommandCenter = (brandId) => {
  return request(`${BASE_URL}/command-center`, {
    method: 'GET',
    params: { brandId },
  })
}

/**
 * 获取工作流状态
 */
export const getWorkflowState = (brandId) => {
  return request(`/api/v1/workflow/state/${brandId}`, { method: 'GET' })
}

/**
 * 更新工作流模块状态
 */
export const updateWorkflowModule = (brandId, module, state) => {
  return request(`/api/v1/workflow/module/${brandId}`, {
    method: 'PUT',
    data: { module, state },
  })
}

/**
 * 触发模块联动（诊断→策略→执行）
 */
export const triggerWorkflowChain = (brandId, startFrom = 'diagnosis') => {
  return request(`${BASE_URL}/workflow-chain`, {
    method: 'POST',
    data: { brandId, startFrom },
  })
}

/**
 * 获取模块健康度评分
 */
export const getModuleHealthScores = (brandId) => {
  return request(`${BASE_URL}/module-health`, {
    method: 'GET',
    params: { brandId },
  })
}

/**
 * 获取品牌 GEO 完整度评分
 */
export const getBrandCompleteness = (brandId) => {
  return request(`${BASE_URL}/brand-completeness`, {
    method: 'GET',
    params: { brandId },
  })
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
  // 知识库
  getKnowledgeHealth,
  getKnowledgeStats,
  getKnowledgeTrend,
  getKnowledgeDiagnosisCorrelation,
  // 架构重塑 2.0
  getBrandCommandCenter,
  getWorkflowState,
  updateWorkflowModule,
  triggerWorkflowChain,
  getModuleHealthScores,
  getBrandCompleteness,
}
