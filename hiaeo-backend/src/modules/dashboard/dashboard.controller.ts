import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('魔鲸Hub')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取概览数据' })
  async getOverview(@Request() req) {
    return this.dashboardService.getOverview(req.user.id);
  }

  @Get('seo-trend')
  @ApiOperation({ summary: '获取 SEO 趋势数据' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getSeoTrend(@Request() req, @Query('days') days?: number) {
    return this.dashboardService.getSeoTrend(req.user.id, days || 30);
  }

  @Get('ai-presence-trend')
  @ApiOperation({ summary: '获取 AI 搜索存在感趋势' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getAiPresenceTrend(@Request() req, @Query('days') days?: number) {
    return this.dashboardService.getAiPresenceTrend(req.user.id, days || 30);
  }

  @Get('content-stats')
  @ApiOperation({ summary: '获取内容统计' })
  async getContentStats(@Request() req) {
    return this.dashboardService.getContentStats(req.user.id);
  }

  @Get('keywords')
  @ApiOperation({ summary: '获取关键词表现' })
  async getKeywordsPerformance(@Request() req) {
    return this.dashboardService.getKeywordsPerformance(req.user.id);
  }
}
