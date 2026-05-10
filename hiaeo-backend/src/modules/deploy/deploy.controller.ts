import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeployService } from './deploy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDeployDto } from './dto/create-deploy.dto';

@ApiTags('一键发布')
@Controller('deploy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Get('platforms')
  @ApiOperation({ summary: '获取支持的发布平台列表' })
  async getPlatforms() {
    return this.deployService.getPlatforms();
  }

  @Get('history')
  @ApiOperation({ summary: '获取发布历史' })
  async getHistory(@Request() req, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.deployService.getHistory(req.user.id, +page, +limit);
  }

  @Post()
  @ApiOperation({ summary: '一键发布' })
  async deploy(@Request() req, @Body() createDeployDto: CreateDeployDto) {
    return this.deployService.deploy(req.user.id, createDeployDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取发布详情' })
  async getDeploy(@Param('id') id: string) {
    return this.deployService.getDeploy(+id);
  }
}
