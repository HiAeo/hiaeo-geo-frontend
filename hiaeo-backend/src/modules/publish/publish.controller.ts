import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('发布管理')
@Controller('publish')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PublishController {
  
  @Get('list')
  @ApiOperation({ summary: '获取发布记录列表' })
  async getPublishList(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
  ) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 20;
    
    // 返回模拟数据，实际应从数据库查询
    return {
      data: [],
      total: 0,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }

  @Get('platforms/status')
  @ApiOperation({ summary: '获取平台状态' })
  async getPlatformStatus(@Request() req) {
    return {
      platforms: [
        { id: 'website', name: '官网', status: 'connected', lastSync: new Date().toISOString() },
        { id: 'wechat', name: '微信公众号', status: 'connected', lastSync: new Date().toISOString() },
        { id: 'xiaohongshu', name: '小红书', status: 'connected', lastSync: new Date().toISOString() },
        { id: 'douyin', name: '抖音', status: 'disconnected', lastSync: null },
        { id: 'weibo', name: '微博', status: 'disconnected', lastSync: null },
        { id: 'baidu', name: '百度', status: 'connected', lastSync: new Date().toISOString() },
      ]
    };
  }

  @Post('export')
  @ApiOperation({ summary: '导出内容' })
  async exportContent(@Request() req, @Body() data: any) {
    return { success: true, message: '导出任务已创建' };
  }
}
