import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('设置')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('subscription')
  @ApiOperation({ summary: '获取订阅信息' })
  async getSubscription(@Request() req) {
    return this.settingsService.getSubscription(req.user.id);
  }

  @Get('plans')
  @ApiOperation({ summary: '获取定价方案' })
  async getPricingPlans() {
    return this.settingsService.getPricingPlans();
  }
}
