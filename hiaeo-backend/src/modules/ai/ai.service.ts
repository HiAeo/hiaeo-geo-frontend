import { Injectable } from '@nestjs/common';
import { EngineManager, EngineInfo, DiagnosisResult, AIMessage, AIResponse } from './adapters';
import { GEODiagnosisParams } from './adapters';

@Injectable()
export class AiService {
  constructor(private readonly engineManager: EngineManager) {}

  /**
   * 获取所有 AI 引擎列表
   */
  getEngines(): EngineInfo[] {
    return this.engineManager.getAllEngines();
  }

  /**
   * 获取可用的引擎
   */
  getAvailableEngines(): EngineInfo[] {
    return this.engineManager.getAvailableEngines().map((e) => ({
      name: e.getName(),
      displayName: e.getDisplayName(),
      available: true,
    }));
  }

  /**
   * 向 DeepSeek 发送聊天消息（默认引擎）
   */
  async chat(messages: AIMessage[]): Promise<AIResponse> {
    return this.engineManager.chat('deepseek', messages);
  }

  /**
   * 向指定引擎发送聊天消息
   */
  async chatWithEngine(engineName: string, messages: AIMessage[]): Promise<AIResponse> {
    return this.engineManager.chat(engineName, messages);
  }

  /**
   * 对所有引擎执行 GEO 诊断
   */
  async diagnoseBrand(params: GEODiagnosisParams): Promise<{
    results: DiagnosisResult[];
    summary: {
      totalEngines: number;
      mentionedCount: number;
      avgConfidence: number;
      sentimentDistribution: Record<string, number>;
      mentionsByEngine: Record<string, number>;
    };
  }> {
    const results = await this.engineManager.diagnoseAllEngines(params);
    const summary = this.engineManager.aggregateDiagnosisResults(results);
    
    return { results, summary };
  }

  /**
   * 对指定引擎执行诊断
   */
  async diagnoseBrandWithEngine(
    engineName: string,
    params: GEODiagnosisParams,
  ): Promise<DiagnosisResult> {
    const engine = this.engineManager.getEngine(engineName);
    if (!engine) {
      throw new Error(`引擎 ${engineName} 不存在`);
    }
    return engine.diagnoseBrand(params);
  }

  /**
   * 生成 GEO 优化内容
   */
  async generateGeoContent(params: {
    brandName: string;
    productNames: string[];
    contentType: 'faq' | 'product' | 'article' | 'comparison';
    tone?: string;
    length?: 'short' | 'medium' | 'long';
  }): Promise<{
    title: string;
    content: string;
    metaDescription: string;
    tags: string[];
  }> {
    const { brandName, productNames, contentType, tone = 'professional', length = 'medium' } = params;

    let prompt = '';
    let systemPrompt = '你是一个专业的GEO内容创作专家。';

    switch (contentType) {
      case 'faq':
        prompt = `为"${brandName}"（${productNames.join(', ')}）生成5个常见的FAQ问答对。
格式要求：
Q1: [问题]
A1: [详细回答]

注意事项：
- 问题要真实反映用户可能搜索的内容
- 回答要自然包含品牌名和产品关键信息
- 使用专业但易懂的语言
- 每个回答约100-200字`;
        break;

      case 'product':
        prompt = `为"${brandName}"生成一篇产品介绍文案。
产品名称：${productNames.join(', ')}
语气：${tone}
长度：${length === 'short' ? '300字' : length === 'medium' ? '600字' : '1000字'}

要求：
- 突出产品核心卖点
- 自然融入品牌信息
- SEO友好，包含关键词`;
        break;

      case 'article':
        prompt = `为"${brandName}"生成一篇行业分析文章。
产品：${productNames.join(', ')}
语气：${tone}
长度：${length === 'short' ? '500字' : length === 'medium' ? '1000字' : '2000字'}

要求：
- 展现品牌在行业中的专业性
- 包含行业趋势分析
- 提供独到见解
- 自然植入品牌信息`;
        break;

      case 'comparison':
        prompt = `为"${brandName}"生成一篇与竞品对比的分析。
产品：${productNames.join(', ')}

要求：
- 客观分析优势和差异化
- 不贬低竞品
- 突出品牌独特价值
- 约500字`;
        break;
    }

    // 使用 DeepSeek 生成内容（如果有 API Key）
    const deepseek = this.engineManager.getEngine('deepseek');
    const response = deepseek?.isAvailable()
      ? await deepseek.chat([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ])
      : { content: this.getMockContent(contentType, brandName) };

    return this.parseGeneratedContent(response.content, contentType);
  }

