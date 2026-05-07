import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiagnoseService } from './diagnose.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';

@ApiTags('模镜诊断')
@Controller('diagnose')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DiagnoseController {
  constructor(private readonly diagnoseService: DiagnoseService) {}

  @Post()
  @ApiOperation({ summary: '创建诊断任务' })
  async create(@Request() req, @Body() createDiagnoseDto: CreateDiagnoseDto) {
    return this.diagnoseService.create(req.user.id, createDiagnoseDto);
  }

  @Get()
  @ApiOperation({ summary: '获取诊断报告列表' })
  async findAll(@Request() req) {
    return this.diagnoseService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取诊断报告详情' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.diagnoseService.findById(id, req.user.id);
  }

  @Post(':id/run')
  @ApiOperation({ summary: '执行诊断任务' })
  async runDiagnose(@Request() req, @Param('id') id: string) {
    return this.diagnoseService.runDiagnose(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除诊断报告' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.diagnoseService.delete(id, req.user.id);
  }
}
