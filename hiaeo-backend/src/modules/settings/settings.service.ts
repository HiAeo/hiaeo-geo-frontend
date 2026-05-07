import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SettingsService {
  constructor(private usersService: UsersService) {}

  async getSubscription(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      tier: user.subscriptionTier,
      expiresAt: user.subscriptionExpiresAt,
      credits: user.credits,
      features: this.getFeaturesByTier(user.subscriptionTier),
    };
  }

  private getFeaturesByTier(tier: string) {
    const features = {
      free: {
        diagnoses: 3,
        strategies: 2,
        contentGenerations: 5,
        aiPlatforms: ['douban'],
        support: 'email',
      },
      pro: {
        diagnoses: 50,
        strategies: 20,
        contentGenerations: 200,
        aiPlatforms: ['deepseek', 'douban', 'baidu'],
        support: 'priority',
      },
      enterprise: {
        diagnoses: -1,
        strategies: -1,
        contentGenerations: -1,
        aiPlatforms: ['deepseek', 'douban', 'baidu', 'custom'],
        support: 'dedicated',
      },
    };
    return features[tier] || features.free;
  }

  async addCredits(userId: string, amount: number) {
    const user = await this.usersService.findById(userId);
    const newCredits = (user.credits || 0) + amount;
    await this.usersService.updateCredits(userId, newCredits);
    return { credits: newCredits };
  }

  async getPricingPlans() {
    return [
      {
        id: 'free',
        name: '免费版',
        price: 0,
        period: '永久',
        features: [
          '3 次网站诊断',
          '2 个 SEO 策略',
          '5 次内容生成',
          '豆包平台发布',
          '基础数据分析',
        ],
      },
      {
        id: 'pro',
        name: '专业版',
        price: 99,
        period: '月',
        features: [
          '50 次网站诊断',
          '20 个 SEO 策略',
          '200 次内容生成',
          '全平台发布',
          '高级数据分析',
          '优先客服支持',
        ],
        recommended: true,
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: 399,
        period: '月',
        features: [
          '无限网站诊断',
          '无限 SEO 策略',
          '无限内容生成',
          '自定义 AI 平台',
          'API 开放接口',
          '专属客户经理',
          '定制化服务',
        ],
      },
    ];
  }
}
