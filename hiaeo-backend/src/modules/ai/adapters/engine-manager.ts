import { Injectable } from '@nestjs/common';
import { AIEngineAdapter, GEODiagnosisParams, DiagnosisResult, AIMessage, AIResponse } from './ai-engine.interface';
import { DeepSeekAdapter } from './deepseek.adapter';
import { KimiAdapter } from './kimi.adapter';
import { QwenAdapter } from './qwen.adapter';
import { ZhipuAdapter } from './zhipu.adapter';
import { DoubaoAdapter } from './doubao.adapter';
import { WenxinAdapter } from './wenxin.adapter';

export interface EngineInfo {
  name: string;
  displayName: string;
  available: boolean;
}

@Injectable()
export class EngineManager {
  private engines: Map<string, AIEngineAdapter> = new Map();
  private engineList: AIEngineAdapter[] = [];

  constructor() {
    this.initializeEngines();
  }

  private initializeEngines() {
    // 初始化所有适配器
    const deepseek = new DeepSeekAdapter();
    const kimi = new KimiAdapter();
    const qwen = new QwenAdapter();
    const zhipu = new ZhipuAdapter();
    const doubao = new DoubaoAdapter();
    const wenxin = new WenxinAdapter();

    this.engines.set('deepseek', deepseek);
    this.engines.set('kimi', kimi);
    this.engines.set('qwen', qwen);
    this.engines.set('zhipu', zhipu);
    this.engines.set('doubao', doubao);
    this.engines.set('wenxin', wenxin);

    this.engineList = [
      deepseek,
      doubao,
      wenxin,
      kimi,
      qwen,
      zhipu,
    ];
  }

  /**
   * 获取所有引擎信息
   */
  getAllEngines(): EngineInfo[] {
    return this.engineList.map((engine) => ({
      name: engine.getName(),
      displayName: engine.getDisplayName(),
      available: engine.isAvailable(),
    }));
  }

  /**
   * 获取指定引擎
   */
  getEngine(name: string): AIEngineAdapter | undefined {
    return this.engines.get(name);
  }

  /**
   * 获取可用的引擎
   */
  getAvailableEngines(): AIEngineAdapter[] {
    return this.engineList.filter((engine) => engine.isAvailable());
  }

  /**
   * 获取所有引擎
   */
  getAllEnginesList(): AIEngineAdapter[] {
    return this.engineList;
  }

  /**
   * 对所有可用引擎执行诊断
   */
  async diagnoseAllEngines(params: GEODiagnosisParams): Promise<DiagnosisResult[]> {
    const results: DiagnosisResult[] = [];
    
    for (const engine of this.engineList) {
      try {
        const result = await engine.diagnoseBrand(params);
        results.push(result);
      } catch (error) {
        console.error(`Engine ${engine.getName()} diagnosis failed:`, error);
        // 即使失败也添加一个失败记录
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        results.push({
          engine: engine.getName(),
          brandMentioned: false,
          confidence: 0,
          summary: `诊断失败: ${errorMessage}`,
        });
      }
    }
    
    return results;
  }

  /**
   * 统计诊断结果
   */
  aggregateDiagnosisResults(results: DiagnosisResult[]): {
    totalEngines: number;
    mentionedCount: number;
    avgConfidence: number;
    sentimentDistribution: Record<string, number>;
    mentionsByEngine: Record<string, number>;
  } {
    const mentionedCount = results.filter((r) => r.brandMentioned).length;
    const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);
    
    const sentimentDistribution: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    
    const mentionsByEngine: Record<string, number> = {};
    
    results.forEach((r) => {
      if (r.sentiment) {
        sentimentDistribution[r.sentiment] = (sentimentDistribution[r.sentiment] || 0) + 1;
      }
      if (r.details?.mentions) {
        mentionsByEngine[r.engine] = r.details.mentions;
      }
    });
    
    return {
      totalEngines: results.length,
      mentionedCount,
      avgConfidence: totalConfidence / results.length,
      sentimentDistribution,
      mentionsByEngine,
    };
  }

  /**
   * 向指定引擎发送消息
   */
  async chat(engineName: string, messages: AIMessage[]): Promise<AIResponse> {
    const engine = this.engines.get(engineName);
    if (!engine) {
      return { content: `引擎 ${engineName} 不存在` };
    }
    return engine.chat(messages);
  }

  /**
   * 向所有可用引擎广播消息
   */
  async broadcastChat(messages: AIMessage[]): Promise<Map<string, AIResponse>> {
    const responses = new Map<string, AIResponse>();
    
    for (const engine of this.engineList) {
      if (engine.isAvailable()) {
        try {
          const response = await engine.chat(messages);
          responses.set(engine.getName(), response);
        } catch (error) {
          console.error(`Engine ${engine.getName()} chat failed:`, error);
        }
      }
    }
    
    return responses;
  }
}
