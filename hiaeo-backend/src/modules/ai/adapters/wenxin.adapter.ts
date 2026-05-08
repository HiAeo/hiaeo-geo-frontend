import axios from 'axios';
import { AIEngineAdapter, AIMessage, AIResponse, GEODiagnosisParams, DiagnosisResult } from './ai-engine.interface';

export class WenxinAdapter implements AIEngineAdapter {
  private apiKey: string;
  private secretKey: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(apiKey?: string, secretKey?: string) {
    this.apiKey = apiKey || process.env.WENXIN_API_KEY || '';
    this.secretKey = secretKey || process.env.WENXIN_SECRET_KEY || '';
  }

  getName(): string {
    return 'wenxin';
  }

  getDisplayName(): string {
    return '文心一言';
  }

  isAvailable(): boolean {
    return !!this.apiKey && !!this.secretKey;
  }

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.isAvailable()) {
      return null;
    }

    try {
      const response = await axios.post(
        'https://aip.baidubce.com/oauth/2.0/token',
        null,
        {
          params: {
            grant_type: 'client_credentials',
            client_id: this.apiKey,
            client_secret: this.secretKey,
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('Wenxin token error:', error);
      return null;
    }
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    const token = await this.getAccessToken();
    if (!token) {
      return this.getMockResponse(messages);
    }

    try {
      // 转换消息格式
      const ernieMessages = messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
        content: m.content,
      }));

      const response = await axios.post(
        `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${token}`,
        {
          messages: ernieMessages,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        content: response.data.result || '',
        raw: response.data,
      };
    } catch (error: any) {
      console.error('Wenxin API error:', error.message);
      return this.getMockResponse(messages);
    }
  }

  async diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult> {
    const { brandName, productNames = [] } = params;

    const prompt = `请简要回答关于"${brandName}"（${productNames.join(', ')}）的了解。`;

    try {
      const response = await this.chat([
        { role: 'system', content: '你是一个专业的AI助手。' },
        { role: 'user', content: prompt },
      ]);

      return this.parseDiagnosisResult(response.content);
    } catch (error) {
      console.error('Wenxin diagnosis error:', error);
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
      confidence: 0.6,
      summary: content.substring(0, 100),
    };
  }

  private getMockResponse(messages: AIMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return {
      content: `[文心一言模拟响应] 已收到: ${lastMessage.substring(0, 50)}...\n\n配置API Key和Secret Key后可使用真实文心一言服务。`,
    };
  }

  private getMockDiagnosis(brandName: string): DiagnosisResult {
    return {
      engine: this.getName(),
      brandMentioned: Math.random() > 0.35,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
      confidence: 0.35,
      summary: `[文心一言模拟数据]`,
    };
  }
}
