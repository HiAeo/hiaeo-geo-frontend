/**
 * Agent API 封装
 * 品牌 GEO AI Agent 接口
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 创建 Agent 会话
 */
export async function createAgentSession(brandId: string) {
  const response = await fetch(`${API_BASE}/v1/agent/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandId }),
  })
  return response.json()
}

/**
 * 获取会话详情
 */
export async function getAgentSession(sessionId: string) {
  const response = await fetch(`${API_BASE}/v1/agent/sessions/${sessionId}`)
  return response.json()
}

/**
 * 发送消息
 */
export async function sendAgentMessage(sessionId: string, message: string) {
  const response = await fetch(`${API_BASE}/v1/agent/sessions/${sessionId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  return response.json()
}

/**
 * 执行一键串联
 */
export async function executeAgentChain(brandId: string, sessionId?: string) {
  const response = await fetch(`${API_BASE}/v1/agent/chain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandId, sessionId }),
  })
  return response.json()
}

/**
 * 获取 Agent 健康状态
 */
export async function getAgentHealth() {
  const response = await fetch(`${API_BASE}/v1/agent/health`)
  return response.json()
}

/**
 * 删除会话
 */
export async function deleteAgentSession(sessionId: string) {
  const response = await fetch(`${API_BASE}/v1/agent/sessions/${sessionId}/delete`, {
    method: 'POST',
  })
  return response.json()
}

/**
 * 向量数据库 API
 */

/**
 * 搜索相似内容
 */
export async function searchVectors(query: string, brandId?: string, topK = 10) {
  const response = await fetch(`${API_BASE}/v1/vector/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, brandId, topK }),
  })
  return response.json()
}

/**
 * 存储品牌知识
 */
export async function storeBrandKnowledge(data: {
  brandId: string
  title: string
  content: string
  source?: string
  type?: string
}) {
  const response = await fetch(`${API_BASE}/v1/vector/knowledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * RAG 检索
 */
export async function ragRetrieve(query: string, brandId: string, topK = 5) {
  const response = await fetch(`${API_BASE}/v1/vector/rag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, brandId, topK }),
  })
  return response.json()
}

/**
 * 获取向量统计
 */
export async function getVectorStats() {
  const response = await fetch(`${API_BASE}/v1/vector/stats`)
  return response.json()
}
