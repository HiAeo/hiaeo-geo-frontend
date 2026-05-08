import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentMethod, CreateOrderDto, PayOrderDto, CancelOrderDto } from './dto/order.dto';

// 重新导出枚举供其他模块使用
export { OrderStatus, PaymentMethod } from './dto/order.dto';

// 订单数据接口
export interface Order {
  id: string;
  userId: string;
  planType: string;
  planName: string;
  duration: number;
  amount: number;
  originalAmount: number;
  discount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

// 套餐价格映射
const PLAN_PRICES: Record<string, number> = {
  free: 0,
  basic: 999,
  pro: 2999,
  enterprise: 9999,
}

const orders = new Map<string, Order>();

@Injectable()
export class OrderService {
  /**
   * 创建订单
   */
  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    const planPrice = PLAN_PRICES[dto.planType] || 0;
    const duration = dto.duration || 1;
    const amount = planPrice * duration;
    
    // 模拟折扣计算
    let discount = 0;
    if (dto.couponCode === 'WELCOME10') {
      discount = Math.round(amount * 0.1);
    } else if (dto.couponCode === 'YEAR20' && duration >= 12) {
      discount = Math.round(amount * 0.2);
    }
    
    const finalAmount = amount - discount;

    const order: Order = {
      id: `ORD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userId,
      planType: dto.planType,
      planName: this.getPlanName(dto.planType),
      duration,
      amount: finalAmount,
      originalAmount: amount,
      discount,
      status: OrderStatus.PENDING,
      paymentMethod: dto.paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.set(order.id, order);

    return order;
  }

  /**
   * 获取订单详情
   */
  async getOrderById(userId: string, orderId: string): Promise<Order | null> {
    const order = orders.get(orderId);
    if (!order || order.userId !== userId) {
      return null;
    }
    return order;
  }

  /**
   * 获取用户订单列表
   */
  async getUserOrders(
    userId: string,
    options: { page?: number; limit?: number; status?: OrderStatus } = {},
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    
    let userOrders = Array.from(orders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 状态筛选
    if (options.status) {
      userOrders = userOrders.filter((o) => o.status === options.status);
    }

    const total = userOrders.length;
    const start = (page - 1) * limit;
    const paginatedOrders = userOrders.slice(start, start + limit);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
    };
  }

  /**
   * 支付订单
   */
  async payOrder(userId: string, dto: PayOrderDto): Promise<Order> {
    const order = orders.get(dto.orderId);
    
    if (!order) {
      throw new Error('订单不存在');
    }
    
    if (order.userId !== userId) {
      throw new Error('无权操作此订单');
    }
    
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('订单状态不允许支付');
    }

    // 模拟支付处理
    // 实际场景中这里会调用支付宝/微信支付接口
    const paymentResult = await this.processPayment(order, dto.paymentMethod);
    
    if (paymentResult.success) {
      order.status = OrderStatus.PAID;
      order.paidAt = new Date();
      order.metadata = { transactionId: paymentResult.transactionId };
      
      // 计算订阅到期时间
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + order.duration);
      order.expiresAt = expiresAt;
    } else {
      throw new Error(paymentResult.error || '支付失败');
    }

    order.updatedAt = new Date();
    return order;
  }

  /**
   * 取消订单
   */
  async cancelOrder(userId: string, dto: CancelOrderDto): Promise<Order> {
    const order = orders.get(dto.orderId);
    
    if (!order) {
      throw new Error('订单不存在');
    }
    
    if (order.userId !== userId) {
      throw new Error('无权操作此订单');
    }
    
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('只有待支付的订单可以取消');
    }

    order.status = OrderStatus.CANCELLED;
    order.metadata = { cancelReason: dto.reason };
    order.updatedAt = new Date();

    return order;
  }

  /**
   * 申请退款（仅已支付订单）
   */
  async refundOrder(userId: string, orderId: string, reason: string): Promise<Order> {
    const order = orders.get(orderId);
    
    if (!order) {
      throw new Error('订单不存在');
    }
    
    if (order.userId !== userId) {
      throw new Error('无权操作此订单');
    }
    
    if (order.status !== OrderStatus.PAID) {
      throw new Error('只有已支付的订单可以申请退款');
    }

    // 实际场景中这里会调用支付渠道的退款接口
    order.status = OrderStatus.REFUNDED;
    order.metadata = { refundReason: reason, refundedAt: new Date() };
    order.updatedAt = new Date();

    return order;
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    paidOrders: number;
    pendingOrders: number;
  }> {
    const userOrders = Array.from(orders.values()).filter((o) => o.userId === userId);
    
    return {
      totalOrders: userOrders.length,
      totalSpent: userOrders
        .filter((o) => o.status === OrderStatus.PAID)
        .reduce((sum, o) => sum + o.amount, 0),
      paidOrders: userOrders.filter((o) => o.status === OrderStatus.PAID).length,
      pendingOrders: userOrders.filter((o) => o.status === OrderStatus.PENDING).length,
    };
  }

  /**
   * 验证优惠券
   */
  async validateCoupon(code: string): Promise<{
    valid: boolean;
    discount?: number;
    message?: string;
  }> {
    const coupons: Record<string, { discount: number; minDuration?: number; description: string }> = {
      WELCOME10: { discount: 10, description: '新用户立减10%' },
      YEAR20: { discount: 20, minDuration: 12, description: '年付立减20%' },
      VIP30: { discount: 30, description: 'VIP用户专享30%折扣' },
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      return { valid: false, message: '优惠券不存在' };
    }

    return {
      valid: true,
      discount: coupon.discount,
      message: coupon.description,
    };
  }

  /**
   * 模拟支付处理
   */
  private async processPayment(
    order: Order,
    paymentMethod: PaymentMethod,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // 模拟支付延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟支付结果（实际场景中由支付渠道返回）
    return {
      success: true,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    };
  }

  /**
   * 获取套餐名称
   */
  private getPlanName(planType: string): string {
    const names: Record<string, string> = {
      free: '免费版',
      basic: '基础版',
      pro: '专业版',
      enterprise: '企业版',
    };
    return names[planType] || planType;
  }
}
