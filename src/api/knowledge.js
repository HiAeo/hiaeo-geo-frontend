/**
 * 知识库 API (Phase 4 增强)
 */
import request from './request'

const BASE_URL = '/api/v1/knowledge'

// ==================== 基础 API ====================

export const getKnowledgeBase = () => {
  return request(`${BASE_URL}/profile`, { method: 'GET' })
}

export const createKnowledgeBase = (data) => {
  return request(`${BASE_URL}/profile`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateKnowledgeBase = (data) => {
  return request(`${BASE_URL}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const uploadFile = (file, module) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('module', module)

  const token = localStorage.getItem('auth_token')
  
  return fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  }).then(res => res.json())
}

export const deleteFile = (fileId) => {
  return request(`${BASE_URL}/file/${fileId}`, { method: 'DELETE' })
}

export const getVersionHistory = (page = 1, size = 10) => {
  return request(`${BASE_URL}/history`, {
    method: 'GET',
    params: { page, size },
  })
}

export const getAiSuggestion = (field, source) => {
  return request(`${BASE_URL}/ai-suggest`, {
    method: 'POST',
    body: JSON.stringify({ field, sourceUrl: source }),
  })
}

// ==================== Phase 3: AI 联动 API ====================

export const getEnhancedFieldSuggestion = (field, context) => {
  return request(`${BASE_URL}/ai-suggest/field`, {
    method: 'POST',
    body: JSON.stringify({ field, context }),
  })
}

export const extractFromUrl = (url, targetField) => {
  return request(`${BASE_URL}/ai-extract/url`, {
    method: 'POST',
    body: JSON.stringify({ url, targetField }),
  })
}

export const extractFromText = (text, targetFields) => {
  return request(`${BASE_URL}/ai-extract/text`, {
    method: 'POST',
    body: JSON.stringify({ text, targetFields }),
  })
}

export const getCompletenessReport = () => {
  return request(`${BASE_URL}/completeness`, { method: 'GET' })
}

export const getKeywordSuggestions = () => {
  return request(`${BASE_URL}/keywords`, { method: 'GET' })
}

export const getDiagnosisSuggestion = () => {
  return request(`${BASE_URL}/diagnosis-suggest`, { method: 'GET' })
}

export const triggerIncrementalDiagnosis = (dimensions) => {
  return request(`${BASE_URL}/diagnosis-trigger`, {
    method: 'POST',
    body: JSON.stringify({ dimensions }),
  })
}

export const semanticSearch = (query, topK = 5) => {
  return request(`${BASE_URL}/search`, {
    method: 'POST',
    body: JSON.stringify({ query, topK }),
  })
}

export const rebuildIndex = () => {
  return request(`${BASE_URL}/index`, { method: 'POST' })
}

export const getIndexStatus = () => {
  return request(`${BASE_URL}/index`, { method: 'GET' })
}

export const findSimilarKnowledgeBases = (topK = 5) => {
  return request(`${BASE_URL}/similar`, {
    method: 'GET',
    params: { topK },
  })
}

// ==================== Phase 4: 诊断联动 API ====================

/**
 * 获取诊断关联的知识库摘要
 */
export const getKnowledgeSummaryForDiagnosis = () => {
  return request(`${BASE_URL}/diagnosis/summary`, { method: 'GET' })
}

/**
 * 检查内容与知识库合规性
 */
export const checkContentWithKnowledge = (content) => {
  return request(`${BASE_URL}/check-content`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export default {
  // 基础
  getKnowledgeBase,
  createKnowledgeBase,
  updateKnowledgeBase,
  uploadFile,
  deleteFile,
  getVersionHistory,
  getAiSuggestion,
  // Phase 3
  getEnhancedFieldSuggestion,
  extractFromUrl,
  extractFromText,
  getCompletenessReport,
  getKeywordSuggestions,
  getDiagnosisSuggestion,
  triggerIncrementalDiagnosis,
  semanticSearch,
  rebuildIndex,
  getIndexStatus,
  findSimilarKnowledgeBases,
  // Phase 4
  getKnowledgeSummaryForDiagnosis,
  checkContentWithKnowledge,
}
