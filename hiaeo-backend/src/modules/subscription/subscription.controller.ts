import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, RenewSubscriptionDto } from './dto/subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('订阅')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  @ApiOperation({ summary: '获取所有可用套餐' })
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('plans/:planId')
  @ApiOperation({ summary: '获取套餐详情' })
  async getPlanById(@Param('planId') planId: string) {
    const plan = await this.subscriptionService.getPlanById(planId);
    if (!plan) {
      return { error: '套餐不存在' };
    }
    return plan;
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前订阅状态' })
  async getCurrentSubscription(@Request() req) {
    return this.subscriptionService.getUserSubscription(req.user.userId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建新订阅' })
  async createSubscription(
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.createSubscription(
      req.user.userId,
      createSubscriptionDto,
    );
  }

  @Put('cancel/:subscriptionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消订阅' })
  async cancelSubscription(
    @Request() req,
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.subscriptionService.cancelSubscription(
      req.user.userId,
      subscriptionId,
    );
  }

  @Put('renew')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '续费订阅' })
  async renewSubscription(
    @Request() req,
    @Body() renewSubscriptionDto: RenewSubscriptionDto,
  ) {
    return this.subscriptionService.renewSubscription(
      req.user.userId,
      renewSubscriptionDto,
    );
  }

  @Get('check/:feature')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查功能权限' })
  async checkPermission(@Request() req, @Param('feature') feature: string) {
    const hasPermission = await this.subscriptionService.checkPermission(
      req.user.userId,
      feature,
    );
    return { hasPermission };
  }
}
