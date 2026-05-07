import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiService {
  private readonly deepseekApiKey: string;
  private readonly doubanApiKey: string;

  constructor() {
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';
    this.doubanApiKey = process.env.DOUBAN_API_KEY || '';
  }

  async chat(messages: AiChatMessage[], model = 'deepseek-chat'): Promise<string> {
    if (model === 'deepseek-chat' && this.deepseekApiKey) {
      return this.callDeepseek(messages);
    }
    
    // 默认返回模拟响应
    return this.getMockResponse(messages);
  }

  private async callDeepseek(messages: AiChatMessage[]): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.deepseekApiKey}`,
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Deepseek API error:', error);
      return this.getMockResponse(messages);
    }
  }

  private getMockResponse(messages: AiChatMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return `[模拟AI响应] 已收到您的请求: ${lastMessage.substring(0, 50)}...`;
  }

  async generateSeoContent(params: {
    topic: string;
    keywords: string[];
    targetAudience: string;
    tone: string;
    length: 'short' | 'medium' | 'long';
  }): Promise<{ title: string; content: string; metaDescription: string }> {
    const prompt = `请为以下主题生成 SEO 优化的内容：
    主题: ${params.topic}
    关键词: ${params.keywords.join(', ')}
    目标受众: ${params.targetAudience}
    语气: ${params.tone}
    长度: ${params.length === 'short' ? '500字' : params.length === 'medium' ? '1000字' : '2000字'}
    
    请以 JSON 格式返回，包含 title(标题)、content(正文)、metaDescription(描述)`;

    const response = await this.chat([
      { role: 'system', content: '你是一个专业的 SEO 内容专家。请生成高质量的 SEO 优化内容。' },
      { role: 'user', content: prompt },
    ]);

    try {
      return JSON.parse(response);
    } catch {
      return {
        title: `${params.topic} - 专业指南`,
        content: response,
        metaDescription: `了解关于${params.topic}的详细信息，帮助您${params.targetAudience}`,
      };
    }
  }

  async analyzeContent(params: {
    content: string;
    keywords: string[];
  }): Promise<{
    seoScore: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    suggestions: string[];
  }> {
    const content = params.content;
    const words = content.split(/\s+/);
    const wordCount = words.length;
    
    const keywordDensity: Record<string, number> = {};
    params.keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      keywordDensity[keyword] = matches ? Number((matches.length / wordCount * 100).toFixed(2)) : 0;
    });

    return {
      seoScore: 75,
      readabilityScore: 80,
      keywordDensity,
      suggestions: [
        '建议在开头使用核心关键词',
        '增加小标题以提高可读性',
        '确保每个段落都有相关的关键词',
      ],
    };
  }
}
