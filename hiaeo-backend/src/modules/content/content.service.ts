import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentStatus } from './entities/content.entity';
import { CreateContentDto, GenerateContentDto, UpdateContentDto } from './dto/create-content.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private aiService: AiService,
  ) {}

  async create(userId: string, createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create({
      userId,
      ...createContentDto,
      status: ContentStatus.DRAFT,
    });
    return this.contentRepository.save(content);
  }

  async findAllByUser(userId: string, status?: ContentStatus): Promise<Content[]> {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    return this.contentRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id, userId },
    });
    if (!content) {
      throw new NotFoundException('内容不存在');
    }
    return content;
  }

  async update(id: string, userId: string, data: UpdateContentDto): Promise<Content> {
    await this.findById(id, userId);
    await this.contentRepository.update(id, data);
    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const content = await this.findById(id, userId);
    await this.contentRepository.remove(content);
  }

  async generate(userId: string, generateDto: GenerateContentDto): Promise<Content> {
    // 创建草稿
    const content = await this.create(userId, {
      title: `${generateDto.topic} - 生成中...`,
      keywords: generateDto.keywords,
    });

    // 更新状态为生成中
    await this.contentRepository.update(content.id, {
      status: ContentStatus.GENERATING,
    });

    try {
      // 调用 AI 生成内容
      const generated = await this.aiService.generateSeoContent({
        topic: generateDto.topic,
        keywords: generateDto.keywords || [],
        targetAudience: generateDto.targetAudience || '普通用户',
        tone: generateDto.tone || 'professional',
        length: generateDto.length || 'medium',
      });

      // 分析内容 SEO
      const analysis = await this.aiService.analyzeContent({
        content: generated.content,
        keywords: generateDto.keywords || [],
      });

      // 更新内容
      await this.contentRepository.update(content.id, {
        title: generated.title,
        body: generated.content,
        metaDescription: generated.metaDescription,
        seoAnalysis: analysis,
        status: ContentStatus.DRAFT,
      });

      return this.findById(content.id, userId);
    } catch (error) {
      await this.contentRepository.update(content.id, {
        status: ContentStatus.DRAFT,
        title: `${generateDto.topic} - 生成失败`,
      });
      throw error;
    }
  }

  async publish(id: string, userId: string): Promise<Content> {
    const content = await this.findById(id, userId);
    return this.contentRepository.save({
      ...content,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    });
  }

  async schedule(id: string, userId: string, scheduledAt: Date): Promise<Content> {
    const content = await this.findById(id, userId);
    return this.contentRepository.save({
      ...content,
      status: ContentStatus.SCHEDULED,
      scheduledAt,
    });
  }

  async publishToAiPlatform(
    id: string,
    userId: string,
    platforms: string[],
  ): Promise<Content> {
    const content = await this.findById(id, userId);
    
    // TODO: 实现实际的多平台发布逻辑
    const aiPlatforms = platforms.map((platform) => ({
      platform,
      published: true,
      publishedAt: new Date(),
      url: `https://${platform}.com/post/${content.id}`,
    }));

    return this.contentRepository.save({
      ...content,
      aiPlatforms,
    });
  }
}
