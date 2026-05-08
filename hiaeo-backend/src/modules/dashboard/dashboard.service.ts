import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnoseReport } from '../diagnose/entities/diagnose.entity';
import { Strategy } from '../strategy/entities/strategy.entity';
import { Content } from '../content/entities/content.entity';
import { ContentStatus } from '../content/entities/content.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DiagnoseReport)
    private diagnoseRepository: Repository<DiagnoseReport>,
    @InjectRepository(Strategy)
    private strategyRepository: Repository<Strategy>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async getOverview(userId: string) {
    // 获取统计数据
    const [
      totalDiagnoses,
      totalStrategies,
      totalContents,
      publishedContents,
    ] = await Promise.all([
      this.diagnoseRepository.count({ where: { userId } }),
      this.strategyRepository.count({ where: { userId } }),
      this.contentRepository.count({ where: { userId } }),
      this.contentRepository.count({
        where: { userId, status: 'published' as ContentStatus },
      }),
    ]);

    // 获取最近的活动
    const recentDiagnoses = await this.diagnoseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentContents = await this.contentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      stats: {
        totalDiagnoses,
        totalStrategies,
        totalContents,
        publishedContents,
        draftContents: totalContents - publishedContents,
      },
      recentDiagnoses,
      recentContents,
    };
  }

  async getSeoTrend(userId: string, days = 30) {
    const diagnoses = await this.diagnoseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: days,
    });

    return diagnoses.map((d) => ({
      date: d.createdAt,
      score: d.seoScore?.overall || 0,
      technical: d.seoScore?.technical || 0,
      content: d.seoScore?.content || 0,
      authority: d.seoScore?.authority || 0,
      performance: d.seoScore?.performance || 0,
    }));
  }

  async getAiPresenceTrend(userId: string, days = 30) {
    const diagnoses = await this.diagnoseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: days,
    });

    return diagnoses.map((d) => ({
      date: d.createdAt,
      score: d.aiSearchPresence?.score || 0,
      coverage: d.aiSearchPresence?.coverage || 0,
      mentions: d.aiSearchPresence?.mentions || 0,
    }));
  }

  async getContentStats(userId: string) {
    const contents = await this.contentRepository.find({ where: { userId } });

    const stats = {
      total: contents.length,
      published: contents.filter((c) => c.status === 'published').length,
      draft: contents.filter((c) => c.status === 'draft').length,
      scheduled: contents.filter((c) => c.status === 'scheduled').length,
      totalViews: contents.reduce((sum, c) => sum + (c.views || 0), 0),
      totalLikes: contents.reduce((sum, c) => sum + (c.likes || 0), 0),
    };

    return stats;
  }

  async getKeywordsPerformance(userId: string) {
    const strategies = await this.strategyRepository.find({
      where: { userId },
    });

    const keywords: Array<{ keyword: string; count: number }> = [];
    strategies.forEach((strategy) => {
      (strategy.targetKeywords || []).forEach((kw) => {
        const existing = keywords.find((k) => k.keyword === kw);
        if (existing) {
          existing.count++;
        } else {
          keywords.push({ keyword: kw, count: 1 });
        }
      });
    });

    return keywords.sort((a, b) => b.count - a.count);
  }
}
