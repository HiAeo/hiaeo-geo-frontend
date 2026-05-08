import axios from 'axios';
import { AIEngineAdapter, AIMessage, AIResponse, GEODiagnosisParams, DiagnosisResult } from './ai-engine.interface';

export class DeepSeekAdapter implements AIEngineAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
  }

  getName(): string {
    return 'deepseek';
  }

  getDisplayName(): string {
    return 'DeepSeek';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.isAvailable()) {
      return this.getMockResponse(messages);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return {
        content: response.data.choices[0].message.content,
        raw: response.data,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('DeepSeek API error:', error.message);
      return this.getMockResponse(messages);
    }
  }

  async diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult> {
    const { brandName, productNames = [], competitors = [] } = params;

    const prompt = `你是一个专业的AI助手。请回答以下关于品牌的问题：

问题：关于"${brandName}"（${productNames.join(', ')}），请诚实回答：

1. 你是否知道这个品牌/公司？
2. 如果知道，你会如何向用户推荐它？
3. 与${competitors.length > 0 ? competitors.join('、') : '同类品牌'}相比，它有什么特点？

请用JSON格式回答，包含：
- brandMentioned: 布尔值，表示是否知道这个品牌
- brandPosition: 字符串，如果知道，描述品牌定位
- sentiment: positive/neutral/negative，表示情感倾向
- confidence: 0-1的数字，表示回答的可信度
- summary: 一句话总结
- details.mentions: 提及次数估算
- details.context: 简要描述回答内容`;

    try {
      const response = await this.chat([
        { role: 'system', content: '你是一个诚实的AI助手，请基于你的知识回答问题。' },
        { role: 'user', content: prompt },
      ]);

      // 解析响应
      const result = this.parseDiagnosisResponse(response.content);
      return {
        engine: this.getName(),
        ...result,
      };
    } catch (error) {
      console.error('DeepSeek diagnosis error:', error);
      return this.getMockDiagnosis(brandName);
    }
  }

  async generateContent(prompt: string, options?: Record<string, any>): Promise<string> {
    const response = await this.chat([
      { role: 'system', content: '你是一个专业的内容创作助手，请生成高质量的内容。' },
      { role: 'user', content: prompt },
    ]);
    return response.content;
  }

  private parseDiagnosisResponse(content: string): DiagnosisResult {
    try {
      // 尝试提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          engine: this.getName(),
          brandMentioned: data.brandMentioned ?? false,
          brandPosition: data.brandPosition,
          sentiment: data.sentiment || 'neutral',
          confidence: data.confidence || 0.5,
          summary: data.summary || content.substring(0, 100),
          details: {
            mentions: data.details?.mentions || 0,
            context: data.details?.context || content.substring(0, 200),
            sentimentScore: data.details?.sentimentScore || 0.5,
          },
        };
      }
    } catch {
      // 解析失败，使用默认逻辑
    }

    // 基于内容分析
    const lowerContent = content.toLowerCase();
    const brandMentioned = !content.includes('不知道') && !content.includes('不了解');
    const positiveWords = ['好', '优秀', '推荐', '不错', '值得', '专业'];
    const negativeWords = ['差', '不好', '不推荐', '问题', '风险'];
    
    const positiveCount = positiveWords.filter(w => lowerContent.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerContent.includes(w)).length;

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      engine: this.getName(),
      brandMentioned,
      sentiment,
      confidence: 0.7,
      summary: content.substring(0, 100),
      details: {
        mentions: positiveCount + negativeCount,
        context: content.substring(0, 200),
        sentimentScore: (positiveCount + 1) / (positiveCount + negativeCount + 2),
      },
    };
  }

  private getMockResponse(messages: AIMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return {
      content: `[DeepSeek模拟响应] 已收到您的请求: ${lastMessage.substring(0, 50)}...\n\n这是一条模拟的AI响应。在配置API Key后，将返回真实的AI生成内容。`,
    };
  }

  private getMockDiagnosis(brandName: string): DiagnosisResult {
    return {
      engine: this.getName(),
      brandMentioned: Math.random() > 0.3,
      brandPosition: `模拟：${brandName}是一家专注于技术创新的公司`,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
      confidence: 0.4,
      summary: `[模拟数据] 这是${brandName}的模拟诊断结果`,
      details: {
        mentions: Math.floor(Math.random() * 10),
        context: '模拟诊断上下文信息',
        sentimentScore: 0.5 + Math.random() * 0.3,
      },
    };
  }
}
