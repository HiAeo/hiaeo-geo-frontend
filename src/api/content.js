import request from './request'

export const contentApi = {
  // 生成SEO文章
  generateSeoArticle: (data) => {
    return request('/content/generate/seo-article', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 生成FAQ
  generateFaq: (data) => {
    return request('/content/generate/faq', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 生成JSON-LD
  generateJsonLd: (data) => {
    return request('/content/generate/json-ld', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 生成产品描述
  generateProductDescription: (data) => {
    return request('/content/generate/product-description', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 优化内容
  optimize: (data) => {
    return request('/content/optimize', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 敏感词检测
  checkSensitive: (data) => {
    return request('/content/check-sensitive', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
