import { Injectable } from '@nestjs/common';
import { PlanType, CreateSubscriptionDto, RenewSubscriptionDto } from './dto/subscription.dto';

// 套餐配置
export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  features: string[];
  limits: {
    diagnosisEngines: number;
    diagnosisQuestions: number;
    strategyTypes: number;
    contentPerMonth: number;
    competitors: number;
    hubViews: string[];
    apiAccess: boolean;
    dedicatedSupport: boolean;
    dataIsolation: boolean;
  };
  recommended?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    id: PlanType.FREE,
    name: '免费版',
    price: 0,
    originalPrice: 0,
    period: '永久',
    features: [
      '1次基础诊断',
      '1个AI引擎',
      '10条轻量问题',
      '基础看板',
      '社区支持',
    ],
    limits: {
      diagnosisEngines: 1,
      diagnosisQuestions: 10,
      strategyTypes: 1,
      contentPerMonth: 0,
      competitors: 0,
      hubViews: ['basic'],
      apiAccess: false,
      dedicatedSupport: false,
      dataIsolation: false,
    },
  },
  {
    id: PlanType.BASIC,
    name: '基础版',
    price: 999,
    originalPrice: 1299,
    period: '月付',
    features: [
      '全引擎诊断',
      '100+条问题',
      '基础策略生成',
      '完整看板',
      '邮件支持',
    ],
    limits: {
      diagnosisEngines: 6,
      diagnosisQuestions: 100,
      strategyTypes: 3,
      contentPerMonth: 10,
      competitors: 1,
      hubViews: ['basic', 'operator'],
      apiAccess: false,
      dedicatedSupport: false,
      dataIsolation: false,
    },
  },
  {
    id: PlanType.PRO,
    name: '专业版',
    price: 2999,
    originalPrice: 3999,
    period: '月付',
    features: [
      '全引擎深度诊断',
      '全部策略类型',
      '100篇/月内容生成',
      '3个竞品监控',
      '全角色视图',
      '优先邮件支持',
    ],
    limits: {
      diagnosisEngines: 6,
      diagnosisQuestions: 200,
      strategyTypes: 5,
      contentPerMonth: 100,
      competitors: 3,
      hubViews: ['basic', 'operator', 'boss'],
      apiAccess: false,
      dedicatedSupport: false,
      dataIsolation: false,
    },
    recommended: true,
  },
  {
    id: PlanType.ENTERPRISE,
    name: '企业版',
    price: 9999,
    originalPrice: 12999,
    period: '月起',
    features: [
      '无限诊断',
      '无限内容生成',
      '无限竞品监控',
      '私有化部署',
      'API对接',
      '专属客户成功经理',
      '数据隔离',
      '7x12小时支持',
    ],
    limits: {
      diagnosisEngines: -1, // -1 表示无限制
      diagnosisQuestions: -1,
      strategyTypes: -1,
      contentPerMonth: -1,
      competitors: -1,
      hubViews: ['basic', 'operator', 'boss', 'tech'],
      apiAccess: true,
      dedicatedSupport: true,
      dataIsolation: true,
    },
  },
];

