import axios from 'axios';
import { AIEngineAdapter, AIMessage, AIResponse, GEODiagnosisParams, DiagnosisResult } from './ai-engine.interface';

export class KimiAdapter implements AIEngineAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.moonshot.cn/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.KIMI_API_KEY || '';
  }

  getName(): string {
    return 'kimi';
  }

  getDisplayName(): string {
    return 'Kimi';
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
          model: 'moonshot-v1-8k',
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
      console.error('Kimi API error:', error.message);
      return this.getMockResponse(messages);
    }
  }

  async diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult> {
    const { brandName, productNames = [] } = params;

    const prompt = `关于"${brandName}"（${productNames.join(', ')}），请诚实回答你是否知道这个品牌，并给出简要评价。`;

    try {
      const response = await this.chat([
        { role: 'system', content: '你是一个诚实的AI助手。' },
        { role: 'user', content: prompt },
      ]);

      return this.parseDiagnosisResult(response.content, brandName);
    } catch (error) {
      console.error('Kimi diagnosis error:', error);
      return this.getMockDiagnosis(brandName);
    }
  }

  async generateContent(prompt: string, options?: Record<string, any>): Promise<string> {
    const response = await this.chat([
      { role: 'system', content: '你是一个专业的内容创作助手。' },
      { role: 'user', content: prompt },
    ]);
    return response.content;
  }

  private parseDiagnosisResult(content: string, brandName: string): DiagnosisResult {
    const lowerContent = content.toLowerCase();
    const brandMentioned = !lowerContent.includes('不知道') && !lowerContent.includes('不了解');
    
    const positiveWords = ['好', '优秀', '推荐', '不错', '值得', '专业', '知名'];
    const negativeWords = ['差', '不好', '不推荐', '问题'];
    
    const positiveCount = positiveWords.filter(w => lowerContent.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerContent.includes(w)).length;

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      engine: this.getName(),
      brandMentioned,
      brandPosition: brandMentioned ? content.substring(0, 100) : undefined,
      sentiment,
      confidence: 0.65,
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
      content: `[Kimi模拟响应] 已收到: ${lastMessage.substring(0, 50)}...\n\n配置API Key后可使用真实Kimi服务。`,
    };
  }

  private getMockDiagnosis(brandName: string): DiagnosisResult {
    return {
      engine: this.getName(),
      brandMentioned: Math.random() > 0.4,
      brandPosition: `模拟：${brandName}`,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
      confidence: 0.35,
      summary: `[Kimi模拟数据]`,
    };
  }
}
