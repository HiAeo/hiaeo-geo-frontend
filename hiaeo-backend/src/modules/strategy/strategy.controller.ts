import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStrategyDto } from './dto/create-strategy.dto';

@ApiTags('模豆策略')
@Controller('strategy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  @ApiOperation({ summary: '创建策略' })
  async create(@Request() req, @Body() createStrategyDto: CreateStrategyDto) {
    return this.strategyService.create(req.user.id, createStrategyDto);
  }

  @Get()
  @ApiOperation({ summary: '获取策略列表' })
  async findAll(@Request() req) {
    return this.strategyService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取策略详情' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.strategyService.findById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新策略' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.strategyService.update(id, req.user.id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除策略' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.strategyService.delete(id, req.user.id);
    return { success: true };
  }

  @Post(':id/recommendations')
  @ApiOperation({ summary: '生成策略建议' })
  async generateRecommendations(@Request() req, @Param('id') id: string) {
    return this.strategyService.generateRecommendations(id, req.user.id);
  }

  @Post(':id/content-plan')
  @ApiOperation({ summary: '生成内容计划' })
  async generateContentPlan(@Request() req, @Param('id') id: string) {
    return this.strategyService.generateContentPlan(id, req.user.id);
  }
}
