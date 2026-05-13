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
 * 获取品牌工作流状态
 */
export async function getWorkflowState(brandId: string) {
  return request(`/api/v1/workflow/state/${brandId}`, {
    method: 'GET'
  });
}

/**
 * 获取工作流进度摘要
 */
export async function getWorkflowSummary(brandId: string) {
  return request(`/api/v1/workflow/summary/${brandId}`, {
    method: 'GET'
  });
}

/**
 * 更新模块状态
 */
export async function updateModuleState(brandId: string, module: string, state: string) {
  return request(`/api/v1/workflow/module/${brandId}`, {
    method: 'PUT',
    body: JSON.stringify({ module, state })
  });
}

/**
 * 启动AI诊断 - 将智库状态设为 COMPLETED，并点亮诊断按钮
 */
export async function startDiagnosis(brandId: string) {
  if (!brandId) {
    throw new Error('品牌ID不能为空，请先完成品牌智库填写');
  }
  // 1. 更新智库状态为完成
  await updateModuleState(brandId, 'knowledge', 'completed');
  // 2. 返回成功，让前端跳转到诊断页面
  return { code: 0, message: 'success', data: { canExecute: true } };
}

/**
 * 启动AI优化建议 - 将诊断状态设为 CONFIRMED
 */
export async function confirmDiagnosis(brandId: string, diagnosisId: string) {
  if (!brandId) {
    throw new Error('品牌ID不能为空，请先完成品牌智库填写');
  }
  await updateModuleState(brandId, 'diagnosis', 'completed');
  return { code: 0, message: 'success' };
}

/**
 * 启动GEO优化执行 - 将策略状态设为 CONFIRMED
 */
export async function confirmStrategy(brandId: string, strategyId: string) {
  if (!brandId) {
    throw new Error('品牌ID不能为空，请先完成品牌智库填写');
  }
  await updateModuleState(brandId, 'strategy', 'completed');
  return { code: 0, message: 'success' };
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