// 模拟用户订阅数据
interface UserSubscription {
  id: string;
  userId: string;
  planId: PlanType;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

const userSubscriptions = new Map<string, UserSubscription>();

@Injectable()
export class SubscriptionService {
  /**
   * 获取所有可用套餐
   */
  async getPlans() {
    return PLANS.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice,
      period: plan.period,
      features: plan.features,
      limits: plan.limits,
      recommended: plan.recommended || false,
    }));
  }

  /**
   * 获取单个套餐详情
   */
  async getPlanById(planId: string) {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) {
      return null;
    }
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice,
      period: plan.period,
      features: plan.features,
      limits: plan.limits,
      recommended: plan.recommended || false,
    };
  }

  /**
   * 创建订阅
   */
  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    const plan = PLANS.find((p) => p.id === dto.planType);
    if (!plan) {
      throw new Error('套餐不存在');
    }

    // 检查用户是否已有活跃订阅
    const existingSub = this.getUserActiveSubscription(userId);
    if (existingSub && dto.planType !== PlanType.FREE) {
      throw new Error('您已有活跃订阅，请先取消或等待到期');
    }

    const now = new Date();
    const duration = dto.duration || 1;
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + duration);

    const subscription: UserSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId: dto.planType,
      status: 'active',
      startDate: now,
      endDate,
      autoRenew: false,
    };

    userSubscriptions.set(userId, subscription);

    return {
      id: subscription.id,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      price: plan.price * duration,
      orderId: `order_${Date.now()}`,
    };
  }

  /**
   * 获取用户订阅信息
   */
  async getUserSubscription(userId: string) {
    const subscription = this.getUserActiveSubscription(userId);
    
    if (!subscription) {
      // 返回免费版信息
      const freePlan = PLANS.find((p) => p.id === PlanType.FREE)!;
      return {
        id: null,
        planId: PlanType.FREE,
        planName: freePlan.name,
        status: 'free',
        startDate: null,
        endDate: null,
        features: freePlan.features,
        limits: freePlan.limits,
      };
    }

    const plan = PLANS.find((p) => p.id === subscription.planId)!;
    
    return {
      id: subscription.id,
      planId: subscription.planId,
      planName: plan.name,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      autoRenew: subscription.autoRenew,
      features: plan.features,
      limits: plan.limits,
      daysRemaining: Math.ceil(
        (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      ),
    };
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(userId: string, subscriptionId: string) {
    const subscription = userSubscriptions.get(userId);
    
    if (!subscription || subscription.id !== subscriptionId) {
      throw new Error('订阅不存在');
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;

    return {
      message: '订阅已取消',
      effectiveDate: subscription.endDate,
    };
  }

  /**
   * 续费订阅
   */
  async renewSubscription(userId: string, dto: RenewSubscriptionDto) {
    const subscription = userSubscriptions.get(userId);
    
    if (!subscription || subscription.id !== dto.subscriptionId) {
      throw new Error('订阅不存在');
    }

    if (subscription.status === 'cancelled') {
      subscription.status = 'active';
    }

    const duration = dto.duration || 1;
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + duration);
    subscription.endDate = newEndDate;

    const plan = PLANS.find((p) => p.id === subscription.planId)!;

    return {
      id: subscription.id,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      price: plan.price * duration,
    };
  }

  /**
   * 获取用户活跃订阅
   */
  private getUserActiveSubscription(userId: string): UserSubscription | undefined {
    const subscription = userSubscriptions.get(userId);
    if (!subscription) return undefined;
    if (subscription.status === 'cancelled') return undefined;
    if (new Date() > subscription.endDate) {
      subscription.status = 'expired';
      return undefined;
    }
    return subscription;
  }

  /**
   * 检查用户功能权限
   */
  async checkPermission(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    const plan = PLANS.find((p) => p.id === subscription.planId);
    
    if (!plan) return false;

    // 根据功能名称检查权限
    const featureMap: Record<string, keyof PlanConfig['limits']> = {
      diagnosisEngines: 'diagnosisEngines',
      diagnosisQuestions: 'diagnosisQuestions',
      strategyTypes: 'strategyTypes',
      contentPerMonth: 'contentPerMonth',
      competitors: 'competitors',
      apiAccess: 'apiAccess',
      dedicatedSupport: 'dedicatedSupport',
      dataIsolation: 'dataIsolation',
    };

    const limitKey = featureMap[feature];
    if (!limitKey) return false;

    const limit = plan.limits[limitKey] as number | boolean | string[];
    if (typeof limit === 'boolean') return limit;
    if (typeof limit === 'number' && limit === -1) return true;
    if (typeof limit === 'number') return limit > 0;
    return false;
  }
}
