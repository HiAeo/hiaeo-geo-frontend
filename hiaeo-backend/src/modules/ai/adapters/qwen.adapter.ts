import axios from 'axios';
import { AIEngineAdapter, AIMessage, AIResponse, GEODiagnosisParams, DiagnosisResult } from './ai-engine.interface';

export class QwenAdapter implements AIEngineAdapter {
  private apiKey: string;
  private baseUrl = 'https://dashscope.aliyuncs.com/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.QWEN_API_KEY || '';
  }

  getName(): string {
    return 'qwen';
  }

  getDisplayName(): string {
    return '通义千问';
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
        `${this.baseUrl}/services/aigc/text-generation/generation`,
        {
          model: 'qwen-turbo',
          input: {
            messages,
          },
          parameters: {
            temperature: 0.7,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return {
        content: response.data.output?.text || '',
        raw: response.data,
      };
    } catch (error: any) {
      console.error('Qwen API error:', error.message);
      return this.getMockResponse(messages);
    }
  }

  async diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult> {
    const { brandName, productNames = [] } = params;

    const prompt = `请回答关于"${brandName}"（${productNames.join(', ')}）的问题。`;

    try {
      const response = await this.chat([
        { role: 'system', content: '你是一个专业的AI助手。' },
        { role: 'user', content: prompt },
      ]);

      return this.parseDiagnosisResult(response.content, brandName);
    } catch (error) {
      console.error('Qwen diagnosis error:', error);
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
    
    return {
      engine: this.getName(),
      brandMentioned,
      sentiment: 'neutral',
      confidence: 0.6,
      summary: content.substring(0, 100),
    };
  }

  private getMockResponse(messages: AIMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return {
      content: `[通义千问模拟响应] 已收到: ${lastMessage.substring(0, 50)}...\n\n配置API Key后可使用真实通义千问服务。`,
    };
  }

  private getMockDiagnosis(brandName: string): DiagnosisResult {
    return {
      engine: this.getName(),
      brandMentioned: Math.random() > 0.35,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
      confidence: 0.3,
      summary: `[通义千问模拟数据]`,
    };
  }
}
