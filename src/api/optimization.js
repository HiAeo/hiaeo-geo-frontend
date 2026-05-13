/**
 * 优化模块 API (Phase 4)
 */
import request from './request'

const BASE_URL = '/v1/optimization'

// ==================== 优化建议 API ====================

export const getOptimizationSuggestions = (brandId) => {
  return request(`${BASE_URL}/brand/${brandId}/suggestions`, {
    method: 'GET',
  })
}

export const createOptimizationTask = (data) => {
  return request(`${BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getOptimizationTasks = (brandId, status) => {
  return request(`${BASE_URL}/brand/${brandId}/suggestions`, {
    method: 'GET',
    params: { status },
  })
}

export const executeOptimization = (taskId) => {
  return request(`${BASE_URL}/suggestion/${taskId}/execute`, {
    method: 'POST',
  })
}

export const getExecutionHistory = (brandId, page = 1, size = 10) => {
  return request(`${BASE_URL}/brand/${brandId}/execution-history`, {
    method: 'GET',
    params: { page, size },
  })
}

// ==================== 竞品追踪 API ====================

export const getCompetitorList = (brandName) => {
  return request(`${BASE_URL}/competitor/${brandName}/history`, {
    method: 'GET',
  })
}

export const addCompetitor = (brandName, competitorUrl) => {
  return request(`${BASE_URL}/competitor/discover`, {
    method: 'POST',
    body: JSON.stringify({ brandName, keywords: [] }),
  })
}

export const removeCompetitor = (competitorId) => {
  return request(`${BASE_URL}/competitor/${competitorId}/track`, {
    method: 'DELETE',
  })
}

export const trackCompetitor = (competitorName, brandName) => {
  return request(`${BASE_URL}/competitor/${competitorName}/track`, {
    method: 'POST',
    body: JSON.stringify({ brandName }),
  })
}

export const getCompetitorAnalysis = (competitorName, brandName) => {
  return request(`${BASE_URL}/competitor/comparison`, {
    method: 'POST',
    body: JSON.stringify({ brandName, competitors: [competitorName] }),
  })
}

// ==================== 效果追踪 API ====================

export const getEffectMetrics = (brandId, startDate, endDate) => {
  return request(`${BASE_URL}/brand/${brandId}/analysis`, {
    method: 'GET',
    params: { startDate, endDate },
  })
}

export const getRankingImprovement = (brandId) => {
  return request(`${BASE_URL}/brand/${brandId}/analysis`, {
    method: 'GET',
  })
}

// ==================== 诊断联动 API ====================

export const getOptimizationFromDiagnosis = (diagnosisReportId, diagnosisData) => {
  return request(`${BASE_URL}/diagnosis/${diagnosisReportId}/generate`, {
    method: 'POST',
    body: JSON.stringify({ brandId: '', diagnosisData }),
  })
}

export const applyRAGDiagnosis = (brandId) => {
  return request(`${BASE_URL}/diagnosis/rag-enhanced`, {
    method: 'POST',
    body: JSON.stringify({ brandId, brandName: '' }),
  })
}

export const getRAGDiagnosisResult = (brandId) => {
  return request(`${BASE_URL}/diagnosis/${brandId}/rag-context`, {
    method: 'GET',
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
