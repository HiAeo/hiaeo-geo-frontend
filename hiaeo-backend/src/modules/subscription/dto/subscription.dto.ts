import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export class GetPlansDto {
  @ApiPropertyOptional({ description: '是否包含已停售套餐' })
  @IsOptional()
  @IsString()
  includeDeprecated?: string;
}

export class CreateSubscriptionDto {
  @ApiProperty({ description: '套餐类型', enum: PlanType })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiPropertyOptional({ description: '订阅时长（月）' })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ description: '优惠券码' })
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class RenewSubscriptionDto {
  @ApiProperty({ description: '当前订阅ID' })
  @IsString()
  subscriptionId: string;

  @ApiPropertyOptional({ description: '订阅时长（月）' })
  @IsOptional()
  @IsNumber()
  duration?: number;
}
