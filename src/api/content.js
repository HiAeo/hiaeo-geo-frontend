/**
 * 内容 API (Phase 4 增强)
 */
import request from './request'

const BASE_URL = '/api/v1/content'

// ==================== 基础 API ====================

export const getContentList = (params) => {
  return request(BASE_URL, {
    method: 'GET',
    params,
  })
}

export const getContentById = (id) => {
  return request(`${BASE_URL}/${id}`, { method: 'GET' })
}

export const createContent = (data) => {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateContent = (id, data) => {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteContent = (id) => {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' })
}

// ==================== 内容生成 API ====================

export const generateSeoArticle = (data) => {
  return request(`${BASE_URL}/generate/seo-article`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const generateFaq = (data) => {
  return request(`${BASE_URL}/generate/faq`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const generateJsonLd = (data) => {
  return request(`${BASE_URL}/generate/json-ld`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const generateProductDescription = (data) => {
  return request(`${BASE_URL}/generate/product-description`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const optimizeContent = (content, type) => {
  return request(`${BASE_URL}/optimize`, {
    method: 'POST',
    body: JSON.stringify({ content, type }),
  })
}

export const checkSensitiveWords = (content) => {
  return request(`${BASE_URL}/check-sensitive`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

// ==================== Phase 4: 知识库联动 API ====================

/**
 * 基于知识库生成SEO文章
 */
export const generateSeoArticleFromKnowledge = (keyword) => {
  return request(`${BASE_URL}/generate/seo-article/from-knowledge`, {
    method: 'POST',
    body: JSON.stringify({ keyword }),
  })
}

/**
 * 基于知识库生成FAQ
 */
export const generateFaqFromKnowledge = (faqType = 'brand') => {
  return request(`${BASE_URL}/generate/faq/from-knowledge`, {
    method: 'POST',
    body: JSON.stringify({ faqType }),
  })
}

/**
 * 基于知识库生成产品描述
 */
export const generateProductDescriptionFromKnowledge = (productName) => {
  return request(`${BASE_URL}/generate/product-description/from-knowledge`, {
    method: 'POST',
    body: JSON.stringify({ productName }),
  })
}

/**
 * 检查内容与知识库合规性
 */
export const checkWithKnowledge = (content) => {
  return request(`${BASE_URL}/check-with-knowledge`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

/**
 * 获取品牌摘要
 */
export const getBrandSummary = () => {
  return request(`${BASE_URL}/brand-summary`, { method: 'GET' })
}

export default {
  // 基础
  getContentList,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  // 内容生成
  generateSeoArticle,
  generateFaq,
  generateJsonLd,
  generateProductDescription,
  optimizeContent,
  checkSensitiveWords,
  // Phase 4
  generateSeoArticleFromKnowledge,
  generateFaqFromKnowledge,
  generateProductDescriptionFromKnowledge,
  checkWithKnowledge,
  getBrandSummary,
}
