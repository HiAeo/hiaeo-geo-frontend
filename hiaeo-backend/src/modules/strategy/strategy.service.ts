import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy } from './entities/strategy.entity';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class StrategyService {
  constructor(
    @InjectRepository(Strategy)
    private strategyRepository: Repository<Strategy>,
    private aiService: AiService,
  ) {}

  async create(userId: string, createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    const strategy = this.strategyRepository.create({
      userId,
      ...createStrategyDto,
    });
    return this.strategyRepository.save(strategy);
  }

  async findAllByUser(userId: string): Promise<Strategy[]> {
    return this.strategyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string): Promise<Strategy> {
    const strategy = await this.strategyRepository.findOne({
      where: { id, userId },
    });
    if (!strategy) {
      throw new NotFoundException('策略不存在');
    }
    return strategy;
  }

  async update(id: string, userId: string, data: Partial<Strategy>): Promise<Strategy> {
    await this.findById(id, userId);
    await this.strategyRepository.update(id, data);
    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const strategy = await this.findById(id, userId);
    await this.strategyRepository.remove(strategy);
  }

  async generateRecommendations(id: string, userId: string): Promise<Strategy> {
    const strategy = await this.findById(id, userId);

    // 调用 AI 生成策略建议
    const response = await this.aiService.chat([
      {
        role: 'system',
        content: '你是一个专业的 AI SEO 策略专家。请根据提供的信息生成详细的策略建议。',
      },
      {
        role: 'user',
        content: `请为以下网站生成 SEO 策略建议：
        网站: ${strategy.targetUrl}
        行业: ${strategy.industry || '未指定'}
        目标关键词: ${(strategy.targetKeywords || []).join(', ')}
        竞争对手: ${(strategy.competitors || []).map((c) => c.name).join(', ')}
        
        请以 JSON 格式返回包含 category、priority、title、description、action 字段的建议列表。`,
      },
    ]);

    try {
      const recommendations = JSON.parse(response);
      return this.update(id, userId, { recommendations: recommendations as Strategy['recommendations'] });
    } catch {
      // 如果解析失败，使用默认建议
      const defaultRecommendations: Strategy['recommendations'] = [
        {
          category: 'content',
          priority: 'high',
          title: '优化内容策略',
          description: '创建高质量、长篇的 FAQ 内容',
          recommendation: '开始创建内容',
        },
        {
          category: 'technical',
          priority: 'high',
          title: '添加结构化数据',
          description: '为网站添加 Schema.org 标记',
          recommendation: '查看实施指南',
        },
      ];
      return this.update(id, userId, { recommendations: defaultRecommendations });
    }
  }

  async generateContentPlan(id: string, userId: string): Promise<Strategy> {
    const strategy = await this.findById(id, userId);

    const response = await this.aiService.chat([
      {
        role: 'system',
        content: '你是一个专业的内容营销规划专家。',
      },
      {
        role: 'user',
        content: `请为以下网站生成内容计划：
        关键词: ${(strategy.targetKeywords || []).join(', ')}
        行业: ${strategy.industry || '未指定'}
        
        请以 JSON 格式返回内容计划，包含 topics(主题列表，每项有 keyword、priority、estimatedWords)、contentTypes(内容类型数组)、publishingFrequency(发布频率)。`,
      },
    ]);

    try {
      const contentPlan = JSON.parse(response);
      return this.update(id, userId, { contentPlan });
    } catch {
      return strategy;
    }
  }
}
