/**
 * 统一的消息格式
 */
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * AI 引擎响应
 */
export interface AIResponse {
  content: string;
  raw?: any;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * 诊断结果
 */
export interface DiagnosisResult {
  engine: string;
  brandMentioned: boolean;
  brandPosition?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence: number;
  summary: string;
  details?: {
    mentions?: number;
    context?: string;
    sentimentScore?: number;
  };
}

/**
 * GEO 诊断参数
 */
export interface GEODiagnosisParams {
  brandName: string;
  productNames?: string[];
  competitors?: string[];
  industry?: string;
  website?: string;
}

/**
 * AI 引擎适配器接口
 */
export interface AIEngineAdapter {
  /**
   * 获取引擎名称
   */
  getName(): string;

  /**
   * 获取引擎显示名称
   */
  getDisplayName(): string;

  /**
   * 检查 API 是否可用
   */
  isAvailable(): boolean;

  /**
   * 发送聊天消息
   */
  chat(messages: AIMessage[]): Promise<AIResponse>;

  /**
   * GEO 诊断 - 询问关于品牌的问题
   */
  diagnoseBrand(params: GEODiagnosisParams): Promise<DiagnosisResult>;

  /**
   * 生成内容
   */
  generateContent(prompt: string, options?: Record<string, any>): Promise<string>;
}
