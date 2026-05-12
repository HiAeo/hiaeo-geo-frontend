// 使用相对路径，通过 Vite 代理转发到后端 (http://localhost:3000/api)
// 注意：后端全局前缀已设置为 'api'，所以这里不需要再加 '/api'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const request = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  // Check for API key
  const apiKey = localStorage.getItem('apiKey')
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }
  
  // Build URL with query params if provided
  let fullUrl = `${BASE_URL}${url}`
  if (options.params) {
    const searchParams = new URLSearchParams()
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value)
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      fullUrl += `?${queryString}`
    }
  }
  
  try {
    const response = await fetch(fullUrl, {
      method: options.method || 'GET',
      headers,
      body: options.body
    })
    
    const text = await response.text()
    
    if (!text || text.trim() === '') {
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`)
      }
      return {}
    }
    
    const data = JSON.parse(text)
    
    if (!response.ok) {
      throw new Error(data.message || `请求失败: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default request