  /**
   * 分析现有内容的 GEO 效果
   */
  async analyzeContent(params: {
    content: string;
    brandName: string;
    keywords: string[];
  }): Promise<{
    seoScore: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    suggestions: string[];
    brandPresence: 'strong' | 'moderate' | 'weak' | 'none';
  }> {
    const { content, brandName, keywords } = params;
    const words = content.split(/\s+/);
    const wordCount = words.length;

    // 计算关键词密度
    const keywordDensity: Record<string, number> = {};
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      keywordDensity[keyword] = matches
        ? Number(((matches.length / wordCount) * 100).toFixed(2))
        : 0;
    });

    // 计算品牌存在感
    const brandRegex = new RegExp(brandName, 'gi');
    const brandMatches = content.match(brandRegex);
    const brandDensity = brandMatches ? (brandMatches.length / wordCount) * 100 : 0;

    let brandPresence: 'strong' | 'moderate' | 'weak' | 'none' = 'none';
    if (brandDensity > 3) brandPresence = 'strong';
    else if (brandDensity > 1) brandPresence = 'moderate';
    else if (brandDensity > 0) brandPresence = 'weak';

    // 计算 SEO 分数
    const avgKeywordDensity = Object.values(keywordDensity).reduce((a, b) => a + b, 0) / Math.max(keywords.length, 1);
    const seoScore = Math.min(
      100,
      Math.round(
        (avgKeywordDensity > 2 && avgKeywordDensity < 5 ? 40 : avgKeywordDensity > 0 ? 30 : 0) +
        (brandDensity > 2 ? 30 : brandDensity > 1 ? 20 : brandDensity > 0 ? 10 : 0) +
        (content.length > 500 ? 15 : 10) +
        (keywords.filter((k) => keywordDensity[k] > 0).length / keywords.length) * 15,
      ),
    );

    // 生成建议
    const suggestions: string[] = [];
    if (avgKeywordDensity < 2) suggestions.push('建议增加核心关键词的出现频率');
    if (avgKeywordDensity > 5) suggestions.push('关键词密度过高，建议减少以避免堆砌');
    if (brandDensity < 1) suggestions.push('建议增加品牌名称的出现频率');
    if (content.length < 500) suggestions.push('内容长度偏短，建议扩展到500字以上');
    if (keywords.filter((k) => keywordDensity[k] > 0).length < keywords.length * 0.5) {
      suggestions.push('部分关键词未覆盖，建议补充');
    }

    return {
      seoScore,
      readabilityScore: 75, // 简化计算
      keywordDensity,
      suggestions,
      brandPresence,
    };
  }

  private parseGeneratedContent(
    content: string,
    type: string,
  ): {
    title: string;
    content: string;
    metaDescription: string;
    tags: string[];
  } {
    // 尝试解析 JSON 格式
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          title: data.title || `${type} - 生成内容`,
          content: data.content || content,
          metaDescription: data.metaDescription || content.substring(0, 100),
          tags: data.tags || [],
        };
      }
    } catch {
      // 解析失败，使用原始内容
    }

    return {
      title: `${type} - 品牌内容`,
      content,
      metaDescription: content.substring(0, 100),
      tags: [],
    };
  }

  private getMockContent(type: string, brandName: string): string {
    const templates: Record<string, string> = {
      faq: `# ${brandName} 常见问题

Q1: ${brandName}的产品有什么特点？
A1: ${brandName}致力于提供高品质的产品和服务，深受用户好评。

Q2: 如何联系${brandName}？
A2: 您可以通过官网联系我们，客服团队随时为您服务。`,
      product: `# 关于${brandName}

${brandName}是一家专注于技术创新的企业，我们的产品具有以下核心优势：
1. 高品质
2. 创新设计
3. 优质用户体验

欢迎了解更多关于我们的产品信息。`,
      article: `# ${brandName}行业分析

在当前市场环境下，${brandName}凭借其独特的竞争优势，持续为用户提供价值...

（这是模拟内容，配置API Key后将生成真实AI内容）`,
      comparison: `# ${brandName}与竞品对比

${brandName}在多个方面具有独特优势：

1. 产品品质
2. 技术创新
3. 用户体验

我们始终致力于为用户提供最佳解决方案。`,
    };

    return templates[type] || templates.article;
  }
}
