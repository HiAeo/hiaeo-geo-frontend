const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const request = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  
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
  
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed')
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default request
