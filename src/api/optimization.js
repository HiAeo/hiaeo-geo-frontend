/**
 * 优化模块 API (Phase 4)
 */
import request from './request'

const BASE_URL = '/api/v1/optimization'

// ==================== 优化建议 API ====================

export const getOptimizationSuggestions = (brandId) => {
  return request(`${BASE_URL}/suggestions`, {
    method: 'GET',
    params: { brandId },
  })
}

export const createOptimizationTask = (data) => {
  return request(`${BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getOptimizationTasks = (brandId, status) => {
  return request(`${BASE_URL}/tasks`, {
    method: 'GET',
    params: { brandId, status },
  })
}

export const executeOptimization = (taskId) => {
  return request(`${BASE_URL}/tasks/${taskId}/execute`, {
    method: 'POST',
  })
}

export const getExecutionHistory = (brandId, page = 1, size = 10) => {
  return request(`${BASE_URL}/executions`, {
    method: 'GET',
    params: { brandId, page, size },
  })
}

// ==================== 竞品追踪 API ====================

export const getCompetitorList = (brandId) => {
  return request(`${BASE_URL}/competitors`, {
    method: 'GET',
    params: { brandId },
  })
}

export const addCompetitor = (brandId, competitorUrl) => {
  return request(`${BASE_URL}/competitors`, {
    method: 'POST',
    body: JSON.stringify({ brandId, competitorUrl }),
  })
}

export const removeCompetitor = (competitorId) => {
  return request(`${BASE_URL}/competitors/${competitorId}`, {
    method: 'DELETE',
  })
}

export const trackCompetitor = (competitorId) => {
  return request(`${BASE_URL}/competitors/${competitorId}/track`, {
    method: 'POST',
  })
}

export const getCompetitorAnalysis = (competitorId) => {
  return request(`${BASE_URL}/competitors/${competitorId}/analysis`, {
    method: 'GET',
  })
}

// ==================== 效果追踪 API ====================

export const getEffectMetrics = (brandId, startDate, endDate) => {
  return request(`${BASE_URL}/effects`, {
    method: 'GET',
    params: { brandId, startDate, endDate },
  })
}

export const getRankingImprovement = (brandId) => {
  return request(`${BASE_URL}/effects/ranking`, {
    method: 'GET',
    params: { brandId },
  })
}

// ==================== 诊断联动 API ====================

export const getOptimizationFromDiagnosis = (diagnosisReportId) => {
  return request(`${BASE_URL}/from-diagnosis/${diagnosisReportId}`, {
    method: 'GET',
  })
}

export const applyRAGDiagnosis = (brandId) => {
  return request(`${BASE_URL}/rag-diagnosis`, {
    method: 'POST',
    body: JSON.stringify({ brandId }),
  })
}

export const getRAGDiagnosisResult = (brandId) => {
  return request(`${BASE_URL}/rag-diagnosis`, {
    method: 'GET',
    params: { brandId },
  })
}

export default {
  // 优化建议
  getOptimizationSuggestions,
  createOptimizationTask,
  getOptimizationTasks,
  executeOptimization,
  getExecutionHistory,
  // 竞品追踪
  getCompetitorList,
  addCompetitor,
  removeCompetitor,
  trackCompetitor,
  getCompetitorAnalysis,
  // 效果追踪
  getEffectMetrics,
  getRankingImprovement,
  // 诊断联动
  getOptimizationFromDiagnosis,
  applyRAGDiagnosis,
  getRAGDiagnosisResult,
}
