import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnoseReport, DiagnoseStatus } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';

@Injectable()
export class DiagnoseService {
  constructor(
    @InjectRepository(DiagnoseReport)
    private diagnoseRepository: Repository<DiagnoseReport>,
  ) {}

  async create(userId: string, createDiagnoseDto: CreateDiagnoseDto) {
    const report = this.diagnoseRepository.create({
      userId,
      ...createDiagnoseDto,
      status: DiagnoseStatus.PENDING,
    });
    return this.diagnoseRepository.save(report);
  }

  async findAllByUser(userId: string) {
    return this.diagnoseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string) {
    const report = await this.diagnoseRepository.findOne({
      where: { id, userId },
    });
    if (!report) {
      throw new NotFoundException('诊断报告不存在');
    }
    return report;
  }

  async updateStatus(id: string, status: DiagnoseStatus, data?: Partial<DiagnoseReport>) {
    const updateData: Partial<DiagnoseReport> = { status };
    if (status === DiagnoseStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }
    if (data) {
      Object.assign(updateData, data);
    }
    return this.diagnoseRepository.update(id, updateData);
  }

  async delete(id: string, userId: string) {
    const report = await this.findById(id, userId);
    return this.diagnoseRepository.remove(report);
  }

  async runDiagnose(id: string, userId: string) {
    const report = await this.findById(id, userId);
    
    // 更新状态为运行中
    await this.updateStatus(id, DiagnoseStatus.RUNNING);

    try {
      // TODO: 调用 AI 服务进行实际诊断
      // 这里暂时返回模拟数据
      const diagnosisResult = await this.performDiagnosis(report);

      await this.diagnoseRepository.update(id, {
        seoScore: diagnosisResult.seoScore,
        issues: diagnosisResult.issues,
        aiSearchPresence: diagnosisResult.aiSearchPresence,
        status: DiagnoseStatus.COMPLETED,
        completedAt: new Date(),
      });

      return this.findById(id, userId);
    } catch (error) {
      await this.updateStatus(id, DiagnoseStatus.FAILED);
      throw error;
    }
  }

  private async performDiagnosis(report: DiagnoseReport): Promise<{
    seoScore: DiagnoseReport['seoScore'];
    issues: DiagnoseReport['issues'];
    aiSearchPresence: DiagnoseReport['aiSearchPresence'];
  }> {
    // TODO: 实现实际诊断逻辑
    // 1. 爬取目标网站
    // 2. 分析 SEO 指标
    // 3. 检查 AI 搜索引擎表现
    // 4. 生成问题列表和建议
    
    return {
      seoScore: {
        overall: 72,
        technical: 68,
        content: 75,
        authority: 70,
        performance: 78,
      },
      issues: [
        {
          category: 'technical',
          severity: 'high' as const,
          title: '缺少结构化数据标记',
          description: '网站未添加 Schema.org 结构化数据',
          recommendation: '添加 Organization、Product 等结构化数据标记',
        },
        {
          category: 'content',
          severity: 'medium' as const,
          title: '内容缺乏深度',
          description: '页面内容较浅，缺少专业深度内容',
          recommendation: '增加 FAQ、产品对比等专业内容',
        },
      ],
      aiSearchPresence: {
        score: 45,
        coverage: 30,
        mentions: 12,
        sentiment: 'neutral',
      },
    };
  }
}
