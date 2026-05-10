import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDeployDto {
  @ApiProperty({ description: '发布平台 ID', example: 'wechat-miniprogram' })
  @IsString()
  platform: string;

  @ApiProperty({ description: '内容类型', example: 'strategy' })
  @IsString()
  type: string;

  @ApiProperty({ description: '内容 ID 列表', example: [1, 2, 3] })
  @IsArray()
  contentIds: number[];

  @ApiProperty({ description: '平台特定配置', required: false })
  @IsOptional()
  config?: Record<string, any>;
}
