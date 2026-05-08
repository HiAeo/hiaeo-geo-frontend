import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrderService, OrderStatus } from './order.service';
import { CreateOrderDto, PayOrderDto, CancelOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('订单')
@Controller('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiOperation({ summary: '创建订单' })
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.userId, createOrderDto);
  }

  @Get('list')
  @ApiOperation({ summary: '获取订单列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  async getOrderList(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderService.getUserOrders(req.user.userId, { page, limit, status });
  }

  @Get(':orderId')
  @ApiOperation({ summary: '获取订单详情' })
  async getOrderDetail(@Request() req, @Param('orderId') orderId: string) {
    const order = await this.orderService.getOrderById(req.user.userId, orderId);
    if (!order) {
      return { error: '订单不存在' };
    }
    return order;
  }

  @Post('pay')
  @ApiOperation({ summary: '支付订单' })
  async payOrder(@Request() req, @Body() payOrderDto: PayOrderDto) {
    return this.orderService.payOrder(req.user.userId, payOrderDto);
  }

  @Put('cancel')
  @ApiOperation({ summary: '取消订单' })
  async cancelOrder(@Request() req, @Body() cancelOrderDto: CancelOrderDto) {
    return this.orderService.cancelOrder(req.user.userId, cancelOrderDto);
  }

  @Put(':orderId/refund')
  @ApiOperation({ summary: '申请退款' })
  async refundOrder(
    @Request() req,
    @Param('orderId') orderId: string,
    @Body('reason') reason?: string,
  ) {
    return this.orderService.refundOrder(req.user.userId, orderId, reason || '用户主动退款');
  }

  @Get('stats/summary')
  @ApiOperation({ summary: '获取订单统计' })
  async getOrderStats(@Request() req) {
    return this.orderService.getOrderStats(req.user.userId);
  }

  @Get('coupon/validate/:code')
  @ApiOperation({ summary: '验证优惠券' })
  async validateCoupon(@Param('code') code: string) {
    return this.orderService.validateCoupon(code);
  }
}
