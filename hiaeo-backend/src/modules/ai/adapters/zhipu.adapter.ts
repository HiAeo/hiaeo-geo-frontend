import axios from 'axios';
import { AIEngineAdapter, AIMessage, AIResponse, GEODiagnosisParams, DiagnosisResult } from './ai-engine.interface';

export class ZhipuAdapter implements AIEngineAdapter {
  private apiKey: string;
  private baseUrl = 'https://open.bigmodel.cn/api/paas/v4';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ZHIPU_API_KEY || '';
  }

  getName(): string {
    return 'zhipu';
  }

  getDisplayName(): string {
    return '智谱清言';
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
          model: 'glm-4',
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
      console.error('Zhipu API error:', error.message);
      return this.getMockResponse(messages);
    }
  }

  async diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult> {
    const { brandName, productNames = [] } = params;

    const prompt = `关于"${brandName}"（${productNames.join(', ')}），请给出简要回答。`;

    try {
      const response = await this.chat([
        { role: 'system', content: '你是一个有帮助的AI助手。' },
        { role: 'user', content: prompt },
      ]);

      return this.parseDiagnosisResult(response.content);
    } catch (error) {
      console.error('Zhipu diagnosis error:', error);
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

  private parseDiagnosisResult(content: string): DiagnosisResult {
    const lowerContent = content.toLowerCase();
    const brandMentioned = !lowerContent.includes('不知道');
    
    return {
      engine: this.getName(),
      brandMentioned,
      sentiment: 'neutral',
      confidence: 0.55,
      summary: content.substring(0, 100),
    };
  }

  private getMockResponse(messages: AIMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return {
      content: `[智谱模拟响应] 已收到: ${lastMessage.substring(0, 50)}...\n\n配置API Key后可使用真实智谱服务。`,
    };
  }

  private getMockDiagnosis(brandName: string): DiagnosisResult {
    return {
      engine: this.getName(),
      brandMentioned: Math.random() > 0.4,
      sentiment: 'neutral',
      confidence: 0.3,
      summary: `[智谱模拟数据]`,
    };
  }
}
