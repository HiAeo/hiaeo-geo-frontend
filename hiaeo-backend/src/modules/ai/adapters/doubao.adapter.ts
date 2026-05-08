import axios from 'axios';
import { AIEngineAdapter, AIMessage, AIResponse, GEODiagnosisParams, DiagnosisResult } from './ai-engine.interface';

export class DoubaoAdapter implements AIEngineAdapter {
  private apiKey: string;
  private baseUrl = 'https://ark.cn-beijing.volces.com/api/v3';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DOUBAO_API_KEY || '';
  }

  getName(): string {
    return 'doubao';
  }

  getDisplayName(): string {
    return '豆包';
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
          model: 'doubao-pro',
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
      };
    } catch (error: any) {
      console.error('Doubao API error:', error.message);
      return this.getMockResponse(messages);
    }
  }

  async diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult> {
    const { brandName, productNames = [] } = params;

    const prompt = `请简单回答关于"${brandName}"（${productNames.join(', ')}）的了解程度。`;

    try {
      const response = await this.chat([
        { role: 'system', content: '你是一个友好的AI助手。' },
        { role: 'user', content: prompt },
      ]);

      return this.parseDiagnosisResult(response.content);
    } catch (error) {
      console.error('Doubao diagnosis error:', error);
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
    const brandMentioned = !lowerContent.includes('不知道') && !lowerContent.includes('不了解');
    
    return {
      engine: this.getName(),
      brandMentioned,
      sentiment: 'neutral',
      confidence: 0.5,
      summary: content.substring(0, 100),
    };
  }

  private getMockResponse(messages: AIMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return {
      content: `[豆包模拟响应] 已收到: ${lastMessage.substring(0, 50)}...\n\n配置API Key后可使用真实豆包服务。`,
    };
  }

  private getMockDiagnosis(brandName: string): DiagnosisResult {
    return {
      engine: this.getName(),
      brandMentioned: Math.random() > 0.5,
      sentiment: 'neutral',
      confidence: 0.25,
      summary: `[豆包模拟数据]`,
    };
  }
}
