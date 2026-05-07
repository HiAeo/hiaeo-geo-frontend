import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContentDto, GenerateContentDto, UpdateContentDto } from './dto/create-content.dto';
import { ContentStatus } from './entities/content.entity';

@ApiTags('模法执行')
@Controller('content')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: '创建内容' })
  async create(@Request() req, @Body() createContentDto: CreateContentDto) {
    return this.contentService.create(req.user.id, createContentDto);
  }

  @Get()
  @ApiOperation({ summary: '获取内容列表' })
  @ApiQuery({ name: 'status', required: false, enum: ContentStatus })
  async findAll(@Request() req, @Query('status') status?: ContentStatus) {
    return this.contentService.findAllByUser(req.user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取内容详情' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.contentService.findById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新内容' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(id, req.user.id, updateContentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除内容' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.contentService.delete(id, req.user.id);
    return { success: true };
  }

  @Post('generate')
  @ApiOperation({ summary: 'AI 生成内容' })
  async generate(@Request() req, @Body() generateDto: GenerateContentDto) {
    return this.contentService.generate(req.user.id, generateDto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布内容' })
  async publish(@Request() req, @Param('id') id: string) {
    return this.contentService.publish(id, req.user.id);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: '定时发布内容' })
  async schedule(
    @Request() req,
    @Param('id') id: string,
    @Body('scheduledAt') scheduledAt: string,
  ) {
    return this.contentService.schedule(id, req.user.id, new Date(scheduledAt));
  }

  @Post(':id/publish-platforms')
  @ApiOperation({ summary: '发布到 AI 平台' })
  async publishToPlatforms(
    @Request() req,
    @Param('id') id: string,
    @Body('platforms') platforms: string[],
  ) {
    return this.contentService.publishToAiPlatform(id, req.user.id, platforms);
  }
}
