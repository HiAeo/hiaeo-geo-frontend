import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',       // 待支付
  PAID = 'paid',           // 已支付
  CANCELLED = 'cancelled',  // 已取消
  REFUNDED = 'refunded',    // 已退款
}

export enum PaymentMethod {
  ALIPAY = 'alipay',       // 支付宝
  WECHAT = 'wechat',       // 微信支付
  CARD = 'card',          // 银行卡
}

export class CreateOrderDto {
  @ApiProperty({ description: '套餐类型' })
  @IsString()
  planType: string;

  @ApiPropertyOptional({ description: '订阅时长（月）' })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ description: '优惠券码' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ description: '支付方式', enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}

export class PayOrderDto {
  @ApiProperty({ description: '订单ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: '支付方式', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ description: '支付密码（某些场景需要）' })
  @IsOptional()
  @IsString()
  paymentPassword?: string;
}

export class CancelOrderDto {
  @ApiProperty({ description: '订单ID' })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({ description: '取消原因' })
  @IsOptional()
  @IsString()
  reason?: string;
}
