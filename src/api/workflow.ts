/**
 * 智库智能抓取 API
 */
import request from './request';

/**
 * 抓取网站内容
 */
export async function fetchWebsite(url: string) {
  return request('/api/v1/intelligence/fetch-website', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

/**
 * 获取 AI 智能填充建议
 */
export async function getAISuggestion(url: string) {
  return request('/api/v1/intelligence/ai-suggest', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

/**
 * 通过公司名称查询企查查获取企业信息
 */
export async function searchCompany(companyName: string) {
  return request('/api/v1/intelligence/search-company', {
    method: 'POST',
    body: JSON.stringify({ companyName })
  });
}

/**
 * AI 建议数据结构
 */
export interface AISuggestion {
  basicInfo: {
    companyName?: string;
    industry?: string;
    companyRegion?: string;
    website?: string;
  };
  bizPositioning: {
    coreBizIntro?: string;
    targetCustomer?: string;
    differentialAdvantage?: string;
  };
  productService: {
    productSellPoint?: string;
    serviceDetails?: string;
    coreKeywords?: string[];
  };
  competitorMarket: {
    competitors?: { competitorName: string; competitorWebsite: string }[];
  };
  raw?: {
    title: string;
    description: string;
    keywords: string[];
    h1: string[];
    h2: string[];
  };
}
