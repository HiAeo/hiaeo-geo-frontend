/**
 * 策略 API (Phase 4 增强)
 */
import request from './request'

const BASE_URL = '/api/v1/strategy'

// ==================== 基础 API ====================

export const getStrategyList = (params) => {
  return request(BASE_URL, {
    method: 'GET',
    params,
  })
}

export const getStrategyById = (id) => {
  return request(`${BASE_URL}/${id}`, { method: 'GET' })
}

export const createStrategy = (data) => {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateStrategy = (id, data) => {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteStrategy = (id) => {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' })
}

export const executeStrategy = (id) => {
  return request(`${BASE_URL}/${id}/execute`, { method: 'POST' })
}

// ==================== 内容生成 API ====================

export const generateFromReport = (data) => {
  return request(`${BASE_URL}/generate-from-report`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const generateStrategy = (data) => {
  return request(`${BASE_URL}/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ==================== Phase 4: 知识库联动 API ====================

/**
 * 基于知识库生成策略
 */
export const generateFromKnowledge = (strategyType) => {
  return request(`${BASE_URL}/from-knowledge`, {
    method: 'POST',
    body: JSON.stringify({ strategyType }),
  })
}

/**
 * 获取知识库上下文
 */
export const getKnowledgeContext = () => {
  return request(`${BASE_URL}/knowledge-context`, { method: 'GET' })
}

/**
 * 验证策略与知识库一致性
 */
export const validateStrategyConsistency = (strategy) => {
  return request(`${BASE_URL}/validate-consistency`, {
    method: 'POST',
    body: JSON.stringify({ strategy }),
  })
}

export default {
  // 基础
  getStrategyList,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  executeStrategy,
  // 内容生成
  generateFromReport,
  generateStrategy,
  // Phase 4
  generateFromKnowledge,
  getKnowledgeContext,
  validateStrategyConsistency,
}
